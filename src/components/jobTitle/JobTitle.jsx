import * as React from "react";
import {
  Box,
  Stack,
  Text,
  useColorModeValue as mode,
  Link
} from "@chakra-ui/react";

const WrapLink = ({ children, href }) => <Link target="_blank" href={href}>{children}</Link>;

const JobTitle = (props) => {
  const { company, title, children, icon, dates, href } = props;
  return (
    <Stack spacing="6" direction={{ base: "column", md: "row" }}>
      <Stack alignItems="center" justifyContent="center" flex="1">
        {icon}
      </Stack>
      <Stack spacing="1" flex="3">
        <WrapLink href={href}>
          <Text fontWeight="bold" fontSize="md">
            {company}
          </Text>
        </WrapLink>
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
