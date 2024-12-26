import { Box, Text } from '@umami/react-zen';

export function Footer() {
  return (
    <Box as="footer" paddingY="8">
      <Text align="center" as="div">
        Built by{' '}
        <a href="https://umami.is?ref=shiso">
          <strong>umami</strong>
        </a>
      </Text>
    </Box>
  );
}
