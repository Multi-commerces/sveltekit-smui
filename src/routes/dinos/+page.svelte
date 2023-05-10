<script lang="ts">
	import Tesseract from 'tesseract.js';
	import Textfield from '@smui/textfield';
	import Paper from '@smui/paper';
	import { onMount } from 'svelte';
	import HelperText from '@smui/textfield/helper-text';
	import { Icon as CommonIcon } from '@smui/common';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import FormField from '@smui/form-field';
	import Radio from '@smui/radio';

	let results: any = {
		creature: '',
		sex: '',
		niveau: '',
		vie: '',
		energie: '',
		oxygene: '',
		nourriture: '',
		poids: '',
		attaque: '',
		vitesse: ''
	};

	let error: any;


	$: loading = true;
	onMount(async () => {
		try {
			setTimeout(() => {
				loading = false;
			}, 1000);
		} catch (exception: any) {
			error = exception.message;
			loading = false;
		}
	});

	$: recognizedText = '';
	let inputImage: HTMLInputElement;

	function recognize() {
		if (inputImage && inputImage.files) {
			const imageFile = inputImage.files[0];
			const imageUrl = URL.createObjectURL(imageFile);
			Tesseract.recognize(imageUrl, 'fra')
				.then(({ data: { text } }) => {
					text = text.replace(/\s/g, '');
					const regex = [
						{ name: 'niveau', regex: /NIVEAU:([\d.]+)/ },
						{ name: 'vie', regex: /(ve|vei)([\d.]+)\/([\d.]+)/ },
						{ name: 'creature', regex: /\(([^)]+)\)/ },
						{ name: 'attaque', regex: /ATTAQUE([\d,]+)/ },
						{ name: 'vitesse', regex: /viesse([\d.]+)/ },
						{ name: 'oxygene', regex: /O[xX][yvVY]G[Èe€]NE([\d:]+)\/([\d:]+)/ },
						{ name: 'energie', regex: /NercE([\d.]+)\/([\d.]+)/ },
						{
							name: 'nourriture',
							regex: /[Nn][Oo][Uu][Rr][Rr][Ii]T[Ui][Rr][Ee]([\d.]+)\/([\d.]+)/
						},
						{ name: 'poids', regex: /[Ppr]oi[pdo]s([\d.]+)\/([\d.]+)/ }
					];

					regex.forEach(({ name, regex }) => {
						const match = text.match(regex);
						if (match !== null) {
							switch (name) {
								case 'vie':
									results.vie = match[2];
									break;
								default:
									if (results && results[name]) {
										results[name] = match[1];
									}
									break;
							}
						}
					});

					recognizedText = text;
				})
				.catch((/** @type {any} */ err) => {
					console.error(err);
				});
		}
	}
</script>

{JSON.stringify(error?.message)}
<div>
	<input type="file" accept="image/*" bind:this={inputImage} />
	<button on:click={recognize}>Recognizeresultsbutton</button>

	{#if inputImage && inputImage.files && inputImage.files[0]}
		<br />
		<div>
			<img
				width="200px"
				height="400px"
				alt="img client"
				src={URL.createObjectURL(inputImage.files[0])}
			/>
		</div>
	{/if}

	<p>{recognizedText}</p>
</div>

<Paper transition>
	<h1>Formulaire dédition - n°xxxxx</h1>
	<LayoutGrid fixedColumnWidth>
		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.creature} style="width: 100%;" helperLine$style="width: 100%">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 2em; line-height: normal; vertical-align: middle;">abc</CommonIcon
					>
					Nom
				</svelte:fragment>
				<HelperText persistent slot="helper">
					<CommonIcon
						class="material-icons"
						style="font-size: 2em; line-height: normal; vertical-align: middle;">wc</CommonIcon
					>
					<FormField style="margin-right: 1em;">
						<Radio bind:group={results.sex} value="1" />
						<span slot="label">Mâle</span>
					</FormField>
					<FormField style="margin-right: 1em;">
						<Radio bind:group={results.sex} value="2" />
						<span slot="label">Femelle</span>
					</FormField>
				</HelperText>
			</Textfield>
		</Cell>

		<Cell>
			<Textfield bind:value={results.niveau} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 2em; line-height: normal; vertical-align: middle;">upgrade</CommonIcon
					>
					Level
				</svelte:fragment>
				<HelperText persistent slot="helper" />
			</Textfield>
		</Cell>
	</LayoutGrid>

	<LayoutGrid fixedColumnWidth>
		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.vie} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;"
						>favorite</CommonIcon
					>
					vie
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>
		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.energie} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;">bolt</CommonIcon
					>
					energie
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>

		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.poids} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;">token</CommonIcon
					>
					poids
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>
		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.attaque} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;"
						>hdr_strong</CommonIcon
					>
					attaque
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>

		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.oxygene} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;"
						>landscape</CommonIcon
					>
					oxygene
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>
		<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 12 }}>
			<Textfield
				bind:value={results.nourriture}
				style="width: 100%;"
				helperLine$style="width: 100%;"
			>
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;"
						>dinner_dining</CommonIcon
					>
					nourriture
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>

		<Cell spanDevices={{ desktop: 12, tablet: 4, phone: 12 }}>
			<Textfield bind:value={results.vitesse} style="width: 100%;" helperLine$style="width: 100%;">
				<svelte:fragment slot="label">
					<CommonIcon
						class="material-icons"
						style="font-size: 1.4em; line-height: normal; vertical-align: middle;">speed</CommonIcon
					>
					vitesse
				</svelte:fragment>
				<HelperText persistent slot="helper">p ? | m ?</HelperText>
			</Textfield>
		</Cell>
	</LayoutGrid>
</Paper>
