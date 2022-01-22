import * as React from "react";
import {
  Box,
  Center,
  Heading,
  LightMode,
  SimpleGrid,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SocialLink } from "../index";
import ProfilePicture from "../../images/manuel-tumiati-profile-picture.jpg";

export const Hero = () => (
  <Box
    as="section"
    bg="gray.800"
    py="12"
    position="relative"
    h={{ base: "400px" }}
    bgImage="url(https://gateway.pinata.cloud/ipfs/QmWLDuHUgBAtYEjCe8goawz5FCJf2a5DGVTpQrWbNQmeE7)"
    bgSize="cover"
    bgPosition="center"
    _after={{
      content: `""`,
      display: "block",
      w: "full",
      h: "full",
      bg: "blackAlpha.700",
      position: "absolute",
      inset: 0,
      zIndex: 0,
    }}
  >
    <Box
      maxW={{ base: "xl", md: "7xl" }}
      mx="auto"
      px={{ base: "6", md: "8" }}
      h="full"
      zIndex={1}
      position="relative"
    >
      <Center flexDirection="column" textAlign="center" color="white" h="full">
        <Avatar src={ProfilePicture} w="80px" h="80px" />
        <Heading size="2xl" fontWeight="extrabold">
          Manuel Tumiati
        </Heading>
        <Text fontSize="lg" fontWeight="medium" mt="3">
          Software Engineer
        </Text>
        <LightMode>
          I'm a passionate developer from Milan, Italy, interested into
          everything
          <br />
          that moves around software development and blockchain technology
        </LightMode>
      </Center>
    </Box>
    <Box
      display={{ base: "block" }}
      position="absolute"
      zIndex={2}
      w="full"
      bottom="0"
      py="4"
      bg="blackAlpha.400"
    >
      <Box maxW={{ base: "xl", md: "7xl" }} mx="auto">
        <SimpleGrid columns={{ base: 3 }}>
          <Box textAlign="center" color="white">
            <SocialLink
              href="https://twitter.com/iltumio"
              color="white"
              icon={FaTwitter}
              label="twitter"
            />
          </Box>
          <Box textAlign="center" color="white">
            <SocialLink
              href="https://www.linkedin.com/in/manuel-tumiati/"
              icon={FaLinkedin}
              label="LinkedIn"
              color="white"
            />
          </Box>
          <Box textAlign="center" color="white">
            <SocialLink
              href="https://github.com/iltumio"
              icon={FaGithub}
              label="Github"
            />
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  </Box>
);
