import { useState } from "react";
import { api } from "../utils/api";
import { z } from "zod";

export const TweetSchema = z.object({
  text: z
    .string({
      required_error: "Please enter a valid tweet",
    })
    .min(1)
    .max(280),
});

export function CreateTweets() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync } = api.tweets.create.useMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await TweetSchema.parse({ text });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.message);
        return;
      }
    }

    mutateAsync({
      text,
    });
  }

  return (
    <>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}
      className="mb-4 flex w-full flex-col rounded  p-4">
        <textarea className="w-full p-4 shadow" onChange={(e) => setText(e.target.value)} value={text} />
        <div className="mt-4 flex justify-end">
          <button className="bg-primary rounded-md px-4 py-2 text-white" type="submit">Tweet</button>
        </div>
      </form>
    </>
  );
}
