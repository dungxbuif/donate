'use client';

import { UserInfoData } from '@/app/auth/callback/route';
import { Button } from '@/components/ui/button';

interface LoginButtonProps {
   user: UserInfoData | null;
}

export default function LoginButton({ user }: LoginButtonProps) {
   const handleLogin = () => {
      const params = new URLSearchParams({
         client_id: process.env.NEXT_PUBLIC_APP_ID!,
         redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
         response_type: 'code',
         scope: 'openid offline',
         state: crypto.randomUUID().substring(0, 10),
      });

      const oauthUrl = `${process.env
         .NEXT_PUBLIC_OAUTH_URL!}/oauth2/auth?${params.toString()}`;
      window.location.href = oauthUrl;
   };
   if (user) {
      return (
         <div className="flex items-center gap-4  from-gray-900/80 to-black/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gold/30 shadow-xl animate-in fade-in slide-in-from-right duration-500">
            <img
               src={
                  user.avatar ||
                  `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`
               }
               alt="User Avatar"
               className="w-12 h-12 rounded-full border-3 border-gold shadow-lg ring-2 ring-gold/50"
            />
            <div className="flex flex-col">
               <span className="text-white font-bold text-lg">
                  {user.display_name || user.username}
               </span>
            </div>
         </div>
      );
   }

   return (
      <Button
         variant="outline"
         size="sm"
         className="gap-2 bg-transparent"
         onClick={handleLogin}
      >
         Đăng nhập với Mezon
      </Button>
   );
}
