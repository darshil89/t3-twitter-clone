import { RouterOutputs, api } from "~/utils/api";
import { CreateTweets } from "./CreateTweets";
import Image from "next/image";
import Tweet from "./Tweet";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winscroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (winscroll / height) * 100;

    setScrollPosition(scrolled);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}

export function Timeline() {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweets.timeline.useInfiniteQuery(
      {
        limit: 9,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextcursor,
      },
    );

  const scrollPosition = useScrollPosition();

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  const client = useQueryClient();

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching]);
  return (
    <div>
      <CreateTweets />
      <div className=" border-l-2 border-r-2 border-t-2 border-gray-500">
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} tweet={tweet} client={client}/>;
        })}

        {isFetching && (
          <div className="flex justify-center ">
            <p className="text-gray-400 text-xl mb-4">Loading...</p>
          </div>
        )}

        {!hasNextPage && (
          <div className="flex justify-center ">
            <p className="text-gray-400 text-xl mb-4">No more tweets</p>
          </div>
        )}

        {/* <button onClick={() => fetchNextPage()} disabled={isFetching}>
          {isFetching
            ? "Loading..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button> */}
      </div>
    </div>
  );
}
