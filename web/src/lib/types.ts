export type WorkerOperation = "upload" | "download";
export type WorkerStatus = "success" | "error";

export interface BaseWorkerMessage {
	operation: WorkerOperation;
	url:       string;
	token:     string;
}

export interface UploadWorkerMessage extends BaseWorkerMessage {
	operation: "upload";
	files:     File[];
}

export interface DownloadWorkerMessage extends BaseWorkerMessage {
	operation: "download";
	file_name: string;
	writer:    Blob;
}

export type WorkerMessage = UploadWorkerMessage | DownloadWorkerMessage;

export interface WorkerResponse {
	status:  WorkerStatus;
	message: string;
	output?: unknown;
}
