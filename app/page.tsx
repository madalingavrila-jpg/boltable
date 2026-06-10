import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardShell } from "@/components/DashboardShell";

export default function Home() {
  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="ml-[280px] mt-16 p-lg">
        <DashboardShell />
      </main>
    </>
  );
}
