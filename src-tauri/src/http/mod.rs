use reqwest;
use serde_json::Value;
use std::time::Duration;

#[tauri::command]
pub async fn http_get(url: String, auth: String, timeout: f32) -> Result<Value, String> {
    println!("Lol Client Request: {:?}", url.clone());
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();
    let req = client
        .get(url)
        .header("Authorization", auth)
        .timeout(Duration::from_secs_f32(timeout))
        .send()
        .await;

    match req {
        Ok(resp) => {
            if resp.status().is_success() {
                let data = resp.text().await.unwrap();
                let obj: Value = serde_json::from_str(data.as_str()).unwrap();
                return Ok(obj);
            } else {
                return Err(format!("Request failed with error({})", resp.status()).into());
            }
        }
        Err(e) => {
            return Err(e.to_string().into());
        }
    }
}

#[tauri::command]
pub async fn http_post(
    url: String,
    data: Value,
    auth: String,
    timeout: f32,
) -> Result<Value, String> {
    println!("Lol Client Request: {:?}", url.clone());
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();
    let req = client
        .post(url)
        .json::<Value>(&data)
        .header("Authorization", auth)
        .timeout(Duration::from_secs_f32(timeout))
        .send()
        .await;

    match req {
        Ok(resp) => {
            if resp.status().is_success() {
                let data = resp.text().await.unwrap();
                let obj: Value = serde_json::from_str(data.as_str()).unwrap();
                return Ok(obj);
            } else {
                return Err(format!("Request failed with error({})", resp.status()).into());
            }
        }
        Err(e) => {
            return Err(e.to_string().into());
        }
    }
}

#[tauri::command]
pub async fn http_assets(url: String, auth: String, timeout: f32) -> Result<Vec<u32>, String> {
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();
    let req = client
        .get(url)
        .header("Authorization", auth)
        .timeout(Duration::from_secs_f32(timeout))
        .send()
        .await;

    match req {
        Ok(resp) => {
            if resp.status().is_success() {
                let data = resp.bytes().await.unwrap();
                let obj: Vec<u32> = data.iter().map(|x| *x as u32).collect();
                return Ok(obj);
            } else {
                return Err(format!("Request failed with error({})", resp.status()).into());
            }
        }
        Err(e) => {
            return Err(e.to_string().into());
        }
    }
}
