use lazy_static::lazy_static;
use reqwest::{Client, Method, RequestBuilder};
use serde_json::Value;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::Mutex;

use crate::define::{AssetsResponse, HttpReqError};

lazy_static! {
    static ref HTTP_CLIENT: Arc<Mutex<Client>> = Arc::new(Mutex::new(get_http_client()));
}

fn get_http_client() -> Client {
    Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap()
}

fn get_http_method(method: &str) -> Method {
    match method.to_ascii_uppercase().as_str() {
        "GET" => Method::GET,
        "POST" => Method::POST,
        "PUT" => Method::PUT,
        "PATCH" => Method::PATCH,
        "DELETE" => Method::DELETE,
        _ => Method::GET,
    }
}

fn get_request_builder(
    method: Method,
    client: &Client,
    url: &str,
) -> Result<RequestBuilder, HttpReqError> {
    // 验证 URL 是否有效
    if url.is_empty() || !url.starts_with("http") {
        return Err(HttpReqError::new(None, "Invalid URL".into()));
    }
    match method {
        Method::GET => Ok(client.get(url)),
        Method::POST => Ok(client.post(url)),
        Method::PUT => Ok(client.put(url)),
        Method::PATCH => Ok(client.patch(url)),
        Method::DELETE => Ok(client.delete(url)),
        _ => Err(HttpReqError::new(None, "Method not supported".into())),
    }
}

#[tauri::command]
pub async fn http_request(
    url: String,
    method: String,
    data: Option<Value>,
    auth: String,
    timeout: f32,
) -> Result<Value, HttpReqError> {
    println!("Lol Client Request: [{}] {}", method, url.clone());
    let client = {
        let client = HTTP_CLIENT.lock().await;
        client.clone()
    };
    let _method = get_http_method(&method);
    let mut req = match get_request_builder(_method, &client, &url) {
        Ok(req) => req,
        Err(e) => return Err(e),
    };

    match data {
        Some(data) => {
            req = req.json(&data);
        }
        _ => (),
    }
    let resp = req
        .header("Authorization", auth)
        .timeout(Duration::from_secs_f32(timeout))
        .send()
        .await;
    match resp {
        Ok(resp) => {
            if resp.status().is_success() {
                let data = resp.text().await.unwrap();
                let obj = if data.is_empty() {
                    Value::Null
                } else {
                    serde_json::from_str(data.as_str()).unwrap()
                };
                Ok(obj)
            } else {
                Err(HttpReqError::new(
                    Some(resp.status().as_u16()),
                    format!("Request failed with error({})", resp.status()).into(),
                ))
            }
        }
        Err(e) => Err(HttpReqError::new(
            match e.status() {
                Some(code) => Some(code.as_u16()),
                None => None,
            },
            e.to_string().into(),
        )),
    }
}

#[tauri::command]
pub async fn http_assets(
    url: String,
    auth: String,
    timeout: f32,
) -> Result<AssetsResponse, HttpReqError> {
    println!("Load Client Assets: {}", url.clone());
    let client = {
        let client = HTTP_CLIENT.lock().await;
        client.clone()
    };
    let req = match get_request_builder(Method::GET, &client, &url) {
        Ok(req) => req,
        Err(e) => return Err(e),
    };

    let resp = req
        .header("Authorization", auth)
        .timeout(Duration::from_secs_f32(timeout))
        .send()
        .await;

    match resp {
        Ok(result) => {
            let status = result.status();
            let file_type = result
                .headers()
                .get("Content-Type")
                .unwrap()
                .to_str()
                .unwrap()
                .to_string();
            let data = result.bytes().await.unwrap();

            if status.is_success() {
                Ok(AssetsResponse::new(file_type, data.to_vec()))
            } else {
                Err(HttpReqError::new(
                    Some(status.as_u16()),
                    format!("Request failed with error({})", status).into(),
                ))
            }
        }
        Err(e) => Err(HttpReqError::new(
            match e.status() {
                Some(code) => Some(code.as_u16()),
                None => None,
            },
            e.to_string().into(),
        )),
    }
}
