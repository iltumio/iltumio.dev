use leptos::*;
use crate::components::job_position::JobPosition;

#[component]
pub fn CurrentJobs() -> impl IntoView {
    view! {
        <div class="flex flex-col items-center">
            <h2 class="text-xl font-bold pb-4 pt-4">"Current Job"</h2>
            <div class="grid lg:grid-cols-2 w-full">
                <JobPosition
                    name="Zyphe Inc.".to_string()
                    role="Co-founder &amp; Chief Technology Officer".to_string()
                    description="Redefining digital identity with seamless, innovative solutions for everyone".to_string()
                    image="/zyphe-logo.webp".to_string()
                    link="https://zyphe.com".to_string()
                    from="Dec. 2024".to_string()
                    to="now".to_string()
                    highlight=true
                />
                <JobPosition
                    name="KNOBS".to_string()
                    role="Web3 Advisor".to_string()
                    description="Software House specialized in Web applications and systems based on blockchain and Web3 technologies".to_string()
                    image="https://pbs.twimg.com/profile_images/1225071653459238914/OiZpNqAL_400x400.png".to_string()
                    link="https://knobs.it".to_string()
                    from="Dec. 2024".to_string()
                    to="now".to_string()
                    highlight=false
                />
                <JobPosition
                    name="Intraverse".to_string()
                    role="Web3 Advisor".to_string()
                    description="Gamified community engagement platform that represents the evolution of acquisition, engagement and loyalty".to_string()
                    image="/intraverse-logo.webp".to_string()
                    link="https://intraverse.io".to_string()
                    from="june. 2024".to_string()
                    to="now".to_string()
                    highlight=false
                />
                <JobPosition
                    name="Satellite.im".to_string()
                    role="Web3 Advisor".to_string()
                    description="Multi platform, decentralized, privacy focused messaging application bringing Web3 technologies to everyone".to_string()
                    image="https://pbs.twimg.com/profile_images/1397668569467531266/47JoP9A2_400x400.jpg".to_string()
                    link="https://satellite.im".to_string()
                    from="dec. 2020".to_string()
                    to="now".to_string()
                    highlight=false
                />
            </div>
        </div>
    }
}