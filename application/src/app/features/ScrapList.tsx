import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { generateHTML, type JSONContent } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { api as reactApi } from "~/trpc/react";
import { type api } from "~/trpc/server";

type Props = {
  scraps: Awaited<ReturnType<typeof api.scrap.findAll>>;
  refetch: () => Promise<void>;
};

const Scrap = ({
  scrap,
  refetch,
}: {
  scrap: Awaited<ReturnType<typeof api.scrap.findAll>>[number];
  refetch: () => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: deleteScrap } = reactApi.scrap.delete.useMutation();
  const { data: session } = useSession();

  const isOwner = session?.user.id === scrap.createdById;

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    await deleteScrap({ id });
    setIsLoading(false);
    await refetch();
  };

  const output = useMemo(() => {
    return generateHTML(JSON.parse(scrap.content ?? "{}") as JSONContent, [
      StarterKit,
      Link,
    ]);
  }, [scrap.content]);

  const formattedDate = useMemo(() => {
    return scrap.createdAt.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [scrap.createdAt]);

  return (
    <Paper key={scrap.id} shadow="md" p="md" withBorder pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <TypographyStylesProvider>
        <Box dangerouslySetInnerHTML={{ __html: output }} mih={50} />
      </TypographyStylesProvider>

      <Group justify="space-between" mt="xs">
        <Group gap="xs">
          <Text size="sm" fw={500}>
            @{scrap.createdBy.name}
          </Text>
          <Text size="sm" c="dimmed">
            {formattedDate}
          </Text>
        </Group>
        {isOwner && (
          <Button
            variant="subtle"
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={() => handleDelete(scrap.id)}
            loading={isLoading}
          >
            削除
          </Button>
        )}
      </Group>
    </Paper>
  );
};

export const ScrapList = ({ scraps, refetch }: Props) => {
  return (
    <Flex
      gap="md"
      direction="column-reverse"
      style={{
        overscrollBehavior: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {scraps.map((scrap) => (
        <Scrap key={scrap.id} scrap={scrap} refetch={refetch} />
      ))}
    </Flex>
  );
};
