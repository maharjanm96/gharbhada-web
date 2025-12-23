import { TenantSidebar } from "@/components/tenant-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TenantSidebar />
      <main className="flex-1 w-full">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <SidebarTrigger />
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
