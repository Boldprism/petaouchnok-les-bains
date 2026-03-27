import BottomNav from '@/components/ui/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-dvh max-w-[430px] mx-auto bg-bg-nuit">
      <main className="flex-1 overflow-hidden">{children}</main>
      <BottomNav />
    </div>
  );
}
