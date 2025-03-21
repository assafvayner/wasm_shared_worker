mod error;

use crate::error::SharedWorkerError;
use serde::{Deserialize, Serialize};
use std::rc::Rc;
use std::sync::atomic::AtomicU32;
use std::sync::atomic::Ordering::SeqCst;
use wasm_bindgen::prelude::*;
use web_sys::{console, File};

static CALL_COUNT: AtomicU32 = AtomicU32::new(0);

fn log<T: ToString>(message: T) {
    console::log_1(&JsValue::from_str(&message.to_string()));
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct PointerFile {
    #[wasm_bindgen(readonly)]
    hash: String,
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
) -> Result<Vec<PointerFile>, SharedWorkerError> {
    let value = CALL_COUNT.fetch_add(1, SeqCst);
    log(format!("call count value = {value}"));
    return     Ok(vec![PointerFile {
        hash: "".to_string(),
        size: value as u64,
        path: "".to_string(),
        sha256: "".to_string(),
    }]);

    if files.is_empty() {
        return Err(SharedWorkerError::invalid_arguments("no files provided"));
    }
    if files.len() != file_paths.len() {
        return Err(SharedWorkerError::invalid_arguments(
            "files array length does not match file_paths array",
        ));
    }
    if url.is_empty() || token.is_empty() {
        return Err(SharedWorkerError::invalid_arguments(
            "url and/or token are missing",
        ));
    }

    log("uploading files passed validation");

    Ok(vec![PointerFile {
        hash: "".to_string(),
        size: value as u64,
        path: "".to_string(),
        sha256: "".to_string(),
    }])
}

// onconnect = function (event) {
//   const port = event.ports[0];
//
//   port.onmessage = function (e) {
//     const workerResult = `Result: ${e.data[0] * e.data[1]}`;
//     port.postMessage(workerResult);
//   };
// };

// fn onconnect(event: EventTarget)
//
// fn setup_onconnect() -> Function {
//
// }
//
// #[wasm_bindgen(main)]
// async fn main() {
//     let global = global();
//     let scope = Rc::new(SharedWorkerGlobalScope::from(global));
//     let name = scope.name();
//     console::log_1(&JsValue::from_str(format!("Shared worker name: {name}").as_str()));
//     let onconnect = Rc::new(setup_onconnect());
//     scope.set_onconnect(Some(&onconnect));
// }
