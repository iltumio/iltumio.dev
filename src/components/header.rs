use leptos::prelude::*;
use crate::components::social::Social;

#[component]
pub fn Header() -> impl IntoView {
    view! {
        <header>
            <section class="flex justify-center">
                <div class="flex flex-col lg:flex-row justify-between items-center max-w-screen-xl w-full p-6">
                    <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <img 
                            src="/Manuel_Tumiati.png" 
                            alt="Manuel Tumiati" 
                            class="w-24 h-24 lg:w-32 lg:h-32 rounded-full mb-4"
                        />
                        <h1 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                            "Manuel Tumiati"
                        </h1>
                        <h2 class="text-lg lg:text-xl text-gray-600 mb-4">
                            "Web3 CTO & Blockchain Engineer"
                        </h2>
                        <p class="text-sm lg:text-base text-gray-700 mb-6 max-w-md">
                            "Redefining digital identity with seamless, innovative solutions for everyone at Zyphe Inc"
                        </p>
                    </div>
                    <div class="flex space-x-4">
                        <Social 
                            social_type="Github".to_string()
                            link="https://github.com/Meschreiber".to_string()
                            size=32
                        />
                        <Social 
                            social_type="LinkedIn".to_string()
                            link="https://www.linkedin.com/in/manuel-tumiati-94a13a154/".to_string()
                            size=32
                        />
                        <Social 
                            social_type="Twitter".to_string()
                            link="https://twitter.com/ManuelTumiati".to_string()
                            size=32
                        />
                    </div>
                </div>
            </section>
        </header>
    }
}