import { UserInfoData } from '@/app/auth/callback/route';
import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import 'server-only';

const secretKey = process.env.SESSION_SECRET;

export async function encrypt(payload: any): Promise<string> {
   console.log('[Session] Encrypting payload:', payload);
   console.log('[Session] Secret key exists:', !!secretKey);

   const data = JSON.stringify(payload);
   const timestamp = Date.now().toString();

   // Create signature using HMAC
   const signature = createHmac('sha256', secretKey!)
      .update(data + '.' + timestamp)
      .digest('hex');

   // Combine data, timestamp, and signature
   const session = Buffer.from(`${data}.${timestamp}.${signature}`).toString(
      'base64'
   );
   console.log(
      '[Session] Encryption successful, session length:',
      session.length
   );
   return session;
}

export async function decrypt(session: string | undefined = '') {
   try {
      if (!session) {
         return null;
      }

      const decoded = Buffer.from(session, 'base64').toString('utf-8');
      // Find the last two dots to split correctly, as JSON data might contain dots
      const lastDotIndex = decoded.lastIndexOf('.');
      const secondLastDotIndex = decoded.lastIndexOf('.', lastDotIndex - 1);

      if (lastDotIndex === -1 || secondLastDotIndex === -1) {
         return null;
      }

      const data = decoded.substring(0, secondLastDotIndex);
      const timestamp = decoded.substring(secondLastDotIndex + 1, lastDotIndex);
      const signature = decoded.substring(lastDotIndex + 1);

      const expectedSignature = createHmac('sha256', secretKey!)
         .update(data + '.' + timestamp)
         .digest('hex');

      if (signature !== expectedSignature) {
         return null;
      }

      const sessionTime = parseInt(timestamp);
      const expirationTime = sessionTime + 7 * 24 * 60 * 60 * 1000; // 7 days

      if (Date.now() > expirationTime) {
         return null;
      }

      return JSON.parse(data);
   } catch (error) {
      return null;
   }
}

export async function createSession(user: UserInfoData) {
   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
   const session = await encrypt(user);
   const cookieStore = await cookies();

   cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
   });
}
