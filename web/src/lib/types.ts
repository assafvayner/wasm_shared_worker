import * as XetWasm from "@xet/xet_wasm.d.ts";
export { XetWasm };

export type WorkerOperation = "upload" | "download";
export type WorkerStatus = "success" | "error";

export interface WorkerMessage extends Record<string, unknown> {
	operation: WorkerOperation;
}

export interface WorkerResponse {
	status:  WorkerStatus;
	message: string;
}
