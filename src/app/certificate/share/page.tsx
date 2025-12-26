import { decrypt } from '@/lib/session';
import { notFound } from 'next/navigation';
import CertificateClient from '../certificate-client';

interface SharedCertificateData {
   donorName: string;
   amount: string;
   sender: string;
   organizationName: string;
}

interface SharePageProps {
   searchParams: Promise<{ token?: string }>;
}

export default async function SharePage({ searchParams }: SharePageProps) {
   const { token } = await searchParams;

   if (!token) {
      console.log('[SharePage] No token provided');
      notFound();
   }

   console.log(
      '[SharePage] Attempting to decrypt token:',
      token.substring(0, 50) + '...'
   );

   const certificateData = (await decrypt(
      token
   )) as SharedCertificateData | null;

   console.log('[SharePage] Decryption result:', certificateData);

   if (!certificateData) {
      console.log('[SharePage] Decryption failed or returned null');
      notFound();
   }

   const mockDonation = {
      Sender: certificateData.sender,
      UserName: certificateData.donorName,
      Avatar: '',
      Amount: certificateData.amount,
      AmountNum: parseInt(
         certificateData.amount.replace(' VNĐ', '').replace(/\./g, '')
      ),
      Note: 'Shared certificate',
      transactions: [],
   };

   return <CertificateClient userDonation={mockDonation} />;
}
