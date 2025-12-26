import { getOAuthUrl } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function GET() {
   try {
      const oauthUrl = getOAuthUrl();
      redirect(oauthUrl);
   } catch (error) {
      // NEXT_REDIRECT is expected behavior for redirects in Next.js
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
         throw error; // Re-throw to allow Next.js to handle the redirect
      }

      console.error('[Login API] Unexpected error during login:', error);
      redirect('/leaderboard?error=login_failed');
   }
}
