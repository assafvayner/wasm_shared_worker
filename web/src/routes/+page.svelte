<script lang="ts">
	import { onMount } from "svelte";
	import { sendMessageToWorker, getWorker } from "$lib/worker";
	import type { WorkerResponse } from "$lib/types";

	let selectedFiles = $state<File[]>([]);
	let fileList: string[] = ["file1", "file2", "file3"];
	let workerStatus: string = $state("");
	let selectedFileToDownload = $state(fileList[0]); // Default to first file
	let worker = $state<SharedWorker | null>(null);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			selectedFiles = input.files;
		}
	}

	function handleApprove() {
		if (!worker) return;
		sendMessageToWorker(worker, {
			operation: "upload",
			files:     selectedFiles,
			url:       "https://blah.com",
			token:     "1234567890",
		});
	}

	function handleDownload() {
		if (!worker) return;
		const blob = new Blob([], { type: "application/octet-stream" });
		sendMessageToWorker(worker, {
			operation: "download",
			file_name: selectedFileToDownload,
			writer:    blob,
			url:       "https://blah.com",
			token:     "1234567890",
		});
	}

	onMount(() => {
		worker = getWorker();

		// Define the message handler
		const messageHandler = (event: MessageEvent<WorkerResponse>) => {
			const response = event.data;
			console.log("Received message from worker:", response);
		};

		// Set up the message handler
		worker.port.onmessage = messageHandler;
		worker.port.start();

		// Cleanup function
		return () => {
			worker!.port.onmessage = null;
		};
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
			<input type="file" multiple onchange={handleFileSelect} class="file-input" id="file-input" />
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
				<button onclick={handleApprove} class="button approve">Approve</button>
			</div>
		{/if}
	</section>

	<section class="download-section">
		<h2>Download Files</h2>
		<div class="file-list">
			<h3>Available Files:</h3>
			<div class="file-picker">
				<select bind:value={selectedFileToDownload}>
					{#each fileList as file}
						<option value={file}>{file}</option>
					{/each}
				</select>
				<button onclick={handleDownload} class="button">Download</button>
			</div>
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

	.file-picker {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 1rem;
	}

	select {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-size: 1rem;
		min-width: 200px;
	}
</style>
