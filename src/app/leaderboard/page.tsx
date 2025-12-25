import Leaderboard from '@/components/Leaderboard';
import { getDonations } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
   const { donors, totalAmount } = await getDonations();

   return <Leaderboard donors={donors} totalAmount={totalAmount} />;
}
