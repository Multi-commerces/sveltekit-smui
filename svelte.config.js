import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	// https://kit.svelte.dev/docs/configuration
	kit: {
		adapter: adapter(),
		// default options are shown
		//out: 'build',
		//precompress: false,
		//envPrefix: ''
	},
	// https://kit.svelte.dev/docs/configuration#csrf
	csrf: false,
	// Configuration de la politique de sécurité du contenu .
	// CSP aide à protéger vos utilisateurs contre les attaques de script intersite (XSS),
	// en limitant les endroits à partir desquels les ressources peuvent être chargées.
	csp: {
		directives: {
			'script-src': ['self']
		},
		reportOnly: {
			'script-src': ['self']
		}
	}
};

export default config;
