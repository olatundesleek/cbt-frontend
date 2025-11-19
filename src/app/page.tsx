import Login from "@/features/dashboard/components/Login";
import GlobalProviders from '@/components/GlobalProviders';

export default function Page() {
  return (
    <GlobalProviders>
      <Login />
    </GlobalProviders>
  );
}
