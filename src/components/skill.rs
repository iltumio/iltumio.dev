use leptos::*;

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
            <div class="text-bold text-l">{name}</div>
        </div>
    }
}