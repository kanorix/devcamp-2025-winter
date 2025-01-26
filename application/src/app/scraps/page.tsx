import { Container } from "@mantine/core";

import { HydrateClient } from "~/trpc/server";
import ScrapScreen from "../features/ScrapScreen";

export default async function Home() {
  return (
    <HydrateClient>
      <Container size="sm">
        <ScrapScreen />
      </Container>
    </HydrateClient>
  );
}
