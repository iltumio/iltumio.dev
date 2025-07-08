use leptos::prelude::*;

#[component]
pub fn Skill(
    name: String,
    children: Children,
) -> impl IntoView {
    view! {
        <div class="flex flex-row items-center">
            <div class="flex p-2">
                {children()}
            </div>
            <span class="text-xs text-gray-700">{name}</span>
        </div>
    }
}