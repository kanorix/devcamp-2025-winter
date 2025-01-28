"use client";

import { ActionIcon, Flex, Paper } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "~/trpc/react";

import { RichTextEditor } from "@mantine/tiptap";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  refetch: () => Promise<void>;
};

export const ScrapInput = ({ refetch }: Props) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createScrap = api.scrap.create.useMutation();

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor?.getJSON() ?? {}));
    },
  });

  const handleCreateScrap = async () => {
    if (content.trim() === "") return;
    setIsLoading(true);
    await createScrap.mutateAsync({ content });
    await refetch();

    // TODO: editorとstateの2重管理になってしまっている
    editor?.commands.setContent("");
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
        {/* <Textarea
          style={{ flexGrow: 1 }}
          placeholder="なんでも書き留めてください... (⌘ + Enter で送信)"
          autosize
          minRows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        /> */}
        <RichTextEditor
          editor={editor}
          variant="subtle"
          style={{ flexGrow: 1 }}
        >
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              {/* <RichTextEditor.ClearFormatting /> */}
              {/* <RichTextEditor.Highlight />
              <RichTextEditor.Code /> */}
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content content={content} />
        </RichTextEditor>

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
