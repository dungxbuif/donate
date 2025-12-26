import { encrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

interface CertificateShareData {
   donorName: string;
   amount: string;
   sender: string;
   organizationName: string;
}

export async function POST(request: NextRequest) {
   try {
      const certificateData: CertificateShareData = await request.json();

      console.log('[ShareAPI] Received certificate data:', certificateData);

      // Validate required fields
      if (
         !certificateData.donorName ||
         !certificateData.amount ||
         !certificateData.sender
      ) {
         return NextResponse.json(
            { error: 'Missing required certificate data' },
            { status: 400 }
         );
      }

      console.log('[ShareAPI] Attempting to encrypt data...');

      // Encrypt the certificate data to create a shareable token
      const token = await encrypt(certificateData as any);

      console.log(
         '[ShareAPI] Encryption successful, token length:',
         token.length
      );

      return NextResponse.json({ token });
   } catch (error) {
      console.error('Error creating share token:', error);
      return NextResponse.json(
         { error: 'Failed to create share token' },
         { status: 500 }
      );
   }
}
