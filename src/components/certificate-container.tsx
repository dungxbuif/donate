import { Award, Heart, ShieldCheck } from 'lucide-react';

interface CertificateProps {
   donorName?: string;
   amount?: string;
   date?: string;
   organizationName?: string;
}

export function CertificateContainer({
   donorName,
   amount,
   date,
}: CertificateProps) {
   return (
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg border-8 border-primary/20 bg-card p-1 shadow-2xl">
         {/* Ornamental Inner Border */}
         <div className="relative border-2 border-primary/40 rounded-sm p-12 md:p-20 overflow-hidden bg-radial-[at_50%_50%] from-card via-card/80 to-background/50">
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary/60 rounded-tl-sm -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary/60 rounded-tr-sm translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary/60 rounded-bl-sm -translate-x-1 translate-y-1" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/60 rounded-br-sm translate-x-1 translate-y-1" />

            {/* Header Section */}
            <div className="flex flex-col items-center text-center space-y-6">
               <div className="bg-primary/10 p-4 rounded-full border border-primary/30 mb-4 animate-in fade-in zoom-in duration-1000 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  <Award className="w-12 h-12 text-primary" />
               </div>

               <h1 className="font-serif text-4xl md:text-6xl text-primary tracking-tight leading-none uppercase drop-shadow-sm">
                  Giấy Chứng Nhận Đóng Góp
               </h1>

               <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

               <p className="text-muted-foreground text-lg italic max-w-lg font-serif">
                  Giấy chứng nhận này được trao tặng cho
               </p>

               <h2 className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight text-pretty">
                  {donorName}
               </h2>

               <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mt-4 font-sans px-4">
                  Để ghi nhận sự đóng góp nhiệt tình và tinh thần đồng đội xuất
                  sắc của bạn cho hoạt động team building. Khoản đóng góp{' '}
                  <span className="text-primary font-semibold">{amount}</span>{' '}
                  đã giúp tạo nên một chương trình team building thành công và
                  đầy ý nghĩa, góp phần xây dựng tinh thần đoàn kết trong công
                  ty.
               </p>
            </div>

            {/* Footer Section with Signatures */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
               <div className="text-center space-y-2 border-t border-primary/20 pt-4 order-2 md:order-1">
                  <p className="font-serif text-xl italic text-foreground/80 leading-none">
                     Giám đốc Z'Ốc
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                     Văn phòng Quy Nhon
                  </p>
               </div>

               <div className="flex flex-col items-center justify-center order-1 md:order-2">
                  <div className="relative group">
                     <div className="absolute inset-0 scale-150 opacity-10 bg-primary rounded-full blur-2xl transition-transform group-hover:scale-175 duration-700" />
                     <div className="relative border-4 border-primary/40 rounded-full p-6 bg-card/50 backdrop-blur-sm shadow-inner">
                        <ShieldCheck className="w-16 h-16 text-primary" />
                     </div>
                  </div>
                  <p className="mt-4 font-serif text-sm tracking-widest uppercase text-primary/80">
                     CON DẤU CHÍNH THỨC
                  </p>
               </div>

               <div className="text-center space-y-2 border-t border-primary/20 pt-4 order-3">
                  <p className="font-serif text-lg text-foreground/80">
                     {date}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                     Ngày cấp
                  </p>
               </div>
            </div>

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
               <Heart className="w-full h-full text-primary rotate-12 scale-150" />
            </div>
         </div>
      </div>
   );
}
