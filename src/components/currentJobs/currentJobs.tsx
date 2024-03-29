import { component$ } from "@builder.io/qwik";
import JobPosition from "../jobPosition/jobPosition";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Current Job</h2>
      <div class="grid lg:grid-cols-3 w-full">
        <JobPosition
          name="KNOBS"
          role="Chief Technology Officer"
          description="Software House & Tech Advisory firm specialized in Web-IoT applications and systems based on blockchain technology"
          image="https://pbs.twimg.com/profile_images/1225071653459238914/OiZpNqAL_400x400.png"
          link="https://knobs.it"
          from="sep. 2018"
          to="now"
        />
        <JobPosition
          name="Bilinear.io"
          role="Managing Director"
          description="NFT Marketplace and project launchpad on Linea"
          image="https://pbs.twimg.com/profile_images/1678784889456295936/Fv-m_jpY_400x400.png"
          link="https://bilinear.io"
          from="march. 2023"
          to="now"
        />
        <JobPosition
          name="Satellite.im"
          role="Web3 Advisor"
          description="Multi platform, decentralized and privacy focused messaging application build on top of blockchain, IPFS and peer-to-peer connections"
          image="https://pbs.twimg.com/profile_images/1397668569467531266/47JoP9A2_400x400.jpg"
          link="https://satellite.im"
          from="dec. 2020"
          to="now"
        />
      </div>
    </div>
  );
});
