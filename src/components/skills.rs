use leptos::prelude::*;
use crate::components::skill::Skill;
use crate::components::icons::RustIcon;

#[component]
pub fn Skills() -> impl IntoView {
    view! {
        <section class="w-full">
            <div>
                <h3 class="text-2xl font-bold mb-6 text-center text-gray-800">
                    "Technical Skills"
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <Skill name="Rust".to_string()>
                        <RustIcon size=24 />
                    </Skill>
                    <Skill name="Solidity".to_string()>
                        <div class="w-6 h-6 bg-gray-600 rounded"></div>
                    </Skill>
                    <Skill name="TypeScript".to_string()>
                        <div class="w-6 h-6 bg-blue-600 rounded"></div>
                    </Skill>
                    <Skill name="Web3".to_string()>
                        <div class="w-6 h-6 bg-purple-600 rounded"></div>
                    </Skill>
                    <Skill name="Zero-Knowledge".to_string()>
                        <div class="w-6 h-6 bg-indigo-600 rounded"></div>
                    </Skill>
                    <Skill name="Blockchain".to_string()>
                        <div class="w-6 h-6 bg-orange-600 rounded"></div>
                    </Skill>
                    <Skill name="React".to_string()>
                        <div class="w-6 h-6 bg-blue-500 rounded"></div>
                    </Skill>
                    <Skill name="Node.js".to_string()>
                        <div class="w-6 h-6 bg-green-700 rounded"></div>
                    </Skill>
                    <Skill name="Docker".to_string()>
                        <div class="w-6 h-6 bg-blue-700 rounded"></div>
                    </Skill>
                    <Skill name="Git".to_string()>
                        <div class="w-6 h-6 bg-red-600 rounded"></div>
                    </Skill>
                    <Skill name="IPFS".to_string()>
                        <div class="w-6 h-6 bg-teal-600 rounded"></div>
                    </Skill>
                    <Skill name="Architecture".to_string()>
                        <div class="w-6 h-6 bg-gray-700 rounded"></div>
                    </Skill>
                </div>
            </div>
        </section>
    }
}