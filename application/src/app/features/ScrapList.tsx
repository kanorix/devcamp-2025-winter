import {
  Box,
  Flex,
  Paper,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { generateHTML, type JSONContent } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import { type api } from "~/trpc/server";

type Props = {
  scraps: Awaited<ReturnType<typeof api.scrap.findAll>>;
};

const Scrap = ({
  scrap,
}: {
  scrap: Awaited<ReturnType<typeof api.scrap.findAll>>[number];
}) => {
  const output = useMemo(() => {
    return generateHTML(JSON.parse(scrap.content ?? "{}") as JSONContent, [
      StarterKit,
      Link,
    ]);
  }, [scrap.content]);

  return (
    <Paper key={scrap.id} shadow="md" p="md" withBorder>
      <TypographyStylesProvider>
        <Box dangerouslySetInnerHTML={{ __html: output }} />
      </TypographyStylesProvider>

      <Text size="sm" c="dimmed" mt="xs">
        {scrap.createdAt.toLocaleString()}
      </Text>
    </Paper>
  );
};

export const ScrapList = ({ scraps }: Props) => {
  return (
    <Flex gap="md" direction="column-reverse">
      {scraps.map((scrap) => (
        <Scrap key={scrap.id} scrap={scrap} />
      ))}
    </Flex>
  );
};
