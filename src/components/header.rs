use leptos::*;
use crate::components::social::Social;

#[component]
pub fn Header() -> impl IntoView {
    view! {
        <header>
            <section class="flex justify-center">
                <div class="flex flex-col lg:flex-row justify-between items-center">
                    <img
                        class="w-36 h-36 rounded-xl ring-gray-300 dark:ring-gray-500"
                        src="/ProfilePicture.png"
                        alt="Bordered avatar"
                    />
                    <div class="flex flex-col text-center justify-center content-center lg:pl-12 lg:text-left">
                        <div class="flex flex-col lg:flex-row">
                            <h1 class="text-3xl font-extrabold sm:text-5xl max-w-1/2">
                                "Manuel Tumiati"
                            </h1>
                            <div class="flex flex-row justify-evenly items-center lg:w-1/2 text-3xl pt-4 pb-4 md:pb-2">
                                <Social link="https://github.com/iltumio".to_string() social_type="Github".to_string() />
                                <Social link="https://www.linkedin.com/in/manuel-tumiati/".to_string() social_type="LinkedIn".to_string() />
                                <Social link="https://x.com/iltumio".to_string() social_type="Twitter".to_string() />
                            </div>
                        </div>
                        <h2 class="text-xl">
                            <strong class="font-extrabold text-red-700 sm:block">
                                "Web3 CTO & Blockchain Engineer"
                            </strong>
                        </h2>
                        <p class="mt-4 sm:leading-relaxed sm:text-l text-justify md:pl-0 md:pr-0 pl-4 pr-4">
                            "I am a passionate software engineer specializing in blockchain technology, with expertise in architecture design, smart contract development, and decentralized solutions. I am deeply committed to advancing "
                            <strong>"digital identity"</strong>
                            " using self-sovereign identity principles and "
                            <strong>"zero-knowledge proofs"</strong>
                            ", leveraging their potential to drive innovation and solve complex challenges."
                        </p>
                    </div>
                </div>
            </section>
        </header>
    }
}