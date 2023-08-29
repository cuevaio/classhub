export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="app">{children}</div>
  );
}
