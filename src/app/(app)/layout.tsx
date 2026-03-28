export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-3 py-3 sm:px-4 sm:py-4">
      {children}
    </div>
  );
}
