use leptos::prelude::*;
use wasm_bindgen::prelude::wasm_bindgen;

mod app;
mod components;

use app::*;

#[wasm_bindgen]
pub fn hydrate() {
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(App);
}

#[wasm_bindgen]
pub fn start() {
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(App);
}