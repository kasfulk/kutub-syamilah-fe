import "./globals.css";

export const metadata = {
  title: "Kutub Syamilah | المكتبة الشاملة",
  description: "A digital library for Arabic scholarly works",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}