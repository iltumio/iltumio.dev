use leptos::prelude::*;

#[component]
pub fn Cta() -> impl IntoView {
    view! {
        <section class="w-full">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4 text-gray-800">
                    "Let's Build the Future Together"
                </h3>
                <p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                    "Ready to transform your ideas into reality? I'm here to help you navigate the world of blockchain, Web3, and digital identity solutions."
                </p>
                <div class="flex justify-center space-x-4">
                    <a 
                        href="mailto:manuel@zyphe.com"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        "Get In Touch"
                    </a>
                    <a 
                        href="https://calendly.com/manueltumiati"
                        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        "Schedule a Call"
                    </a>
                </div>
            </div>
        </section>
    }
}