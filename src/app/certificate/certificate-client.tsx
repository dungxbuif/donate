'use client';

import { UserInfoData } from '@/app/auth/callback/route';
import { CertificateContainer } from '@/components/certificate-container';
import { Button } from '@/components/ui/button';
import { type Donor } from '@/lib/data';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Image, Printer, Share2 } from 'lucide-react';

interface CertificateClientProps {
   currentUser: UserInfoData | null;
   userDonation: Donor | null;
}

export default function CertificateClient({
   currentUser,
   userDonation,
}: CertificateClientProps) {
   const handleShare = async () => {
      const userName =
         currentUser?.display_name ||
         currentUser?.username ||
         userDonation?.UserName ||
         'Người đóng góp';
      const amount = userDonation?.Amount || '0';

      try {
         // Generate image of the certificate
         const certificateElement = document.querySelector(
            '.certificate-container'
         );
         if (!certificateElement) {
            alert('Không tìm thấy giấy chứng nhận. Vui lòng thử lại.');
            return;
         }

         const canvas = await html2canvas(certificateElement as HTMLElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: certificateElement.scrollWidth,
            height: certificateElement.scrollHeight,
         });

         // Convert canvas to blob
         const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
               (blob) => {
                  resolve(blob!);
               },
               'image/png',
               0.9
            );
         });

         const safeFileName = userName
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase();
         const imageFile = new File(
            [blob],
            `chung-nhan-dong-gop-teambuilding-${safeFileName}.png`,
            { type: 'image/png' }
         );

         // Try to share with image file
         if (navigator.share && navigator.canShare?.({ files: [imageFile] })) {
            await navigator.share({
               title: 'Giấy Chứng Nhận Đóng Góp Team Building',
               text: `Giấy chứng nhận đóng góp team building của ${userName} - số tiền ${amount} VNĐ cho Chi nhánh NCC Quy Nhôn`,
               files: [imageFile],
            });
         } else if (navigator.share) {
            // Fallback to sharing URL if file sharing not supported
            await navigator.share({
               title: 'Giấy Chứng Nhận Đóng Góp Team Building',
               text: `Xem giấy chứng nhận đóng góp team building của ${userName} - số tiền ${amount} VNĐ cho Chi nhánh NCC Quy Nhôn`,
               url: window.location.href,
            });
         } else {
            // Fallback for browsers that don't support Web Share API
            copyToClipboard();
         }
      } catch (error) {
         console.log('Error sharing:', error);
         // Fallback to copying URL to clipboard
         copyToClipboard();
      }
   };

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(window.location.href);
         // Create a temporary toast notification
         const toast = document.createElement('div');
         toast.textContent = 'Đã sao chép link giấy chứng nhận vào clipboard!';
         toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: system-ui;
            font-weight: 500;
         `;
         document.body.appendChild(toast);
         setTimeout(() => document.body.removeChild(toast), 3000);
      } catch (error) {
         console.log('Error copying to clipboard:', error);
         alert('Không thể chia sẻ. Vui lòng sao chép URL thủ công.');
      }
   };

   const handlePrint = () => {
      window.print();
   };

   const handleDownloadImage = async () => {
      try {
         const certificateElement = document.querySelector(
            '.certificate-container'
         );
         if (!certificateElement) {
            alert('Không tìm thấy giấy chứng nhận. Vui lòng thử lại.');
            return;
         }

         const canvas = await html2canvas(certificateElement as HTMLElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: certificateElement.scrollWidth,
            height: certificateElement.scrollHeight,
         });

         // Create download link for image
         const link = document.createElement('a');
         link.download = `chung-nhan-dong-gop-teambuilding-${(
            currentUser?.display_name ||
            currentUser?.username ||
            userDonation?.UserName ||
            'user'
         )
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase()}.png`;
         link.href = canvas.toDataURL('image/png', 0.9);
         link.click();
      } catch (error) {
         console.error('Error generating image:', error);
         alert('Lỗi khi tạo file ảnh. Vui lòng thử lại.');
      }
   };

   const handleDownloadPDF = async () => {
      try {
         const certificateElement = document.querySelector(
            '.certificate-container'
         );
         if (!certificateElement) {
            alert('Không tìm thấy giấy chứng nhận. Vui lòng thử lại.');
            return;
         }

         const canvas = await html2canvas(certificateElement as HTMLElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: certificateElement.scrollWidth,
            height: certificateElement.scrollHeight,
         });

         // Create PDF
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height],
         });

         pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
         const userName =
            currentUser?.display_name ||
            currentUser?.username ||
            userDonation?.UserName ||
            'user';
         const safeFileName = userName
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase();
         pdf.save(`chung-nhan-dong-gop-teambuilding-${safeFileName}.pdf`);
      } catch (error) {
         console.error('Error generating PDF:', error);
         alert('Lỗi khi tạo file PDF. Vui lòng thử chức năng in ấn.');
      }
   };

   return (
      <>
         <style
            dangerouslySetInnerHTML={{
               __html: `
               @media print {
                  body {
                     print-color-adjust: exact !important;
                     -webkit-print-color-adjust: exact !important;
                  }
                  .no-print {
                     display: none !important;
                  }
                  .certificate-container {
                     break-inside: avoid;
                     page-break-inside: avoid;
                  }
                  main {
                     padding: 0 !important;
                     margin: 0 !important;
                  }
               }
            `,
            }}
         />
         <main className="min-h-screen py-12 px-4 md:py-24 bg-background selection:bg-primary/30 selection:text-foreground antialiased overflow-x-hidden">
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               {/* UI Controls */}
               <div className="no-print flex flex-col md:flex-row justify-between items-center gap-6 bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl">
                  <div className="flex items-center gap-4">
                     <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent cursor-pointer"
                        onClick={() => (window.location.href = '/leaderboard')}
                     >
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                     </Button>
                     <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-2xl font-serif text-primary">
                           Giấy Chứng Nhận Đóng Góp
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                           Chứng nhận đóng góp cho hoạt động team building - có
                           thể in và đóng khung làm kỷ niệm.
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                     <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent cursor-pointer"
                        onClick={handleShare}
                     >
                        <Share2 className="w-4 h-4" /> Chia sẻ
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent cursor-pointer"
                        onClick={handlePrint}
                     >
                        <Printer className="w-4 h-4" /> In ấn
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent cursor-pointer"
                        onClick={handleDownloadImage}
                     >
                        <Image className="w-4 h-4" /> Tải ảnh
                     </Button>
                     <Button
                        size="sm"
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                        onClick={handleDownloadPDF}
                     >
                        <Download className="w-4 h-4" /> Tải PDF
                     </Button>
                  </div>
               </div>

               {/* Certificate Display */}
               <div className="certificate-container">
                  {!currentUser ? (
                     <div className="flex items-center justify-center min-h-[500px]">
                        <div className="text-center space-y-4">
                           <p className="text-lg text-muted-foreground">
                              Vui lòng đăng nhập để xem giấy chứng nhận
                           </p>
                           <Button
                              className="cursor-pointer"
                              onClick={() =>
                                 (window.location.href = '/api/auth/login')
                              }
                           >
                              Đăng nhập
                           </Button>
                        </div>
                     </div>
                  ) : !userDonation ? (
                     <div className="flex items-center justify-center min-h-[500px]">
                        <div className="text-center space-y-4">
                           <p className="text-lg text-muted-foreground">
                              Chưa có thông tin đóng góp cho team building
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Hãy tham gia đóng góp để nhận giấy chứng nhận!
                           </p>
                        </div>
                     </div>
                  ) : (
                     <CertificateContainer
                        donorName={
                           currentUser?.display_name ||
                           currentUser?.username ||
                           userDonation?.UserName ||
                           'Người đóng góp'
                        }
                        amount={`${userDonation.Amount} VNĐ`}
                        date={`Quy Nhon, ${new Date().toLocaleDateString(
                           'vi-VN'
                        )}`}
                        organizationName="Chi nhánh NCC Quy Nhơn"
                     />
                  )}
               </div>

               {/* Footer Meta */}
               <p className="text-center text-muted-foreground text-sm">
                  {userDonation ? (
                     <>
                        Mã chứng nhận: TB-2025-
                        {userDonation.Sender.slice(-6).toUpperCase()} | Được xác
                        thực bởi {"Văn phòng Quy Nhon - Giám đốc Z'Ốc"}
                     </>
                  ) : (
                     "Mã chứng nhận: Chưa có | Văn phòng Quy Nhon - Giám đốc Z'Ốc"
                  )}
               </p>
            </div>
         </main>
      </>
   );
}
