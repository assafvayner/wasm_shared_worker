import init, { upload_async, download_async } from "../../../xet_wasm/pkg/xet_wasm.js";

type WorkerOperation = "upload" | "download";
type WorkerStatus = "success" | "error";

interface WorkerMessage {
	type: WorkerOperation;
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
	status:  WorkerStatus;
	message: string;
}

let wasmInitialized = false;

async function initializeWasm() {
	navigator.locks.request("_wasm_init", async () => {
		if (wasmInitialized) return;
		await init();
		wasmInitialized = true;
	});
}

async function handleUpload(files: string[]): Promise<void> {
	await initializeWasm();
	console.log("Handling upload for files:", files);
	await upload_async(files);
}

async function handleDownload(files: string[]): Promise<void> {
	await initializeWasm();
	console.log("Handling download for files:", files);
	await download_async(files);
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
