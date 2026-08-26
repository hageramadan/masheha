import DownloadApp from '@/src/components/common/DownloadApp';
export default function DownloadSection() {
  return (
    <section className="pb-6">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl max-w-3xl font-bold mb-4" style={{lineHeight:1.7}}>حمّل التطبيق واحجز <span className="text-[#1F4F63]">سيارتك</span> في دقائق...... </h2>
        <p className="text-lg md:text-2xl max-w-2xl text-gray-500  mb-8" style={{lineHeight:1.7}}> استمتع بتجربة تأجير سيارات سلسة وسريعة , اختر سيارتك المفضلة , حدد المدة, واستلمها من اقرب فرع اليك بضغطة زر .</p>
        <DownloadApp />
      </div>
    </section>
  );
}