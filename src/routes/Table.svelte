<script lang="ts">
	import DataTable, { Head, SortValue, Pagination, Body, Row, Cell } from '@smui/data-table';
	import Select, { Option } from '@smui/select';
	import Badge from '@smui-extra/badge';
	import Button, { Label } from '@smui/button';
	import type { Data } from '$lib/apiStore';
	import IconButton from '@smui/icon-button/src/IconButton.svelte';
	

	export let columnDefs: any[] = [];
	export let rowData: Data<any>[] = [];
	export let handleClick: (id: string) => {};

	let rowsPerPage = 10;
	let currentPage = 0;

	/**
	 * Sortable
	 */
	let sort: keyof Data<any> = 'id';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	function handleSort() {
		rowData.sort((a, b) => {
			const [aVal, bVal] = [a[sort], b[sort]][
				sortDirection === 'ascending' ? 'slice' : 'reverse'
			]();
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal);
			}
			return Number(aVal) - Number(bVal);
		});
		rowData = rowData;
	}

	/**
	 * Pagination
	 */
	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, rowData.length);
	$: slice = rowData.slice(start, end);
	$: lastPage = Math.max(Math.ceil(rowData.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}
</script>
<div style="margin-top: 2em;">
	
	
  </div>

<Pagination slot="paginate">
	<svelte:fragment slot="rowsPerPage">
		<Label>Nombre d'éléments par page</Label>
		<Select variant="filled" bind:value={rowsPerPage} noLabel>
			<Option value={10}>10</Option>
			<Option value={25}>25</Option>
			<Option value={100}>100</Option>
		</Select>
	</svelte:fragment>
	<svelte:fragment slot="total">
		<Badge color="custom-green" aria-label="unread count" style="padding:0.4rem;position: static; display: inline;">
			{start + 1}-{end} / {rowData.length}
		</Badge>
		
	</svelte:fragment>

	<IconButton
		class="material-icons"
		action="first-page"
		title="First page"
		on:click={() => (currentPage = 0)}
		disabled={currentPage === 0}>first_page</IconButton
	>
	<IconButton
		class="material-icons"
		action="prev-page"
		title="Prev page"
		on:click={() => currentPage--}
		disabled={currentPage === 0}>chevron_left</IconButton
	>
	<IconButton
		class="material-icons"
		action="next-page"
		title="Next page"
		on:click={() => currentPage++}
		disabled={currentPage === lastPage}>chevron_right</IconButton
	>
	<IconButton
		class="material-icons"
		action="last-page"
		title="Last page"
		on:click={() => (currentPage = lastPage)}
		disabled={currentPage === lastPage}>last_page</IconButton
	>
</Pagination>
<DataTable
	sortable
	bind:sort
	bind:sortDirection
	on:SMUIDataTable:sorted={handleSort}
	table$aria-label="Products list"
	style="width: 100%;"
>
	<Head>
		<Row>
			<Cell columnId="id">
				<IconButton class="material-icons">arrow_upward</IconButton>
				<Label>ID</Label>
			</Cell>
			<Cell sortable={false}>Actions</Cell>
			{#each columnDefs as columnDef}
				<Cell>columnDef</Cell>
			{/each}
		</Row>
	</Head>
	<Body>
		{#each slice as item (item.id)}
			<Row>
				<Cell>{item.id}</Cell>
				<Cell>
					<a href={`/${item.id}`}>Edit</a>
					<Button on:click={() =>handleClick(item.id ?? "")}>Delete</Button>
				</Cell>
			</Row>
		{/each}
	</Body>
</DataTable>
