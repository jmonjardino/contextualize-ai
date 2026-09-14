import { CaptureProvider } from "@/components/workspace/capture-provider";
import { MobileHeader, MobileTabs } from "@/components/workspace/mobile-chrome";
import { Sidebar } from "@/components/workspace/sidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <CaptureProvider>
      <div className="flex h-dvh overflow-hidden bg-paper">
        <Sidebar />
        <div className="flex min-w-0 grow flex-col">
          <MobileHeader />
          <main className="flex min-h-0 grow flex-col">{children}</main>
          <MobileTabs />
        </div>
      </div>
    </CaptureProvider>
  );
}
