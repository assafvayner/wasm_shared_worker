mod error;

use crate::error::SharedWorkerError;
use merklehash::MerkleHash;
use serde::{Deserialize, Serialize};
use std::sync::atomic::AtomicU32;
use std::sync::atomic::Ordering::SeqCst;
use wasm_bindgen::prelude::*;
use web_sys::{console, Blob, File};

static CALL_COUNT: AtomicU32 = AtomicU32::new(0);

fn log<T: ToString>(message: T) {
    console::log_1(&JsValue::from_str(&message.to_string()));
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct PointerFile {
    #[wasm_bindgen(readonly)]
    #[serde(with = "merklehash::data_hash::hex::serde")]
    hash: MerkleHash,
    #[wasm_bindgen(readonly)]
    size: u64,
    #[wasm_bindgen(readonly)]
    path: String,
    #[wasm_bindgen(readonly)]
    sha256: String,
}

#[wasm_bindgen]
pub async fn upload_async(
    file_paths: Vec<String>,
    files: Vec<File>,
    url: String,
    token: String,
) -> Result<JsValue, JsValue> {
    let output = _upload_async(file_paths, files, url, token).await?;
    serde_wasm_bindgen::to_value(&output).map_err(JsValue::from)
}

pub async fn _upload_async(
    file_paths: Vec<String>,
    files: Vec<File>,
    url: String,
    token: String,
) -> Result<Vec<PointerFile>, SharedWorkerError> {
    let value = CALL_COUNT.fetch_add(1, SeqCst);
    log(format!("call count value = {value}"));

    // if files.is_empty() {
    //     return Err(SharedWorkerError::invalid_arguments("no files provided"));
    // }
    // if files.len() != file_paths.len() {
    //     return Err(SharedWorkerError::invalid_arguments(
    //         "files array length does not match file_paths array",
    //     ));
    // }
    // if url.is_empty() || token.is_empty() {
    //     return Err(SharedWorkerError::invalid_arguments(
    //         "url and/or token are missing",
    //     ));
    // }
    //
    // log("uploading files passed validation");

    Ok(vec![PointerFile {
        hash: MerkleHash::default(),
        size: value as u64,
        path: "".to_string(),
        sha256: "".to_string(),
    }])
}

#[wasm_bindgen]
pub async fn download_async(
    repo: String,
    file: String,
    writer: Blob,
    url: String,
    token: String,
) -> Result<JsValue, JsValue> {
    let output = _download_async(repo, file, writer, url, token).await?;
    serde_wasm_bindgen::to_value(&output).map_err(JsValue::from)
}

pub async fn _download_async(
    repo: String,
    file: String,
    writer: Blob,
    url: String,
    token: String,
) -> Result<(), SharedWorkerError> {
    Ok(())
}
