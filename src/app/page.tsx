import { unstable_noStore as noStore } from "next/cache";
import { getProviders } from "next-auth/react";
import { AuthForm } from "./_components/auth/auth-form";
import { headers } from "next/headers";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  noStore();

  const headersList = headers();
  const hostName = headersList.get("x-hostname") ?? "";
  const isSubdomain = hostName.split(".").length > 2;

  if (isSubdomain) {
    return (
      <main className="grid min-h-screen place-content-center">
        <section className="mb-8">
          <h1 className="text-center text-3xl font-bold">
            This board does not exist
          </h1>
        </section>
      </main>
    );
  }

  const providers = await getProviders();
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-content-center">
      <section className="mb-8">
        <h1 className="text-center text-3xl font-bold">Feedback Board</h1>
      </section>

      <AuthForm providers={providers} />
    </main>
  );
}
