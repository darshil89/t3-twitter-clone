import dayjs from "dayjs";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { AiFillHeart } from "react-icons/ai";
import { RouterOutputs, api } from "~/utils/api";
import { InfiniteData, QueryClient } from "@tanstack/react-query";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%d hours",
    d: "1d",
    dd: "%dh",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

function updateCache({
  client,
  data,
  variables,
  action,
}: {
  client: QueryClient;
  variables: { tweetId: string };
  data: any;
  action: "like" | "unlike";
}) {
  client.setQueryData(
    [
      ["tweets", "timeline"],
      {
        input: {
          limit: 10,
        },
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<
        RouterOutputs["tweets"]["timeline"]
      >;

      const newTweets = newData?.pages?.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                likes: action === "like" ? [data.userId] : [],
              };
            }
            return tweet;
          }),
        };
      });

      return {
        ...newData,
        pages: newTweets,
      };
    },
  );
}

export default function Tweet({
  tweet,
  client,
}: {
  tweet: any;
  client: QueryClient;
}) {
  const likeMutation = api.tweets.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "like" });
    },
  }).mutateAsync;
  const unlikeMutation = api.tweets.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "unlike" });
    },
  }).mutateAsync;

  console.log(tweet);
  const hasLIked = tweet.likes?.length > 0;

  return (
    <div className="mb-4 border-b-2 border-gray-500">
      <div className="flex p-2">
        {tweet.author.image && (
          <Image
            width={48}
            height={48}
            src={tweet.author.image}
            alt="Profile picture"
            className="rounded-full"
          />
        )}
        <div className="ml-2">
          <div className="align-center flex">
            <p className="font-bold">{tweet.author.name}</p>
            <p className="text-sm text-gray-400">
              {" "}
              - {dayjs(tweet.createdAt).fromNow()}
            </p>
          </div>
          <div>{tweet.text} </div>
        </div>
      </div>

      <div className="mt-3 flex flex-row items-center p-2">
        <AiFillHeart
          color={hasLIked ? "red" : "gray"}
          size="1.5rem"
          onClick={() => {
            if (hasLIked) {
              unlikeMutation({ tweetId: tweet.id });
              return;
            }

            likeMutation({ tweetId: tweet.id });
          }}
        />
      </div>
    </div>
  );
}
