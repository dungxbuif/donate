import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const user = await getCurrentUser();

      if (!user) {
         return NextResponse.json({ user: null });
      }

      return NextResponse.json({
         user: {
            user_id: user.user_id,
            username: user.username,
            avatar: user.avatar,
         },
      });
   } catch (error) {
      console.error('Error getting user:', error);
      return NextResponse.json({ user: null });
   }
}
