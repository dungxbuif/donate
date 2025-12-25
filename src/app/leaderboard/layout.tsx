import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'Donation Leaderboard',
   description: 'Donation Leaderboard',
};

export default function LeaderboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <head>
            <script src="https://unpkg.com/@phosphor-icons/web"></script>
         </head>
         <body className={rubik.className}>{children}</body>
      </html>
   );
}
