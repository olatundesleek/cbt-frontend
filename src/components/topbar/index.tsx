import ProfilePic from "@/features/profile/components/ProfilePic";
import { Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useUserStore } from "@/store/useUserStore";

interface AdminTopBarProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  role: 'admin' | 'teacher' | 'student';
}

const AdminTopBar = ({ setIsOpen, role }: AdminTopBarProps) => {
  const { firstname, lastname } = useUserStore();

  const handleToggleSideBar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className='sticky top-0 flex flex-row items-center justify-between w-full p-4 h-full max-h-15 bg-primary-50 border-b border-b-neutral-300 z-50'>
      <span className='text-sm text-neutral-500'>
        Hi, {firstname} {lastname}
      </span>

      <div className='flex flex-row items-center gap-2'>
        <div className='hidden sm:block'>
          <ProfilePic role={role} />
        </div>

        <div className='block md:hidden'>
          <Button onClick={handleToggleSideBar}>
            <RxHamburgerMenu />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
