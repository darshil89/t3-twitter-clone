import { api } from "~/utils/api";
import { CreateTweets } from "./CreateTweets";

export function Timeline() {
  const { data } = api.tweets.timeline.useQuery({});
  return (
    <div>
      <CreateTweets />
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
