import { default as initWasm } from "../../../xet_wasm/pkg/xet_wasm.js";
import { upload_async, download_async } from "../../../xet_wasm/pkg/xet_wasm.js";

interface WorkerMessage {
	type:  "upload" | "download";
	files: string[];
}

// interface UploadMessage extends WorkerMessage {
// 	files:      File[];
// 	file_paths: string[];
// 	url:        string;
// 	token:      string;
// }

// interface DownloadMessage extends WorkerMessage {
// 	files: string[];
// }

interface WorkerResponse {
	type:    "success" | "error";
	message: string;
	data?:   { files: string[] };
}

let wasmInitialized = false;

async function initializeWasm() {
	if (wasmInitialized) return;

	await navigator.locks.request("wasm_init", async () => {
		if (wasmInitialized) return;
		await initWasm();
		wasmInitialized = true;
	});
}

async function handleUpload(files: string[]): Promise<void> {
	await initializeWasm();
	console.log("Handling upload for files:", files);
	await upload_async(files, [], "url", "token");
}

async function handleDownload(files: string[]): Promise<void> {
	await initializeWasm();
	console.log("Handling download for files:", files);
	await download_async("repo", "file", new Blob(), "url", "token");
}

self.onconnect = function (e: MessageEvent): void {
	const port = e.ports[0];

	port.onmessage = async function (e: MessageEvent<WorkerMessage>): Promise<void> {
		const data = e.data;
		console.log("Received message in worker:", data);

		try {
			// Handle different message types
			switch (data.type) {
				case "upload":
					await handleUpload(data.files);
					port.postMessage({
						type:    "success",
						message: "Upload request received",
						data:    { files: data.files },
					} as WorkerResponse);
					break;
				case "download":
					await handleDownload(data.files);
					port.postMessage({
						type:    "success",
						message: "Download request received",
						data:    { files: data.files },
					} as WorkerResponse);
					break;
				default:
					throw new Error(`Unknown message type: ${data.type}`);
			}
		} catch (error) {
			port.postMessage({
				type:    "error",
				message: error instanceof Error ? error.message : "Unknown error occurred",
			} as WorkerResponse);
		}
	};

	port.start();
};
