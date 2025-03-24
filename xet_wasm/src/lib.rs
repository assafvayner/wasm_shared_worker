mod error;
mod types;
mod utils;

pub use types::*;
use utils::sha256_from_reader;
use wasm_bindgen_file_reader::WebSysFile;

use crate::error::SharedWorkerError;
use merklehash::MerkleHash;
use std::io::{Seek, SeekFrom};
use std::sync::atomic::AtomicU32;
use std::sync::atomic::Ordering::SeqCst;
use wasm_bindgen::prelude::*;
use web_sys::{console, Blob, File};

static CALL_COUNT: AtomicU32 = AtomicU32::new(0);

fn log<T: ToString>(message: T) {
    console::log_1(&JsValue::from_str(&message.to_string()));
}

#[wasm_bindgen]
pub async fn upload_async(
    files: Vec<File>,
    url: String,
    token: String,
) -> Result<JsValue, JsValue> {
    log("upload_async");
    let output = _upload_async(files, url, token).await?;
    serde_wasm_bindgen::to_value(&output).map_err(JsValue::from)
}

pub async fn _upload_async(
    files: Vec<File>,
    url: String,
    token: String,
) -> Result<Vec<PointerFile>, SharedWorkerError> {
    let value = CALL_COUNT.fetch_add(1, SeqCst);
    log(format!("call count value = {value}"));

    // log(format!("files = {files:?}"));
    log(format!("url = {url:?}"));
    log(format!("token = {token:?}"));

    let files_it = files.into_iter().map(|file| {
        let path = file.name().to_string();
        let size = file.size();
        log(format!("path = {path:?}; size = {size:?}"));
        let reader = WebSysFile::new(file);
        (reader, path, size)
    });

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

    Ok(files_it
        .map(|(mut reader, path, size)| {
            reader.seek(SeekFrom::Start(0)).unwrap();
            PointerFile {
                hash: MerkleHash::default(),
                size: size as u64,
                path,
                sha256: sha256_from_reader(&mut reader).unwrap(),
            }
        })
        .collect())
}

#[wasm_bindgen]
pub async fn download_async(
    repo: String,
    file: String,
    writer: Blob,
    url: String,
    token: String,
) -> Result<JsValue, JsValue> {
    log("download_async");
    let output = _download_async(repo, file, writer, url, token).await?;
    serde_wasm_bindgen::to_value(&output).map_err(JsValue::from)
}

pub async fn _download_async(
    _repo: String,
    _file: String,
    _writer: Blob,
    _url: String,
    _token: String,
) -> Result<(), SharedWorkerError> {
    Ok(())
}
