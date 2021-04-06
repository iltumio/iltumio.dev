import * as React from "react";
import { Box, Flex, Stack, Text, useColorModeValue as mode } from "@chakra-ui/react";

const JobTitle = (props) => {
  const { company, title, children, icon, dates } = props;
  return (
    <Stack spacing="6" direction={{ base: "column", md: "row" }}>
      <Flex alignItems="center" justifyContent="center">
        {icon}
      </Flex>
      <Stack spacing="1">
        <Text fontWeight="extrabold" fontSize="lg">
          {company}
        </Text>
        <Text fontWeight="bold" fontSize="md">
          {title}
        </Text>
        <Text color="gray.400" fontSize="md">
          {dates}
        </Text>
        <Box color={mode("gray.600", "gray.400")}>{children}</Box>
      </Stack>
    </Stack>
  );
};

export default JobTitle;
