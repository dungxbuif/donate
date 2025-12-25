import { UserInfoData } from '@/app/auth/callback/route';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export function getOAuthUrl(): string {
   const params = new URLSearchParams({
      client_id: process.env.APP_ID!,
      redirect_uri: process.env.REDIRECT_URL!,
      response_type: 'code',
      scope: 'openid offline',
      state: crypto.randomUUID().substring(0, 10),
   });

   return `${process.env.OAUTH_URL}/oauth2/auth?${params.toString()}`;
}

export async function getCurrentUser(): Promise<UserInfoData | null> {
   try {
      const cookieStore = await cookies();
      const session = cookieStore.get('session')?.value;
      console.log(
         '[getCurrentUser] Session cookie:',
         session ? 'Found' : 'Not found'
      );

      if (!session) {
         return null;
      }

      const payload = await decrypt(session);
      console.log('[getCurrentUser] Decrypted payload:', payload);

      if (!payload || !payload.user_id) {
         console.log('[getCurrentUser] Invalid payload or missing user_id');
         return null;
      }
      return (payload as UserInfoData) || null;
   } catch (error) {
      console.error('Error getting current user:', error);
      return null;
   }
}
