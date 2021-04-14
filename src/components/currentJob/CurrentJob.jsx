import * as React from "react";
import { Box, Container, SimpleGrid, Image, Heading } from "@chakra-ui/react";
import Feature from "../jobTitle/JobTitle";
import KNOBS from "../../images/KNOBS-logotipo.png";
import BCode from "../../images/bcode-logotipo.png";
import Satellite from "../../images/satellite-logotipo.png";

const CurrentJob = () => (
  <Box>
    <Container maxW="8xl">
      <Heading size="xl" fontWeight="extrabold" textAlign="center" p={8}>
        Current Job
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacingX="10" spacingY="14">
        <Feature
          company="KNOBS Srl"
          title="Chief Technology Officer"
          icon={<Image w="55px" src={KNOBS} />}
          dates="sep. 2018 - now"
          href="https://www.knobs.it"
        >
          Software House & Tech Advisory firm specialized in Web-IoT applications and systems based on blockchain technology
        </Feature>
        <Feature
          company="BCode"
          title="Software Architect"
          icon={<Image w="55px" src={BCode} />}
          dates="nov. 2020 - now"
          href="https://www.bcode.cloud"
        >
          Blockchain focused tech firm that develops many applications to give companies easy access and frictionless onboarding to the blockchain
        </Feature>
        <Feature
          company="Satellite.im"
          title="Blockchain Engineer"
          icon={<Image w="65px" src={Satellite} />}
          dates="dec. 2020 - now"
          href="http://site.satellite.im"
        >
          Multi platform, decentralized and privacy focused messaging application build on top of blockchain, IPFS and peer-to-peer connections
        </Feature>
      </SimpleGrid>
    </Container>
  </Box>
);

export default CurrentJob;
