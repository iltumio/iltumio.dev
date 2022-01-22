import React from "react";
import { Flex, Text } from "@chakra-ui/react";

export const Skill = ({ icon, children }) => (
  <Flex direction="row" alignItems="center">
    <Flex p={2}>{icon}</Flex>
    <Flex flex="1">
      <Text fontWeight="bold" fontSize="md">
        {children}
      </Text>
    </Flex>
  </Flex>
);
