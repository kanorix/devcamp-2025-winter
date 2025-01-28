import { Container } from "@mantine/core";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import ScrapScreen from "../features/ScrapScreen";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    return <div>ログインしてください</div>;
  }

  return (
    <HydrateClient>
      <Container size="sm">
        <ScrapScreen />
      </Container>
    </HydrateClient>
  );
}
