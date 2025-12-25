import addressMap from './addressMap';

export interface Transaction {
   from_address: string;
   value: string;
   transaction_timestamp: number;
   text_data: string;
}

interface ApiResponse {
   data: Transaction[];
}

export interface Donor {
   Sender: string;
   UserName: string;
   Avatar: string;
   Amount: string;
   AmountNum: number;
   Note: string;
}

const BASE_URL = 'https://dong.mezon.ai/indexer-api/1337/transactions';
const params = new URLSearchParams({
   page: '0',
   limit: '100',
   sort_by: 'transaction_timestamp',
   sort_order: 'desc',
   start_time: '2025-12-01',
   wallet_address: 'F6tdkXdK8nb1nMxGc2ZFBB8ZTJBM6j6rhkmUUqs2M4DE',
});
const API_URL = `${BASE_URL}?${params.toString()}`;

export async function getDonations(): Promise<{
   donors: Donor[];
   totalAmount: number;
}> {
   try {
      const res = await fetch(API_URL, { cache: 'no-store' });

      if (!res.ok) {
         throw new Error('Failed to fetch data');
      }

      const data: ApiResponse = await res.json();
      const groups: { [key: string]: { total: number; notes: string[] } } = {};
      let totalDonationAmount = 0;

      data.data.forEach((tx) => {
         const amount = Number(tx.value) / 1000000;
         if (!groups[tx.from_address]) {
            groups[tx.from_address] = { total: 0, notes: [] };
         }
         groups[tx.from_address].total += amount;
         totalDonationAmount += amount;

         if (tx.text_data?.trim()) {
            groups[tx.from_address].notes.push(tx.text_data.trim());
         }
      });

      const donors = Object.entries(groups)
         .map(([addr, data]) => ({
            Sender: addr,
            UserName:
               addressMap[addr]?.username ||
               `${addr.slice(0, 6)}...${addr.slice(-4)}`,
            Avatar: addressMap[addr]?.avatar || '',
            Amount: new Intl.NumberFormat('vi-VN').format(data.total),
            AmountNum: data.total,
            Note: data.notes.join(', '),
         }))
         .sort((a, b) => b.AmountNum - a.AmountNum);

      return { donors, totalAmount: totalDonationAmount };
   } catch (error) {
      console.error('Error fetching donations:', error);
      return { donors: [], totalAmount: 0 };
   }
}
