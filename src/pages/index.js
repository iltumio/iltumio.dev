import * as React from "react";
import { Box } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

import { Hero, CurrentJob, Skills } from "../components";

const IndexPage = () => {
  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Manuel Tumiati - Blockchain engineer</title>
        <meta
          name="description"
          content="I'm a passionate developer from Milan, Italy, interested into everything that moves around software development and blockchain technology"
        />
        <link rel="canonical" href="https://iltumio.dev" />
      </Helmet>
      <Hero />
      <CurrentJob />
      <Skills />
    </Box>
  );
};

export default IndexPage;
