use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use wasm_bindgen::prelude::*;

pub mod app;
pub mod components;

use app::*;

#[wasm_bindgen]
pub fn hydrate() {
    console_error_panic_hook::set_once();
    leptos::mount_to(get_element("leptos"), App);
}

#[wasm_bindgen]
pub fn start() {
    console_error_panic_hook::set_once();
    leptos::mount_to(get_element("leptos"), App);
}

fn get_element(id: &str) -> web_sys::Element {
    use wasm_bindgen::JsCast;
    
    web_sys::window()
        .unwrap()
        .document()
        .unwrap()
        .get_element_by_id(id)
        .unwrap()
        .dyn_into()
        .unwrap()
}