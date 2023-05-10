<script>
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Card, {
		Content,
		PrimaryAction,
	} from '@smui/card';

	let searchTerm = '';
	/**
	 * @type {any[]}
	 */
	let searchResults = [];

	/**
	 * @type {any[]}
	 */
	let mp3Files = [];

	/**
	 * @type {any}
	 */
	let audioUrl;
	let videoId = '';
	$: downloadStatus = 'error';

	function handleSearch() {
		// Fetch search results from the YouTube API
		fetch(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=AIzaSyAw5H1jPH6_HCOy6Bu87rhFWaaPz10ValM`
		)
			.then((response) => response.json())
			.then((data) => {
				// Use the first video in the search results
				searchResults = data.items;
			});
	}

	function handleDownload() {
		downloadStatus = 'download ...';
		audioUrl = undefined;
		fetch(`http://localhost:3000/download/${videoId}`).catch((error) => console.error(error));
	}

	/**
	 * @param {string} fileId
	 */
	function handleFileSelection(fileId) {
		videoId = fileId;
		audioUrl = `${fileId}.mp3`;
	}

	onMount(() => {
		fetch('http://localhost:3000/mp3-list')
			.then((response) => response.json())
			.then((data) => {
				mp3Files = data.files;
			})
			.catch((error) => console.error(error));

		const socket = io();
		socket.on('eventFromServer', (/** @type {any} */ resp) => {
			downloadStatus = resp.status;
			if (downloadStatus === 'completed') {
				audioUrl = `${videoId}.mp3`;
			}
		});
	});
</script>

<input type="text" bind:value={videoId} placeholder="Enter YouTube video ID" />
<button on:click={handleDownload}>Download</button>

<div>downloadStatus : {downloadStatus}</div>

{#if audioUrl}
	<div>
		<iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/{videoId}"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		/>
		<br />
		<audio controls src={audioUrl}> Your browser does not support the audio element. </audio>
	</div>
{/if}

<table>
	<thead>
		<th>File Name</th>
	</thead>
	<tbody>
		{#each mp3Files as file}
			<tr>
				<td>{file.id}</td>
				<td>
					<button on:click={() => handleFileSelection(file.id)}>Select</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div>
	<input type="text" bind:value={searchTerm} placeholder="Search YouTube" />
	<button on:click={handleSearch}>Search</button>
	<div>videoId : {videoId}</div>
	Lorsque l'utilisateur entre un terme de recherche dans le champ de saisie et clique sur "Rechercher",
	une requête est effectuée à l'API YouTube avec le terme de recherche et la clé d'API. Les résultats
	de la recherche sont ensuite affichés dans un tableau, et l'utilisateur peut sélectionner la vidéo
	qui l'intéresse pour récupérer son ID vidéo. Remarquez que vous devez remplacer "YOUR_API_KEY" par
	votre propre clé d'API

	<br />
	<h2>Résultat de recherche</h2>
	<div>
		{#each searchResults as item}
			<Card style="margin-top:1rem">
				<PrimaryAction on:click={() => handleFileSelection(item.id.videoId)}>
					<img
						src={item.snippet.thumbnails.high.url}
						alt={item.snippet.title}
						width={item.snippet.thumbnails.medium.width}
						height={item.snippet.thumbnails.medium.height}
					/>
					<Content class="mdc-typography--body2">
						<h2 class="mdc-typography--headline6" style="margin: 0;">A card with media.</h2>
						<h3 class="mdc-typography--subtitle2" style="margin: 0 0 10px; color: #888;">
							{item.snippet.title}
						</h3>
						{item.snippet.description}
					</Content>
				</PrimaryAction>
			</Card>
		{/each}
	</div>
	<pre>{JSON.stringify(searchResults, null, 2)}</pre>
</div>
