import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
