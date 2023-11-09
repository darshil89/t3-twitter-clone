import dayjs from "dayjs";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { AiFillHeart } from "react-icons/ai";
import { api } from "~/utils/api";
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

export default function Tweet({ tweet }: any) {
  const likeMutation = api.tweets.like.useMutation().mutateAsync;
  const unlikeMutation = api.tweets.unlike.useMutation().mutateAsync;

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
        <span className="text-sm text-gray-500">10</span>
      </div>
    </div>
  );
}
