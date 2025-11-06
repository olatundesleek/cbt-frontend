import Logo from '@/components/layout/Logo';
import Timer from './Timer';

export default function TestAttemptHeader() {
  return (
    <header className='flex justify-between items-center px-6 py-3 bg-white border-b border-neutral-200'>
      <Logo />
      <div className='flex items-center gap-4'>
        <Timer />
        <span className='font-medium'>John Doe</span>
      </div>
    </header>
  );
}
