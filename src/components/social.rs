use leptos::*;
use crate::components::icons::{TwitterIcon, GithubIcon, LinkedInIcon};

#[component]
pub fn Social(
    link: String,
    social_type: String,
    #[prop(optional)] size: Option<u32>,
) -> impl IntoView {
    let icon_size = size.unwrap_or(30);
    
    view! {
        <a
            href={link}
            target="_blank"
            class="hover:text-cyan-600 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
        >
            {match social_type.as_str() {
                "Github" => view! { <GithubIcon size=icon_size /> }.into_view(),
                "LinkedIn" => view! { <LinkedInIcon size=icon_size /> }.into_view(),
                "Twitter" => view! { <TwitterIcon size=icon_size /> }.into_view(),
                _ => view! { <span>"Unknown social type"</span> }.into_view(),
            }}
        </a>
    }
}