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

   console.log('[OAuth Callback] Token response status:', tokenRes.status);
   console.log(
      '[OAuth Callback] Token response headers:',
      Object.fromEntries(tokenRes.headers.entries())
   );

   if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[OAuth Callback] Token exchange failed:', {
         status: tokenRes.status,
         statusText: tokenRes.statusText,
         error: errText,
      });
      redirect('/leaderboard?error=token_exchange_failed');
   }

   const tokenData: ExchangeCodeData = await tokenRes.json();
   console.log('[OAuth Callback] Token exchange successful:', {
      hasAccessToken: !!tokenData.access_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
   });

   console.log('[OAuth Callback] Starting user info request...');
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

   console.log('[OAuth Callback] User info response status:', userRes.status);
   console.log(
      '[OAuth Callback] User info response headers:',
      Object.fromEntries(userRes.headers.entries())
   );

   if (!userRes.ok) {
      const errText = await userRes.text();
      console.error('[OAuth Callback] User info failed:', {
         status: userRes.status,
         statusText: userRes.statusText,
         error: errText,
      });
      redirect('/leaderboard?error=user_info_failed');
   }

   const user: UserInfoData = await userRes.json();
   console.log('[OAuth Callback] User info received:', {
      user_id: user.user_id,
      username: user.username,
      display_name: user.display_name,
      mezon_id: user.mezon_id,
      email: user.email,
      aud: user.aud,
      iss: user.iss,
   });

   console.log('[OAuth Callback] Creating session...');
   await createSession(user);
   console.log('[OAuth Callback] Session created successfully');

   redirect('/leaderboard?auth=success');
}
