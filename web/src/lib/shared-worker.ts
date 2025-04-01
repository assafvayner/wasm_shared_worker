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
			// if (self.current_upload) {
			// 	self.current_upload.cancel();
			// }
			// Handle different message types
			switch (data.operation) {
				case "upload": {
					const output = await xet.upload_xet_files("model", "assaf/blah", data.files);
					// const output = await upload_async(data.files, data.url, data.token);
					port.postMessage({
						status:  "success",
						message: "Upload request succeeded",
						output,
					} as WorkerResponse);
					break;
				}
				case "download": {
					break;
					// const output = await download_async("repo", data.file_name, data.writer, data.url, data.token);
					// port.postMessage({
					// 	status:  "success",
					// 	message: "Download request succeeded",
					// 	output,
					// } as WorkerResponse);
					// break;
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
