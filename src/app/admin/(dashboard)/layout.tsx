"use client";

import AdminSidebar from "@/components/sidebar";
import AdminTopBar from "@/components/topbar";
import { useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative flex flex-row items-stretch min-h-screen bg-primary-50 max-w-400 w-full mx-auto">
      {/*side bar */}
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="relative flex-1 flex flex-col gap-4 w-full">
        <AdminTopBar setIsOpen={setIsOpen} />

        <div className="flex-1 w-full p-4">{children}</div>

        <div className="flex items-center justify-center w-full">
          <small>Florintech CBT Portal &#9400; {currentYear}</small>
        </div>
      </section>
    </main>
  );
}
