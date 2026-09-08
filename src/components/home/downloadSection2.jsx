import DownloadApp from '@/src/components/common/DownloadApp';

export default function DownloadSection2() {
  return (
    <section 
      className="container py-6 relative bg-[#E8F8FF] rounded-2xl lg:rounded-2xl overflow-hidden mx-auto w-[95%] lg:w-full mb-4 lg:mb-7 flex items-center"
     
    >
      <div className="w-full px-4 relative z-10 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <h1 className='text-[#012738] font-bold text-sm sm:text-sm lg:text-[18px] leading-tight'>
            حمل التطبيق واحجز سيارتك وتوصلك لمكانك
          </h1>
          <DownloadApp />
        </div>
      </div>
    </section>
  );
}