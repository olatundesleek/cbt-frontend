import ProfilePic from "@/features/profile/components/ProfilePic";
import { Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useUserStore } from "@/store/useUserStore";

interface AdminTopBarProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AdminTopBar = ({ setIsOpen }: AdminTopBarProps) => {
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
        <input
          id='search'
          type='text'
          autoFocus
          placeholder='Search'
          className='block w-full rounded-md border border-neutral-300 p-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
        />

        <div className='hidden sm:block'>
          <ProfilePic />
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
