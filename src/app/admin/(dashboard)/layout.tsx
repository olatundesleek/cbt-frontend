"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/sidebar";
import AdminTopBar from "@/components/topbar";
import useDashboard from "@/features/dashboard/queries/useDashboard";
import { errorLogger } from "@/lib/axios";
import { useUserStore } from "@/store/useUserStore";
import { SpinnerMini } from "@/components/ui";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setName } = useUserStore();
  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error: dashboardDataError,
  } = useDashboard();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!dashboardData) return;

    const adminName = dashboardData.data.adminName;

    setName(adminName);
  }, [dashboardData, setName]);

  if (dashboardDataError) {
    errorLogger(dashboardDataError);
  }

  return (
    <main className="relative flex flex-row items-stretch min-h-screen bg-primary-50 max-w-400 w-full mx-auto">
      {/*side bar */}
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {isDashboardDataLoading ? (
        <div className="w-full p-4">
          <SpinnerMini color="#0c4a6e" />
        </div>
      ) : (
        <section className="relative flex-1 flex flex-col gap-4 w-full">
          <AdminTopBar setIsOpen={setIsOpen} />

          <div className="flex-1 w-full p-4">{children}</div>

          <div className="flex items-center justify-center w-full">
            <small>Florintech CBT Portal &#9400; {currentYear}</small>
          </div>
        </section>
      )}
    </main>
  );
}
