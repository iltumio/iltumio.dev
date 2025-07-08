use leptos::*;
use crate::components::skill::Skill;
use crate::components::icons::RustIcon;

#[component]
pub fn Skills() -> impl IntoView {
    view! {
        <div class="flex flex-col items-center">
            <h2 class="text-xl font-bold pb-4 pt-4">"Skills"</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl w-full">
                <Skill name="Rust".to_string()>
                    <RustIcon size=24 />
                </Skill>
                <Skill name="Solidity".to_string()>
                    <div class="w-6 h-6 bg-gray-600 rounded"></div>
                </Skill>
                <Skill name="Typescript".to_string()>
                    <div class="w-6 h-6 bg-blue-600 rounded"></div>
                </Skill>
                <Skill name="Web3".to_string()>
                    <div class="w-6 h-6 bg-purple-600 rounded"></div>
                </Skill>
                <Skill name="Ethers".to_string()>
                    <div class="w-6 h-6 bg-purple-600 rounded"></div>
                </Skill>
                <Skill name="Solana".to_string()>
                    <div class="w-6 h-6 bg-green-500 rounded"></div>
                </Skill>
                <Skill name="Javascript".to_string()>
                    <div class="w-6 h-6 bg-yellow-500 rounded"></div>
                </Skill>
                <Skill name="Vue".to_string()>
                    <div class="w-6 h-6 bg-green-600 rounded"></div>
                </Skill>
                <Skill name="Nuxt".to_string()>
                    <div class="w-6 h-6 bg-green-600 rounded"></div>
                </Skill>
                <Skill name="React".to_string()>
                    <div class="w-6 h-6 bg-blue-500 rounded"></div>
                </Skill>
                <Skill name="React Native".to_string()>
                    <div class="w-6 h-6 bg-blue-500 rounded"></div>
                </Skill>
                <Skill name="Next JS".to_string()>
                    <div class="w-6 h-6 bg-black rounded"></div>
                </Skill>
                <Skill name="Gatsby Js".to_string()>
                    <div class="w-6 h-6 bg-purple-700 rounded"></div>
                </Skill>
                <Skill name="Node Js".to_string()>
                    <div class="w-6 h-6 bg-green-700 rounded"></div>
                </Skill>
                <Skill name="HTML5".to_string()>
                    <div class="w-6 h-6 bg-orange-600 rounded"></div>
                </Skill>
                <Skill name="CSS3".to_string()>
                    <div class="w-6 h-6 bg-blue-600 rounded"></div>
                </Skill>
                <Skill name="Sass".to_string()>
                    <div class="w-6 h-6 bg-pink-600 rounded"></div>
                </Skill>
                <Skill name="Git".to_string()>
                    <div class="w-6 h-6 bg-red-600 rounded"></div>
                </Skill>
                <Skill name="Docker".to_string()>
                    <div class="w-6 h-6 bg-blue-700 rounded"></div>
                </Skill>
                <Skill name="MongoDB".to_string()>
                    <div class="w-6 h-6 bg-green-700 rounded"></div>
                </Skill>
                <Skill name="MySQL".to_string()>
                    <div class="w-6 h-6 bg-blue-800 rounded"></div>
                </Skill>
                <Skill name="Team working".to_string()>
                    <div class="w-6 h-6 bg-gray-600 rounded"></div>
                </Skill>
                <Skill name="Problem solving".to_string()>
                    <div class="w-6 h-6 bg-indigo-600 rounded"></div>
                </Skill>
            </div>
        </div>
    }
}