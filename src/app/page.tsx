import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { PublicBoard } from "~/components/public-board/public-board";
import { SITE_URL } from "~/lib/constants";
import { Hero } from "../components/landing/hero";
import { Features } from "../components/landing/bento";
import { Footer } from "../components/landing/footer";
import { Header } from "~/components/landing/header";

export default async function Home() {
  noStore();

  const headersList = headers();
  const hostName = headersList.get("x-hostname") ?? "";
  const isSubdomain = hostName.split(".").length > 2;
  const firstPartOfHostName = hostName.split(".")[0];

  if (
    firstPartOfHostName &&
    isSubdomain &&
    process.env.VERCEL_ENV === "production"
  ) {
    const [boardData, initialSuggestions] = await Promise.all([
      api.boards.getBoardData.query({
        slug: firstPartOfHostName,
      }),
      api.suggestions.get.query({
        slug: firstPartOfHostName,
        page: 0,
      }),
    ]);

    return (
      <PublicBoard
        initialSuggestions={initialSuggestions}
        board={boardData.board}
        isPreview={false}
        themeCSS={boardData.board?.themeCSS ?? ""}
      />
    );
  }

  if (isSubdomain && process.env.VERCEL_ENV === "production") {
    redirect(SITE_URL);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
