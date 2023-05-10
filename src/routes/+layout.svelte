<script lang="ts">
	import Button from '@smui/button';
	import BottomAppBar from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { Label, Icon } from '@smui/common';

	let topAppBar;

	let lightTheme =
		typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;
	function switchTheme() {
		lightTheme = !lightTheme;
		let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
		if (!themeLink) {
			themeLink = document.createElement('link');
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
		}
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
		document.head
			.querySelector<HTMLLinkElement>('link[href$="/smui-dark.css"]')
			?.insertAdjacentElement('afterend', themeLink);
	}
</script>

<div class="flexy">
	<div class="bottom-app-bar-container flexor">
		<TopAppBar bind:this={topAppBar} variant="static">
			<Row>
				<Section>
					<Title>Espace perso</Title>
				</Section>
				<Section align="end" toolbar>
					<div class="container">
						<Button on:click={switchTheme}>
							<Label>{lightTheme ? 'Lights off' : 'Lights on'}</Label>
						</Button>
					</div>
					<IconButton aria-label="GitHub" href="https://github.com/hperrin/svelte-material-ui">
						
					</IconButton>
					<IconButton aria-label="Demo Site" href="https://sveltematerialui.com">
					
					</IconButton>
				</Section>
			</Row>
		</TopAppBar>

		<div class="flexor-content">
			<AutoAdjust {topAppBar} style="display: flex; flex-direction: column;">
				<main class="container"><slot /></main>
			</AutoAdjust>
		</div>

		<div id="bottom-bar">
			<BottomAppBar variant="static">
				<Section>
					<div class="flexy">
						<IconButton class="material-icons" aria-label="Archive">archive</IconButton>
						<IconButton class="material-icons" aria-label="Mark unread">mail</IconButton>
						<IconButton class="material-icons" aria-label="Label">label</IconButton>
						<IconButton class="material-icons" aria-label="Trash">delete</IconButton>
					</div>
				</Section>
			</BottomAppBar>
		</div>
	</div>
</div>

<style>
	.bottom-app-bar-container {
			width: 100%;
			margin: 0;
			overflow: auto;
			
		}
	@media screen and (max-width: 800px) {
		#bottom-bar {
			display: block;
			position: fixed;
			bottom: 0;
			width: 100%;
		}
		
	}
	@media screen and (min-width: 801px) {
		#bottom-bar {
			display: none;
		}

		
	}

	.flexy {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
		flex-direction: row;
		align-items: stretch;
		width: -moz-available;
		width: -webkit-fill-available;
	}

	.flexor {
		overflow: hidden;
		display: inline-flex;
		flex-direction: column;
	}

	.flexor-content {
		flex-grow: 1;
		overflow: auto;
	}
</style>
