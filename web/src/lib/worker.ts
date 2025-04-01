import type { WorkerMessage, WorkerResponse } from "./types";

export function getWorker(): SharedWorker {
	return new SharedWorker(new URL("./shared-worker.ts", import.meta.url), {
		name: "huggingface-xet-worker",
		type: "module",
	});
}

export function sendMessageToWorker(worker: SharedWorker, message: WorkerMessage): void {
	console.log("Sending message to worker:", message);
	worker.port.postMessage(message);
}

export function setupWorkerMessageHandler(worker: SharedWorker, callback: (event: MessageEvent<WorkerResponse>) => void): void {
	worker.port.onmessage = callback;
	worker.port.start();
}
