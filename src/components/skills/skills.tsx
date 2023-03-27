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
        <Skill name="Solidity">
          <Ethereum q:slot="icon" />
        </Skill>
        <Skill name="Web3">
          <Ethereum q:slot="icon" />
        </Skill>
        <Skill name="Ethers JS">
          <Ethereum q:slot="icon" />
        </Skill>
        <Skill name="Solana">
          <Solana q:slot="icon" />
        </Skill>
        <Skill name="Typescript">
          <Typescript q:slot="icon" />
        </Skill>
        <Skill name="Javascript">
          <Javascript q:slot="icon" />
        </Skill>
        <Skill name="Vue">
          <Vue q:slot="icon" />
        </Skill>
        <Skill name="Nuxt">
          <Nuxt q:slot="icon" />
        </Skill>
        <Skill name="React">
          <React q:slot="icon" />
        </Skill>
        <Skill name="React Native">
          <React q:slot="icon" />
        </Skill>
        <Skill name="Next JS">
          <Next q:slot="icon" />
        </Skill>
        <Skill name="Gatsby Js">
          <Gatsby q:slot="icon" />
        </Skill>
        <Skill name="Node Js">
          <NodeJs q:slot="icon" />
        </Skill>
        <Skill name="Rust">
          <Rust q:slot="icon" />
        </Skill>
        <Skill name="HTML5">
          <HTML5 q:slot="icon" />
        </Skill>
        <Skill name="CSS3">
          <CSS3 q:slot="icon" />
        </Skill>
        <Skill name="Sass">
          <Sass q:slot="icon" />
        </Skill>
        <Skill name="Git">
          <Git q:slot="icon" />
        </Skill>
        <Skill name="Docker">
          <Docker q:slot="icon" />
        </Skill>
        <Skill name="MongoDB">
          <MongoDB q:slot="icon" />
        </Skill>
        <Skill name="MySQL">
          <MySQL q:slot="icon" />
        </Skill>
        <Skill name="Team working">
          <TeamWork q:slot="icon" />
        </Skill>
        <Skill name="Problem solving">
          <ProblemSolving q:slot="icon" />
        </Skill>
      </div>
    </div>
  );
});
