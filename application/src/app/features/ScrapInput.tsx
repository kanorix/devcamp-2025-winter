"use client";

import { ActionIcon, Flex, Paper, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "~/trpc/react";

type Props = {
  refetch: () => Promise<void>;
};

export const ScrapInput = ({ refetch }: Props) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createScrap = api.scrap.create.useMutation();

  const handleCreateScrap = async () => {
    if (content.trim() === "") return;
    setIsLoading(true);
    await createScrap.mutateAsync({ content });
    await refetch();
    setContent("");
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // MacのCommand+Enter または WindowsのCtrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault(); // デフォルトの改行を防ぐ
      void handleCreateScrap();
    }
  };

  return (
    <Paper shadow="xs" p="md">
      <Flex gap="sm" align="end">
        <Textarea
          style={{ flexGrow: 1 }}
          placeholder="なんでも書き留めてください... (⌘ + Enter で送信)"
          autosize
          minRows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <ActionIcon
          size="md"
          onClick={handleCreateScrap}
          disabled={content.length === 0 || isLoading}
          loading={isLoading}
        >
          <IconSend />
        </ActionIcon>
      </Flex>
    </Paper>
  );
};
