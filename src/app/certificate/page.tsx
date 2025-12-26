import addressMap from '@/lib/addressMap';
import { getCurrentUser } from '@/lib/auth';
import { getDonations } from '@/lib/data';
import CertificateClient from './certificate-client';

export default async function CertificatePage() {
   try {
      // Get current user from session (server-side)
      const currentUser = await getCurrentUser();

      // Get donations data (server-side)
      const { donors } = await getDonations();

      // Find user's donation if user exists
      let userDonation = null;
      if (currentUser) {
         userDonation = donors.find((donor) => {
            // Check if any address in addressMap matches the current user_id
            const foundAddress = Object.entries(addressMap).find(
               ([_, info]) => info.mezonId === currentUser.user_id
            );
            return foundAddress && donor.Sender === foundAddress[0];
         });
      }

      // Pass data as props to client component
      return (
         <CertificateClient
            currentUser={currentUser}
            userDonation={userDonation || null}
         />
      );
   } catch (error) {
      console.error('Error loading certificate data:', error);
      return <CertificateClient currentUser={null} userDonation={null} />;
   }
}
