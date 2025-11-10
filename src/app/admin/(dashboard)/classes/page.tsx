"use client";

import React, { ReactNode } from "react";
import { GoPlus } from "react-icons/go";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { FaUser } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";
import { LuBuilding2 } from "react-icons/lu";
import AppTable, { TableDataItem } from "@/components/table";
import { useRouter } from "next/navigation";
import { useGetClasses } from "@/features/dashboard/queries/useDashboard";
import { errorLogger } from "@/lib/axios";

const quickStats: { icon: ReactNode; label: string; count: string }[] = [
  { icon: <FaUser color="#0284c7" />, label: "Total Classes", count: "12" },
  {
    icon: <HiUserGroup color="#0284c7" />,
    label: "Total Students",
    count: "1,344",
  },
  { icon: <LuBuilding2 color="#0284c7" />, label: "Departments", count: "6" },
];

const classes: {
  class: string;
  department: string;
  level: string;
  student: string;
  created: string;
}[] = [
  {
    class: "ND1 Computer",
    department: "CS",
    level: "ND1",
    student: "90",
    created: "Oct 5, 2025",
  },
  {
    class: "ND2 Computer",
    department: "CS",
    level: "ND2",
    student: "100",
    created: "Oct 15, 2025",
  },
];

const headerColumns = [
  "Class Name",
  "Department",
  "Level",
  "Total Students",
  "Created On",
];

const AdminClasses = () => {
  const {
    data: allClasses,
    isLoading: classesLoading,
    error: classesError,
  } = useGetClasses();
  const { push } = useRouter();

  console.log({ allClasses });

  if (classesError) {
    return errorLogger(classesError);
  }

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">Manage Classes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <div className="flex flex-col md:flex-row flex-wrap items-stretch gap-3 min-h-8 w-full">
            <div className="flex-1">
              <Input />
            </div>

            <div>
              <Button disabled={classesLoading}>
                <div className="flex flex-row items-center gap-2 w-full">
                  <GoPlus />
                  <span>Create New Class</span>
                </div>
              </Button>
            </div>
          </div>

          <AppTable
            data={classes}
            isLoading={classesLoading}
            headerColumns={headerColumns}
            itemKey={({ itemIndex }) => `${itemIndex}`}
            onRowPress={({ item }) => push(`/admin/classes/${item.class}`)}
            renderItem={({ item }) => (
              <>
                <TableDataItem>{item.class}</TableDataItem>
                <TableDataItem>{item.department}</TableDataItem>
                <TableDataItem>{item.level}</TableDataItem>
                <TableDataItem>{item.student}</TableDataItem>
                <TableDataItem>{item.created}</TableDataItem>
              </>
            )}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <div className="py-2 border-b border-b-neutral-500">
            <span>Quick Stats</span>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 w-full">
                <div className="flex flex-row items-center gap-2">
                  <>{stat.icon}</>
                  <span className="text-sm text-neutral-600">{stat.label}</span>
                </div>
                <span className="text-base font-medium">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminClasses;
