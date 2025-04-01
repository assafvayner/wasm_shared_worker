// import { default as initWasm } from "@xet/xet_wasm.js";
// import { upload_async, download_async } from "@xet/xet_wasm.js";
import * as xet from "@huggingface/xet";
import type { WorkerMessage, WorkerResponse } from "./types";

self.onconnect = function (e: MessageEvent): void {
	const port = e.ports[0];
	console.log("Worker connected" + e.ports);

	port.onmessage = async function (e: MessageEvent<WorkerMessage>): Promise<void> {
		const data = e.data;
		console.log("Received message in worker:", data);

		try {
			// Handle different message types
			switch (data.operation) {
				case "upload": {
					const output = await xet.upload_xet_files("model", "assaf/blah", data.files);
					port.postMessage({
						status:  "success",
						message: "Upload request succeeded",
						output,
					} as WorkerResponse);
					break;
				}
				case "download": {
					// not working on download anymore.
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
