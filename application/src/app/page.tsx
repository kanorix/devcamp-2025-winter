import { Container } from "@mantine/core";

import { HydrateClient } from "~/trpc/server";
import { SignIn } from "./features/SignIn";
export default function Home() {
  return (
    <HydrateClient>
      <Container size="sm" py="xl">
        <SignIn />
      </Container>
    </HydrateClient>
  );
}
