import Link from "next/link";

import { LatestTODO } from "~/app/_components/todo";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

// server-side rendering
export default async function Home() {
  const hello = await api.todo.hello({ text: "by tRPC" });
  const session = await getServerAuthSession();
  void api.todo.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl ">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center">
                {session && <span>Logged in as {session.user?.name} ({session.user?.email})</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestTODO />}
        </div>
      </main>
    </HydrateClient>
  );
}
