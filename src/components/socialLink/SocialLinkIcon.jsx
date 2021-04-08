import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'

export const SocialLinkIcon = (props) => (
  <Box
    transition="all 0.2s"
    _hover={{ color: "blue.200" }}
    fontSize="lg"
    color="white"
    {...props}
    h="40px" w="40px"
  />
)