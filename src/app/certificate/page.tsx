import addressMap from '@/lib/addressMap';
import { getCurrentUser } from '@/lib/auth';
import { Donor, getDonations } from '@/lib/data';
import CertificateClient from './certificate-client';

export default async function CertificatePage() {
   try {
      const currentUser = await getCurrentUser();
      const { donors } = await getDonations();
      let userDonation: Donor | undefined | null = null;
      if (currentUser) {
         userDonation = donors.find((donor) => {
            const foundAddress = Object.entries(addressMap).find(
               ([_, info]) => info.mezonId === currentUser.user_id
            );
            return foundAddress && donor.Sender === foundAddress[0];
         });
         if (
            userDonation &&
            userDonation.UserName &&
            currentUser.display_name
         ) {
            userDonation.UserName = currentUser.display_name;
         }
      }

      return <CertificateClient userDonation={userDonation || null} />;
   } catch (error) {
      console.error('Error loading certificate data:', error);
      return <CertificateClient userDonation={null} />;
   }
}
