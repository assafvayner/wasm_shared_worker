use thiserror::Error;
use wasm_bindgen::JsValue;

#[derive(Debug, Error)]
pub enum SharedWorkerError {
    #[error("{0}")]
    Generic(String),
    #[error("InvalidArguments: {0}")]
    InvalidArguments(String),
    #[error("serde_wasm_bindgen: {0}")]
    SerdeWasmBindgen(#[from] serde_wasm_bindgen::Error),
}

impl From<SharedWorkerError> for JsValue {
    fn from(value: SharedWorkerError) -> Self {
        JsValue::from_str(&value.to_string())
    }
}

impl SharedWorkerError {
    pub fn invalid_arguments<T: ToString>(inner: T) -> Self {
        SharedWorkerError::InvalidArguments(inner.to_string())
    }
}
