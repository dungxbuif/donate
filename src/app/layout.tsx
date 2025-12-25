import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Donation App',
   description: 'Donation Application',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body>{children}</body>
      </html>
   );
}
