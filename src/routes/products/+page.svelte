<script lang="ts">
	import LinearProgress from '@smui/linear-progress';
	import { onDestroy, onMount } from 'svelte';
	import Table from '../Table.svelte';
	import {
		createHttpStore,
		type CollectionJsonAPI,
		type Data,
		type HttpStore
	} from '$lib/apiStore';

	let error: any;

	const httpStore: HttpStore<any> = createHttpStore<any>('https://api.web-maker.fr');
	let items: Data<any>[] = [];
	let data: CollectionJsonAPI<any> = { data: [] };

	onDestroy(() => {
		httpStore.unsubscribe();
	});

	httpStore.subscribe((resp) => {
		data = resp;
		if (resp.data) {
			items = resp.data;
			items = items;
		}
	});

	async function fetchData() {
		return await httpStore.action('get', 'products');
	}

	async function createData(formData: Data<any>) {
		return await httpStore.action('post', 'products', { data: formData });
	}

	async function updateData(formData: Data<any>) {
		return await httpStore.action('patch', `products/${formData.id}`, { data: formData });
	}

	let deleteData = async (id: string) => {
		return await httpStore.action('delete', `products/${id}`);
	}

	$: loading = true;
	onMount(async () => {
		try {
			if (await fetchData()) {
				// ignore
			} else {
				error = data;
			}
			setTimeout(() => {
				loading = false;
			}, 1000);
		} catch (exception: any) {
			error = exception.message;
			loading = false;
		}
	});
</script>

<p>
	{#if loading}
		<span style="font-size: x-large;font-family: monospace;">loading ...</span>
		<LinearProgress indeterminate />
	{:else if error}Error: {error}
	{:else}
		<Table handleClick={deleteData} columnDefs={[]} rowData={data?.data} />
		{(console.log(JSON.stringify(data, null, 2)), '')}
		{@debug data}
	{/if}
</p>

<style>
</style>
