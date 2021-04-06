import * as React from "react";
import { Box } from "@chakra-ui/react";
import Hero from "../components/hero/hero";
import CurrentJob from "../components/currentJob/CurrentJob";


const IndexPage = () => {
  return (
    <Box>
      <Hero />
      <CurrentJob />
    </Box>
  );
};

export default IndexPage;
