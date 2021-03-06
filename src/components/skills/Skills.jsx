import React from "react";
import { Flex, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import {
  FaHtml5,
  FaCss3,
  FaSass,
  FaVuejs,
  FaEthereum,
  FaDocker,
  FaJs,
  FaUsers,
  FaMagic,
} from "react-icons/fa";
import {
  DiNodejsSmall,
  DiGit,
  DiMongodb,
  DiReact,
  DiMysql,
} from "react-icons/di";
import {
  SiGatsby,
  SiNextdotjs,
  SiTypescript,
  SiRust,
  SiNuxtdotjs,
} from "react-icons/si";
import { SolanaIcon } from "../icons";
import { Skill } from "../index";

const iconSize = 25;

export const Skills = () => (
  <Container maxW="8xl">
    <Heading size="xl" fontWeight="extrabold" textAlign="center" p={8}>
      Skills
    </Heading>
    <Flex direction="row">
      <SimpleGrid minChildWidth="180px" width="100%">
        <Skill icon={<FaEthereum size={iconSize} />}>Solidity</Skill>
        <Skill icon={<FaEthereum size={iconSize} />}>Web3</Skill>
        <Skill icon={<FaEthereum size={iconSize} />}>Ethers JS</Skill>
        <Skill icon={<SolanaIcon width={iconSize} height={iconSize} />}>
          Solana
        </Skill>
        <Skill icon={<SiTypescript size={iconSize} />}>Typescript</Skill>
        <Skill icon={<FaJs size={iconSize} />}>Javascript</Skill>
        <Skill icon={<FaVuejs size={iconSize} />}>VueJS</Skill>
        <Skill icon={<SiNuxtdotjs size={iconSize} />}>Nuxt</Skill>
        <Skill icon={<DiReact size={iconSize} />}>React</Skill>
        <Skill icon={<DiReact size={iconSize} />}>React Native</Skill>
        <Skill icon={<SiNextdotjs size={iconSize} />}>Next.Js</Skill>
        <Skill icon={<SiGatsby size={iconSize} />}>Gatsby Js</Skill>
        <Skill icon={<DiNodejsSmall size={iconSize} />}>Node JS</Skill>
        <Skill icon={<SiRust size={iconSize} />}>Rust</Skill>
        <Skill icon={<FaHtml5 size={iconSize} />}>HTML5</Skill>
        <Skill icon={<FaCss3 size={iconSize} />}>CSS</Skill>
        <Skill icon={<FaSass size={iconSize} />}>Sass</Skill>
        <Skill icon={<DiGit size={iconSize} />}>Git</Skill>
        <Skill icon={<FaDocker size={iconSize} />}>Docker</Skill>
        <Skill icon={<DiMongodb size={iconSize} />}>MongoDB</Skill>
        <Skill icon={<DiMysql size={iconSize} />}>MySQL</Skill>
        <Skill icon={<FaUsers size={iconSize} />}>Team working</Skill>
        <Skill icon={<FaMagic size={iconSize} />}>Problem solving</Skill>
      </SimpleGrid>
    </Flex>
  </Container>
);
