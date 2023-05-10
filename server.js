import ytdl from 'ytdl-core';
import fs from 'fs';
import * as id3 from 'id3js';

import bodyParser from 'body-parser';
import cors from 'cors';
import { handler } from './build/handler.js';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const port = 3000;
const app = express();
const server = createServer(app);

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(path.join('build', 'client', 'mp3')));
app.use(cors());

//initialize the WebSocket server instance
const io = new Server(server);
io.on('connection', (socket) => {
	socket.emit('eventFromServer', 'Hello, World 👋');
});

const downloads = {};
const downloadAudio = async (videoId = 'v2AC41dglnM') => {
	return new Promise((resolve, reject) => {
		const path = `./build/client/mp3/${videoId}.mp3`;
		if (fs.existsSync(path)) {
			resolve();
		} else {
			const writable = fs.createWriteStream(path);

			let audioUrl = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' });
			audioUrl.pipe(writable);

			writable.on('close', () => {
				// Use the file here
				resolve();
			});

			writable.on('error', (error) => {
				reject(error);
			});
		}
	});
};

/**
 * Liste des fichiers MP3
 */
app.get('/mp3-list', (req, res) => {
	const mp3Dir = './build/client/mp3';
	fs.readdir(mp3Dir, (err, files) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		// Filter out non-mp3 files
		const mp3Files = files.filter((file) => file.endsWith('.mp3'));
		// Collect information for each mp3 file
		const mp3Infos = mp3Files.map((file) => {
			const filePath = path.join(mp3Dir, file);
			const { title, artist, album } = id3.fromPath(filePath);
			return { id: file.replace(".mp3", ""), name: file, title, artist, album };
		});
		res.status(200).json({ files: mp3Infos });
	});
});

/**
 * Lancer le téléchargement d'un fichier MP3
 */
app.get('/download/:id', async (req, res) => {
	const videoId = req.params.id;
	const downloadId = Date.now();
	const downloadPromise = downloadAudio(videoId);

	downloads[downloadId] = downloadPromise;
	downloadPromise
		.then(() => {
			io.emit('eventFromServer', { status: 'completed', downloadId });
			delete downloads[downloadId];
		})
		.catch((error) => {
			io.emit('eventFromServer', { status: 'completed', error: error.message, downloadId });
			delete downloads[downloadId];
		});

	res.status(200).json({ downloadId });
});

app.get('/download-status/:id', async (req, res) => {
	try {
		const downloadId = req.params.id;
		const downloadPromise = downloads[downloadId];
		if (downloadPromise) {
			res.status(200).json({ status: 'in progress' });
		} else {
			const videoId = req.params.id;
			const downloadPath = `./build/client/mp3/${videoId}.mp3`;
			if (fs.existsSync(downloadPath)) {
				res.status(200).json({ status: 'completed' });
			} else {
				res.status(200).json({ status: 'not found' });
			}
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

//start our server
server.listen(process.env.PORT || port, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});
