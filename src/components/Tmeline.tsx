import { RouterOutputs, api } from "~/utils/api";
import { CreateTweets } from "./CreateTweets";
import Image from "next/image";
import Tweet from "./Tweet";

export function Timeline() {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweets.timeline.useInfiniteQuery(
      {
        limit: 3,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextcursor,
      },
    );

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  console.log("data", data);

  console.log("tweets", tweets);
  return (
    <div>
      <CreateTweets />
      <div className=" border-l-2 border-r-2 border-t-2 border-gray-500">
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} tweet={tweet} />;
        })}

        <button
          onClick={() => fetchNextPage()}
          disabled={isFetching}
        >
          {isFetching
            ? "Loading..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
}
