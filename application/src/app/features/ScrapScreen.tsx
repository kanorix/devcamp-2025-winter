"use client";

import { Box, Center, Flex, Loader } from "@mantine/core";
import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { ScrapInput } from "./ScrapInput";
import { ScrapList } from "./ScrapList";

const ScrapScreen = () => {
  const {
    data: scraps,
    isLoading,
    isRefetching,
    refetch,
  } = api.scrap.findAll.useQuery({ limit: 10 });

  const handleRefetch = async () => {
    await refetch();
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // スクロール処理
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // データが更新されたらスクロール
  useEffect(() => {
    if (!isRefetching && !isLoading) {
      scrollToBottom();
    }
  }, [isRefetching, isLoading]);

  return (
    <Flex direction="column" h="100dvh" style={{ paddingBottom: "16px" }}>
      {/* 入力フォーム */}
      <Box style={{ flexGrow: 1, overflowY: "auto" }} p="md" ref={scrollRef}>
        <ScrapList scraps={scraps ?? []} refetch={handleRefetch} />
      </Box>

      {/* スクラップ一覧 */}
      {isRefetching && (
        <Center>
          <Loader type="dots" />
        </Center>
      )}
      <Box style={{ flexShrink: 0 }}>
        <ScrapInput refetch={handleRefetch} />
      </Box>
    </Flex>
  );
};

export default ScrapScreen;
