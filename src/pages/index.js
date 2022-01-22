import * as React from "react";
import { Box } from "@chakra-ui/react";

import { Hero, CurrentJob, Skills } from "../components";

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
