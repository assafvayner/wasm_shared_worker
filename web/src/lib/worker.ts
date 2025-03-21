interface WorkerMessage {
	type:  "upload" | "download";
	files: string[];
}

interface WorkerResponse {
	type:    "success" | "error";
	message: string;
	data?:   { files: string[] };
}

let worker: SharedWorker | null = null;

export function getWorker(): SharedWorker {
	if (!worker) {
		worker = new SharedWorker(new URL("./shared-worker.ts", import.meta.url), {
			name: "huggingface-xet-worker",
			type: "module",
		});
	}
	return worker;
}

export function sendMessageToWorker(message: WorkerMessage): void {
	const worker = getWorker();
	console.log("Sending message to worker:", message);
	worker.port.postMessage(message);
}

export function setupWorkerMessageHandler(callback: (event: MessageEvent<WorkerResponse>) => void): void {
	const worker = getWorker();
	worker.port.onmessage = callback;
	worker.port.start();
}
