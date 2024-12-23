import { component$ } from "@builder.io/qwik";
import JobPosition from "../jobPosition/jobPosition";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Current Job</h2>
      <div class="grid lg:grid-cols-2 w-full">
        <JobPosition
          name="Zyphe Inc."
          role="Co-founder &amp; Chief Technology Officer"
          description="Redefining digital identity with seamless, innovative solutions for everyone"
          image="/zyphe-logo.webp"
          link="https://zyphe.com"
          from="Dec. 2024"
          to="now"
          highlight
        />
        <JobPosition
          name="KNOBS"
          role="Web3 Advisor"
          description="Software House specialized in Web applications and systems based on blockchain and Web3 technologies"
          image="https://pbs.twimg.com/profile_images/1225071653459238914/OiZpNqAL_400x400.png"
          link="https://knobs.it"
          from="Dec. 2024"
          to="now"
        />
        <JobPosition
          name="Intraverse"
          role="Web3 Advisor"
          description="Gamified community engagement platform that represents the evolution of acquisition, engagement and loyalty"
          image="/intraverse-logo.webp"
          link="https://intraverse.io"
          from="june. 2024"
          to="now"
        />
        <JobPosition
          name="Satellite.im"
          role="Web3 Advisor"
          description="Multi platform, decentralized, privacy focused messaging application bringing Web3 technologies to everyone"
          image="https://pbs.twimg.com/profile_images/1397668569467531266/47JoP9A2_400x400.jpg"
          link="https://satellite.im"
          from="dec. 2020"
          to="now"
        />
      </div>
    </div>
  );
});
