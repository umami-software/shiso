import { Box, Text } from '@umami/react-zen';

export function Footer() {
  return (
    <Box as="footer" paddingY="5">
      <Text align="center" as="div">
        Built by <a href="https://umami.is">umami</a>
      </Text>
    </Box>
  );
}
