use std::{env, net::SocketAddr, path::PathBuf, sync::Arc};

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};

#[derive(Clone)]
struct AppState {
    content: Arc<SiteContent>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct SiteContent {
    pages: Vec<PageSummary>,
    posts: Vec<Post>,
    assets: Vec<Asset>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PageSummary {
    id: u64,
    slug: String,
    title: String,
    path: String,
    kind: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Asset {
    source: String,
    local: String,
    kind: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Post {
    id: u64,
    slug: String,
    path: String,
    date: String,
    title: String,
    excerpt: String,
    html: String,
    featured_image: Option<String>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "adv_medical_site_api=info,tower_http=info".into()),
        )
        .init();

    let content_path =
        env::var("ADV_SITE_CONTENT").unwrap_or_else(|_| "dist/content/site-content.json".into());
    let content = load_content(PathBuf::from(content_path))?;
    let state = AppState {
        content: Arc::new(content),
    };

    let static_dir = env::var("ADV_SITE_STATIC_DIR").unwrap_or_else(|_| "dist".into());
    let index_file = PathBuf::from(&static_dir).join("index.html");
    let app = Router::new()
        .route("/api/health", get(health))
        .route("/api/pages", get(pages))
        .route("/api/posts", get(posts))
        .route("/api/posts/:slug", get(post_by_slug))
        .nest_service(
            "/",
            ServeDir::new(static_dir)
                .append_index_html_on_directories(true)
                .fallback(ServeFile::new(index_file)),
        )
        .with_state(state)
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let addr: SocketAddr = env::var("ADV_SITE_BIND")
        .unwrap_or_else(|_| "127.0.0.1:8088".into())
        .parse()?;
    tracing::info!(%addr, "starting Advantage Data Vision site API");
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

fn load_content(path: PathBuf) -> anyhow::Result<SiteContent> {
    let body = std::fs::read_to_string(&path)?;
    Ok(serde_json::from_str(&body)?)
}

async fn shutdown_signal() {
    let _ = tokio::signal::ctrl_c().await;
}

async fn health() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "service": "adv-medical-site-api"
    }))
}

async fn pages(State(state): State<AppState>) -> impl IntoResponse {
    Json(state.content.pages.clone())
}

async fn posts(State(state): State<AppState>) -> impl IntoResponse {
    Json(state.content.posts.clone())
}

async fn post_by_slug(Path(slug): Path<String>, State(state): State<AppState>) -> impl IntoResponse {
    match state.content.posts.iter().find(|post| post.slug == slug) {
        Some(post) => Json(post.clone()).into_response(),
        None => (StatusCode::NOT_FOUND, Json(serde_json::json!({ "error": "post not found" })))
            .into_response(),
    }
}
