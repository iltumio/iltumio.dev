use leptos::*;
use leptos_meta::*;
use leptos_router::*;

use crate::components::{header::Header, current_jobs::CurrentJobs, skills::Skills, cta::Cta};

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/iltumio-dev.css"/>
        <Title text="Manuel Tumiati | Web3 CTO & Blockchain Engineer"/>
        <Meta name="description" content="Redefining digital identity with seamless, innovative solutions for everyone at Zyphe Inc"/>
        
        <Router>
            <main class="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
                <div class="p-2 lg:p-0 lg:max-w-6xl flex flex-col">
                    <Header />
                    <section>
                        <CurrentJobs />
                    </section>
                    <section>
                        <Cta />
                    </section>
                    <section>
                        <Skills />
                    </section>
                </div>
            </main>
            <footer></footer>
        </Router>
    }
}