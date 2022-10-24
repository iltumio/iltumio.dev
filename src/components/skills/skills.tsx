import { component$ } from "@builder.io/qwik";
import {
  CSS3,
  Docker,
  Ethereum,
  Gatsby,
  HTML5,
  Javascript,
  MongoDB,
  MySQL,
  Next,
  NodeJs,
  Nuxt,
  ProblemSolving,
  React,
  Rust,
  Sass,
  Solana,
  TeamWork,
  Typescript,
  Vue,
} from "../icons";
import { Git } from "../icons/Git";
import Skill from "../skill/skill";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Skills</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl w-full">
        <Skill icon={<Ethereum />} name="Solidity" />
        <Skill icon={<Ethereum />} name="Web3" />
        <Skill icon={<Ethereum />} name="Ethers JS" />
        <Skill icon={<Solana />} name="Solana" />
        <Skill icon={<Typescript />} name="Typescript" />
        <Skill icon={<Javascript />} name="Javascript" />
        <Skill icon={<Vue />} name="Vue" />
        <Skill icon={<Nuxt />} name="Nuxt" />
        <Skill icon={<React />} name="React" />
        <Skill icon={<React />} name="React Native" />
        <Skill icon={<Next />} name="Next JS" />
        <Skill icon={<Gatsby />} name="Gatsby Js" />
        <Skill icon={<NodeJs />} name="Node Js" />
        <Skill icon={<Rust />} name="Rust" />
        <Skill icon={<HTML5 />} name="HTML5" />
        <Skill icon={<CSS3 />} name="CSS3" />
        <Skill icon={<Sass />} name="Sass" />
        <Skill icon={<Git />} name="Git" />
        <Skill icon={<Docker />} name="Docker" />
        <Skill icon={<MongoDB />} name="MongoDB" />
        <Skill icon={<MySQL />} name="MySQL" />
        <Skill icon={<TeamWork />} name="Team working" />
        <Skill icon={<ProblemSolving />} name="Problem solving" />
      </div>
    </div>
  );
});
