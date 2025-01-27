import { Container, Flex } from "@mantine/core";

import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { SignIn } from "./features/SignIn";

export default async function Home() {
  const session = await auth();
  return (
    <HydrateClient>
      <Container size="sm" py="xl">
        <Flex direction="column" gap="md">
          <SignIn />
          {session?.user && <Link href="/scraps">Scrapsページへ</Link>}
        </Flex>
      </Container>
    </HydrateClient>
  );
}
