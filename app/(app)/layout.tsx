import { DemoBar } from "@/components/DemoBar";
import { AppShell } from "@/components/Sidebar";
import { getTasks, getUser } from "@/lib/data";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();
  let pending = 0;
  try {
    const { tasks, submittedIds } = await getTasks();
    pending = tasks.filter((t) => !submittedIds.has(t.id)).length;
  } catch {
    // El contador no es crítico; la página mostrará su propio error.
  }

  return (
    <>
      <DemoBar />
      <AppShell name={user.name} initials={user.initials} pendingCount={pending}>
        {children}
      </AppShell>
    </>
  );
}
