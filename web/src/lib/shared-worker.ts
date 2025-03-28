import { default as initWasm } from "@xet/xet_wasm.js";
import { upload_async, download_async } from "@xet/xet_wasm.js";
import type { WorkerMessage, WorkerResponse } from "./types";

let wasmInitialized = false;

async function verifyInitializeWasm() {
	if (wasmInitialized) return;

	await navigator.locks.request("_hf_xet_worker_wasm_init", async () => {
		if (wasmInitialized) return;
		await initWasm();
		wasmInitialized = true;
	});
}

self.onconnect = function (e: MessageEvent): void {
	const port = e.ports[0];
	console.log("Worker connected" + e.ports);

	port.onmessage = async function (e: MessageEvent<WorkerMessage>): Promise<void> {
		const data = e.data;
		console.log("Received message in worker:", data);

		try {
			await verifyInitializeWasm();
			// Handle different message types
			switch (data.operation) {
				case "upload": {
					const output = await upload_async(data.files, data.url, data.token);
					port.postMessage({
						status:  "success",
						message: "Upload request succeeded",
						output,
					} as WorkerResponse);
					break;
				}
				case "download": {
					const output = await download_async("repo", "file", new Blob(), "url", "token");
					port.postMessage({
						status:  "success",
						message: "Download request succeeded",
						output,
					} as WorkerResponse);
					break;
				}
				default:
					port.postMessage({
						status:  "error",
						message: "Unknown message type",
					} as WorkerResponse);
			}
		} catch (error) {
			port.postMessage({
				status:  "error",
				message: error instanceof Error ? error.message : "Unknown error occurred",
			} as WorkerResponse);
		}
	};

	port.start();
};
