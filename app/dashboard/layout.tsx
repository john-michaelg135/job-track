import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <DashboardNav email={user.email ?? ""} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
