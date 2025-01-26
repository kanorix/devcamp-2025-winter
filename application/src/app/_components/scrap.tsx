"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import styles from "../index.module.css";

export function LatestScrap() {
  const [latestScrap] = api.scrap.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [content, setContent] = useState("");
  const createScrap = api.scrap.create.useMutation({
    onSuccess: async () => {
      await utils.scrap.invalidate();
      setContent("");
    },
  });

  return (
    <div className={styles.showcaseContainer}>
      {latestScrap ? (
        <p className={styles.showcaseText}>
          Your most recent scrap: {latestScrap.content}
        </p>
      ) : (
        <p className={styles.showcaseText}>You have no scraps yet.</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createScrap.mutate({ content });
        }}
        className={styles.form}
      >
        <input
          type="text"
          placeholder="Title"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={createScrap.isPending}
        >
          {createScrap.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
