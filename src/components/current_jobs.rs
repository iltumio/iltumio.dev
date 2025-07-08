use leptos::prelude::*;
use crate::components::job_position::JobPosition;

#[component]
pub fn CurrentJobs() -> impl IntoView {
    view! {
        <section>
            <div>
                <h3 class="text-2xl font-bold mb-6 text-center text-gray-800">
                    "Current Positions"
                </h3>
                
                <div class="space-y-6">
                    <JobPosition
                        image="/zyphe-logo.webp".to_string()
                        name="Zyphe Inc.".to_string()
                        role="CTO & Co-Founder".to_string()
                        description="Leading technical strategy and blockchain development for digital identity solutions. Building self-sovereign identity infrastructure using zero-knowledge proofs and decentralized protocols.".to_string()
                        link="https://zyphe.com".to_string()
                        from="2023".to_string()
                        to="Present".to_string()
                        highlight=true
                    />
                    
                    <JobPosition
                        image="/freelance-logo.png".to_string()
                        name="Freelance".to_string()
                        role="Blockchain Consultant".to_string()
                        description="Providing blockchain architecture and smart contract development services to various clients. Specializing in DeFi protocols, NFT platforms, and Web3 infrastructure.".to_string()
                        link="#".to_string()
                        from="2022".to_string()
                        to="Present".to_string()
                        highlight=false
                    />
                </div>
            </div>
        </section>
    }
}