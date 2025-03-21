<script lang="ts">
	import { onMount } from "svelte";
	import { sendMessageToWorker, setupWorkerMessageHandler } from "$lib/worker";

	let selectedFiles: File[] = [];
	let fileList: string[] = ["file1", "file2", "file3"];
	let workerStatus: string = "";

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			selectedFiles = Array.from(input.files);
		}
	}

	function handleApprove() {
		const filePaths = selectedFiles.map(file => file.name);
		sendMessageToWorker({
			type:  "upload",
			files: filePaths,
		});
	}

	function handleDownload() {
		sendMessageToWorker({
			type:  "download",
			files: fileList,
		});
	}

	onMount(() => {
		setupWorkerMessageHandler(event => {
			const response = event.data;
			console.log("Received message from worker:", response);

			if (response.type === "success") {
				workerStatus = `Success: ${response.message}`;
			} else {
				workerStatus = `Error: ${response.message}`;
			}
		});
	});
</script>

<main class="container">
	<h1>File Management</h1>

	{#if workerStatus}
		<div class="status-message {workerStatus.startsWith('Error') ? 'error' : 'success'}">
			{workerStatus}
		</div>
	{/if}

	<section class="upload-section">
		<h2>Upload Files</h2>
		<div class="file-input-container">
			<input type="file" multiple on:change={handleFileSelect} class="file-input" id="file-input" />
			<label for="file-input" class="button">Upload Files</label>
		</div>

		{#if selectedFiles.length > 0}
			<div class="file-list">
				<h3>Selected Files:</h3>
				<ul>
					{#each selectedFiles as file}
						<li>{file.name}</li>
					{/each}
				</ul>
				<button on:click={handleApprove} class="button approve">Approve</button>
			</div>
		{/if}
	</section>

	<section class="download-section">
		<h2>Download Files</h2>
		<div class="file-list">
			<h3>Available Files:</h3>
			<ul>
				{#each fileList as file}
					<li>{file}</li>
				{/each}
			</ul>
			<button on:click={handleDownload} class="button">Download</button>
		</div>
	</section>
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	section {
		margin-bottom: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.file-input-container {
		margin: 1rem 0;
	}

	.file-input {
		display: none;
	}

	.button {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.button:hover {
		background-color: #45a049;
	}

	.button.approve {
		background-color: #2196f3;
	}

	.button.approve:hover {
		background-color: #1976d2;
	}

	.file-list {
		margin-top: 1rem;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		padding: 0.5rem;
		border-bottom: 1px solid #eee;
	}

	li:last-child {
		border-bottom: none;
	}

	.status-message {
		margin-bottom: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: bold;
	}

	.status-message.success {
		background-color: #dff0d8;
		color: #3c763d;
		border: 1px solid #d6e9c6;
	}

	.status-message.error {
		background-color: #f2dede;
		color: #a94442;
		border: 1px solid #ebccd1;
	}
</style>
