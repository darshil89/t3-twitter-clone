import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Timeline } from "~/components/Tmeline";

import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Twitter</title>
        <meta name="description" content="Build my Darshil" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <br />

      <Timeline />
    </>
  );
}
