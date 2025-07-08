use leptos::prelude::*;
use leptos_meta::*;

use crate::components::{header::Header, current_jobs::CurrentJobs, skills::Skills, cta::Cta};

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();
    
    view! {
        <Stylesheet id="leptos" href="/pkg/iltumio-dev.css"/>
        <Title text="Manuel Tumiati | Web3 CTO & Blockchain Engineer"/>
        <Meta name="description" content="Redefining digital identity with seamless, innovative solutions for everyone at Zyphe Inc"/>

        <main class="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
            <div class="bg-white border rounded shadow-xl p-6 lg:p-12 lg:w-3/5 w-full lg:max-w-screen-xl max-w-screen-lg">
                <div>
                    <section class="flex flex-col lg:flex-row items-center w-full">
                        <Header />
                        <CurrentJobs />
                    </section>
                    <section class="flex flex-col lg:flex-row items-center w-full">
                        <Skills />
                    </section>
                    <section class="flex flex-col lg:flex-row items-center w-full">
                        <Cta />
                    </section>
                </div>
            </div>
        </main>
    }
}