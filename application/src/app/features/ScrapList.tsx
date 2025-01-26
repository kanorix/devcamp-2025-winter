import { Flex, Paper, Text } from "@mantine/core";
import { type api } from "~/trpc/server";

type Props = {
  scraps: Awaited<ReturnType<typeof api.scrap.findAll>>;
};

export const ScrapList = ({ scraps }: Props) => {
  return (
    <Flex gap="md" direction="column-reverse">
      {scraps.map((scrap) => (
        <Paper key={scrap.id} shadow="xs" p="md">
          <Text style={{ whiteSpace: "pre-wrap" }}>{scrap.content}</Text>
          <Text size="sm" c="dimmed" mt="xs">
            {scrap.createdAt.toLocaleString()}
          </Text>
        </Paper>
      ))}
    </Flex>
  );
};
