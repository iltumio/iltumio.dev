import { component$ } from "@builder.io/qwik";
import { Solana } from "../icons";
import {
  FaNodeJs,
  FaHtml5,
  FaCss3,
  FaSass,
  FaRust,
  FaJs,
  FaGitAlt,
  FaDocker,
  FaReact,
  FaVuejs,
  FaEthereum,
  FaUsersSolid,
  FaWandMagicSparklesSolid,
} from "@qwikest/icons/font-awesome";
import {
  SiNextdotjs,
  SiNuxtdotjs,
  SiMysql,
  SiMongodb,
  SiGatsby,
  SiTypescript,
  SiSolidity,
} from "@qwikest/icons/simpleicons";
import Skill from "../skill/skill";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Skills</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl w-full">
        <Skill name="Solidity">
          <SiSolidity q:slot="icon" />
        </Skill>
        <Skill name="Web3">
          <FaEthereum q:slot="icon" />
        </Skill>
        <Skill name="Ethers">
          <FaEthereum q:slot="icon" />
        </Skill>
        <Skill name="Solana">
          <Solana q:slot="icon" />
        </Skill>
        <Skill name="Typescript">
          <SiTypescript q:slot="icon" />
        </Skill>
        <Skill name="Javascript">
          <FaJs q:slot="icon" />
        </Skill>
        <Skill name="Vue">
          <FaVuejs q:slot="icon" />
        </Skill>
        <Skill name="Nuxt">
          <SiNuxtdotjs q:slot="icon" />
        </Skill>
        <Skill name="React">
          <FaReact q:slot="icon" />
        </Skill>
        <Skill name="React Native">
          <FaReact q:slot="icon" />
        </Skill>
        <Skill name="Next JS">
          <SiNextdotjs q:slot="icon" />
        </Skill>
        <Skill name="Gatsby Js">
          <SiGatsby q:slot="icon" />
        </Skill>
        <Skill name="Node Js">
          <FaNodeJs q:slot="icon" />
        </Skill>
        <Skill name="Rust">
          <FaRust q:slot="icon" />
        </Skill>
        <Skill name="HTML5">
          <FaHtml5 q:slot="icon" />
        </Skill>
        <Skill name="CSS3">
          <FaCss3 q:slot="icon" />
        </Skill>
        <Skill name="Sass">
          <FaSass q:slot="icon" />
        </Skill>
        <Skill name="Git">
          <FaGitAlt q:slot="icon" />
        </Skill>
        <Skill name="Docker">
          <FaDocker q:slot="icon" />
        </Skill>
        <Skill name="MongoDB">
          <SiMongodb q:slot="icon" />
        </Skill>
        <Skill name="MySQL">
          <SiMysql q:slot="icon" />
        </Skill>
        <Skill name="Team working">
          <FaUsersSolid q:slot="icon" />
        </Skill>
        <Skill name="Problem solving">
          <FaWandMagicSparklesSolid q:slot="icon" />
        </Skill>
      </div>
    </div>
  );
});
