import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { GiGraduateCap, GiTeacher } from "react-icons/gi";
import { IoIosSettings } from "react-icons/io";
import { MdOutlineClose, MdSubject } from "react-icons/md";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../ui/Button";
import SpinnerMini from "../ui/SpinnerMini";
import useLogout from "@/hooks/useLogout";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const adminRoutes: { path: string; label: string; icon: ReactNode }[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: <AiFillHome size={20} />,
  },
  {
    path: "/admin/classes",
    label: "Classes",
    icon: <GiGraduateCap size={20} />,
  },
  {
    path: "/admin/teachers",
    label: "Teachers",
    icon: <GiTeacher size={20} />,
  },
  {
    path: "/admin/courses",
    label: "Courses",
    icon: <MdSubject size={20} />,
  },
  {
    path: "/admin/questions",
    label: "Question Bank",
    icon: <BsFillQuestionCircleFill size={20} />,
  },
  {
    path: "/admin/settings",
    label: "System Settings",
    icon: <IoIosSettings size={20} />,
  },
];

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const [isPrefetched, setIsPrefetched] = useState<boolean>(false);
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();

  const handleCloseSidebar = () => setIsOpen(false);

  return (
    <>
      {/* desktop view */}
      <section className="hidden md:block w-full max-w-70 max-h-screen sticky top-0 overflow-y-auto">
        <aside className="flex flex-col gap-12 w-full justify-between bg-primary-700 h-full p-4">
          <div className="flex flex-col gap-12 w-full">
            <h1 className="text-4xl text-white font-bold">Florintech</h1>

            <nav className="w-full">
              <ul className="flex flex-col gap-4 w-full">
                {adminRoutes.map((route) => {
                  const isActive = route.path === pathname;

                  return (
                    <li key={route.path}>
                      <Link
                        href={route.path}
                        prefetch={isPrefetched ? null : false}
                        onMouseEnter={() => setIsPrefetched(true)}
                        className={`flex flex-row items-center gap-4 text-base  font-normal ${
                          isActive ? "text-white" : "text-neutral-300"
                        }`}
                      >
                        <>{route.icon}</>
                        {route.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <Button onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <>
                <span className=" mr-2">Logging Out</span>
                <SpinnerMini />
              </>
            ) : (
              "Logout"
            )}
          </Button>
        </aside>
      </section>

      {/* mobile view */}
      <div className="block md:hidden min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary-700 text-white p-4 transition-transform duration-300 flex flex-col gap-12 justify-between ease-in-out lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }
        `}
        >
          <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-row items-center justify-between mb-6">
              <h1 className="text-xl font-bold">Florintech</h1>
              <button
                aria-label="closeSidebar"
                onClick={handleCloseSidebar}
                className="cursor-pointer"
              >
                <MdOutlineClose />
              </button>
            </div>

            <nav className="w-full">
              <ul className="flex flex-col gap-4 w-full">
                {adminRoutes.map((route) => {
                  const isActive = route.path === pathname;

                  return (
                    <li key={route.path}>
                      <Link
                        href={route.path}
                        prefetch={isPrefetched ? null : false}
                        onMouseEnter={() => setIsPrefetched(true)}
                        onClick={handleCloseSidebar}
                        className={`flex flex-row items-center gap-4 text-base  font-normal ${
                          isActive ? "text-white" : "text-neutral-300"
                        }`}
                      >
                        <>{route.icon}</>
                        {route.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <Button onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <>
                <span className=" mr-2">Logging Out</span>
                <SpinnerMini />
              </>
            ) : (
              "Logout"
            )}
          </Button>
        </aside>

        {/* overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={handleCloseSidebar}
          />
        )}
      </div>
    </>
  );
};

export default AdminSidebar;
