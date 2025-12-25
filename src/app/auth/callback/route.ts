import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

interface ExchangeCodeData {
   access_token: string;
   expires_in: number;
   scope: string;
   token_type: string;
}

export interface UserInfoData {
   aud: string[];
   auth_time: number;
   avatar: string;
   display_name: string;
   email: string;
   iat: number;
   iss: string;
   mezon_id: string;
   rat: number;
   sub: string;
   user_id: string;
   username: string;
}

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const code = searchParams.get('code');
   const state = searchParams.get('state');

   if (!code) {
      console.error('[OAuth Callback] No code in searchParams:', {
         code,
         state,
      });
      redirect('/leaderboard?error=no_code');
   }

   try {
      // Exchange code for access token
      console.log('[OAuth Callback] Exchanging code for token:', {
         code,
         state,
      });
      console.log('[OAuth Callback] ENV:', {
         OAUTH_URL: process.env.OAUTH_URL,
         APP_ID: process.env.APP_ID,
         SECRET: process.env.SECRET,
         REDIRECT_URL: process.env.REDIRECT_URL,
      });
      const tokenRes = await fetch(`${process.env.OAUTH_URL}/oauth2/token`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code!,
            state: state || '',
            client_id: process.env.APP_ID!,
            client_secret: process.env.SECRET!,
            redirect_uri: process.env.REDIRECT_URL!,
            scope: 'openid offline',
         }),
      });

      if (!tokenRes.ok) {
         const errText = await tokenRes.text();
         console.error('[OAuth Callback] Token exchange failed:', errText);
         redirect('/leaderboard?error=token_exchange_failed');
      }

      const tokenData: ExchangeCodeData = await tokenRes.json();
      console.log('[OAuth Callback] Token data:', tokenData);

      // Get user info
      const userRes = await fetch(`${process.env.OAUTH_URL}/userinfo`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: new URLSearchParams({
            access_token: encodeURIComponent(tokenData.access_token),
            client_id: process.env.APP_ID!,
            client_secret: process.env.SECRET!,
            redirect_uri: process.env.REDIRECT_URL!,
         }),
      });

      if (!userRes.ok) {
         const errText = await userRes.text();
         console.error('[OAuth Callback] User info failed:', errText);
         redirect('/leaderboard?error=user_info_failed');
      }

      const user: UserInfoData = await userRes.json();
      console.log('[OAuth Callback] User data:', user);
      // Create encrypted session with user data
      await createSession(user);

      console.log(
         '[OAuth Callback] Session created successfully, redirecting to /leaderboard'
      );
      redirect('/leaderboard?auth=success');
   } catch (error) {
      // Don't catch redirect errors - they're normal in Next.js
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
         throw error;
      }
      console.error('[OAuth Callback] Exception:', error);
      redirect('/leaderboard?error=auth_failed');
   }
}
