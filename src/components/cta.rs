use leptos::*;
use crate::components::icons::CalendarIcon;

#[component]
pub fn Cta() -> impl IntoView {
    let handle_click = move |_| {
        // For now, just open Calendly in a new tab
        // In the future, you can add the widget integration
        if let Some(window) = web_sys::window() {
            let _ = window.open_with_url_and_target(
                "https://calendly.com/manuel-zyphe/meet-manuel",
                "_blank"
            );
        }
    };

    view! {
        <div class="flex flex-col items-center">
            <h2 class="text-xl font-bold pb-4 pt-4">"Let's connect"</h2>
            <div class="flex justify-center items-center">
                <button
                    class="bg-blue-500 text-white p-4 rounded-full flex items-center gap-2 text-2xl hover:bg-blue-600 shadow-lg"
                    on:click=handle_click
                >
                    <CalendarIcon size=24 />
                    "Schedule time with me"
                </button>
            </div>
        </div>
    }
}