import { Container, Text } from "@mantine/core";
import Link from "next/link";

import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <Container size="sm" py="xl">
        <Text>Hello World</Text>
        <Link href="/api/auth/signin">ログイン</Link>
      </Container>
    </HydrateClient>
  );
}
