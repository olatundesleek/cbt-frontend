import { BiLoaderAlt } from 'react-icons/bi';

export default function SpinnerMini({
  color = 'text-white',
}: {
  color?: string;
}) {
  return <BiLoaderAlt className={`w-5 h-5 animate-spin ${color}`} />;
}
