use serde::Serialize;
use std::error::Error;
use std::fmt;

#[derive(Debug, Serialize)]
pub struct HttpReqError {
    code: Option<u16>,
    message: String,
}

pub enum HttpReqErrorType {
    LcuUnConnect = 10001,
}

impl HttpReqError {
    pub fn new(code: Option<u16>, message: String) -> Self {
        Self { code, message }
    }
}

impl fmt::Display for HttpReqError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl Error for HttpReqError {}

#[derive(Serialize)]
pub struct AssetsResponse {
    file_type: String,
    data: Vec<u8>,
}

impl AssetsResponse {
    pub fn new(file_type: String, data: Vec<u8>) -> Self {
        Self { file_type, data }
    }
}
