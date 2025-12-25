import { UserInfoData } from '@/app/auth/callback/route';
import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import 'server-only';

const secretKey = process.env.SESSION_SECRET;

export async function encrypt(payload: UserInfoData): Promise<string> {
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
   return session;
}

export async function decrypt(session: string | undefined = '') {
   try {
      if (!session) {
         console.log('[decrypt] No session string provided');
         return null;
      }

      const decoded = Buffer.from(session, 'base64').toString('utf-8');
      // Find the last two dots to split correctly, as JSON data might contain dots
      const lastDotIndex = decoded.lastIndexOf('.');
      const secondLastDotIndex = decoded.lastIndexOf('.', lastDotIndex - 1);

      if (lastDotIndex === -1 || secondLastDotIndex === -1) {
         console.log('[decrypt] Invalid session format');
         return null;
      }

      const data = decoded.substring(0, secondLastDotIndex);
      const timestamp = decoded.substring(secondLastDotIndex + 1, lastDotIndex);
      const signature = decoded.substring(lastDotIndex + 1);

      // Verify signature
      const expectedSignature = createHmac('sha256', secretKey!)
         .update(data + '.' + timestamp)
         .digest('hex');

      if (signature !== expectedSignature) {
         console.log('[decrypt] Signature mismatch');
         console.log('[decrypt] Expected:', expectedSignature);
         console.log('[decrypt] Received:', signature);
         console.log('[decrypt] Data:', data);
         console.log('[decrypt] Timestamp:', timestamp);
         console.log('[decrypt] SecretKey exists:', !!secretKey);
         return null;
      }

      // Check expiration
      const sessionTime = parseInt(timestamp);
      const expirationTime = sessionTime + 7 * 24 * 60 * 60 * 1000; // 7 days

      if (Date.now() > expirationTime) {
         console.log('[decrypt] Session expired');
         return null;
      }

      return JSON.parse(data);
   } catch (error) {
      console.log('Failed to verify session', error);
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

export async function updateSession() {
   const cookieStore = await cookies();
   const session = cookieStore.get('session')?.value;
   const payload = await decrypt(session);

   if (!session || !payload) {
      return null;
   }

   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

   cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax',
      path: '/',
   });
}

export async function deleteSession() {
   const cookieStore = await cookies();
   cookieStore.delete('session');
}
