use merklehash::MerkleHash;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PointerFile {
    #[wasm_bindgen(getter, readonly)]
    #[serde(with = "merklehash::data_hash::hex::serde")]
    pub(crate) hash: MerkleHash,
    #[wasm_bindgen(getter, readonly)]
    pub(crate) size: u64,
    #[wasm_bindgen(getter, readonly)]
    pub(crate) path: String,
    #[wasm_bindgen(getter, readonly)]
    pub(crate) sha256: String,
}

impl PointerFile {
    pub fn new(hash: MerkleHash, size: u64, path: String, sha256: String) -> Self {
        Self {
            hash,
            size,
            path,
            sha256,
        }
    }
}

// #[wasm_bindgen]
// #[derive(Debug, Clone)]
// pub struct UploadInput {
//     #[wasm_bindgen(getter)]
//     pub(crate) files: Vec<File>, // TODO: how to pass files?
//     #[wasm_bindgen(getter)]
//     pub(crate) url: String,
//     #[wasm_bindgen(getter)]
//     pub(crate) token: String,
// }

// #[wasm_bindgen]
// impl UploadInput {
//     #[wasm_bindgen(constructor)]
//     pub fn new(files: Vec<File>, url: String, token: String) -> Self {
//         Self { files, url, token }
//     }
// }

// #[wasm_bindgen]
// #[derive(Debug, Serialize, Clone)]
// pub struct UploadOutput {
//     #[wasm_bindgen(getter, readonly)]
//     pub(crate) files: Vec<PointerFile>,
// }

// #[wasm_bindgen]
// impl UploadOutput {
//     #[wasm_bindgen(constructor)]
//     pub fn new(files: Vec<PointerFile>) -> Self {
//         Self { files }
//     }
// }

// #[wasm_bindgen]
// #[derive(Debug, Clone)]
// pub struct DownloadInput {
//     pub(crate) repo: String,
//     pub(crate) file: String,
//     pub(crate) writer: WritableStream,
//     pub(crate) url: String,
//     pub(crate) token: String,
// }

// #[wasm_bindgen]
// impl DownloadInput {
//     #[wasm_bindgen(constructor)]
//     pub fn new(
//         repo: String,
//         file: String,
//         writer: WritableStream,
//         url: String,
//         token: String,
//     ) -> Self {
//         Self {
//             repo,
//             file,
//             writer,
//             url,
//             token,
//         }
//     }
// }

// #[wasm_bindgen]
// #[derive(Debug, Serialize, Clone)]
// pub struct DownloadOutput {}

// #[wasm_bindgen]
// impl DownloadOutput {
//     #[wasm_bindgen(constructor)]
//     pub fn new() -> Self {
//         Self {}
//     }
// }
