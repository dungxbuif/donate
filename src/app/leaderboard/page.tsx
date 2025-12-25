import Leaderboard from '@/components/Leaderboard';
import { getCurrentUser } from '@/lib/auth';
import { getDonations } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
   const { donors, totalAmount } = await getDonations();
   const user = await getCurrentUser();

   return <Leaderboard donors={donors} totalAmount={totalAmount} user={user} />;
}
