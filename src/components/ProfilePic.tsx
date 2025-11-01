import { FaUser } from 'react-icons/fa';

export default function ProfilePic() {
  return (
    <div className='rounded-full p-2 border border-neutral-500 bg-white shadow-md text-primary-900'>
      <FaUser size={24} />
      {/* <PiStudentBold size={ 48} /> */}
    </div>
  );
}
