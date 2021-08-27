import * as React from "react";
import { Box } from "@chakra-ui/react";
import Hero from "../components/hero/Hero";
import CurrentJob from "../components/currentJob/CurrentJob";
import Skills from "../components/skills/Skills";

const IndexPage = () => {
  return (
    <Box>
      <Hero />
      <CurrentJob />
      <Skills />
    </Box>
  );
};

export default IndexPage;
