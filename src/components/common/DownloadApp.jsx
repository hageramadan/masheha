"use client";
import Image from "next/image";
import Link from "next/link";
import { FaGooglePlay, FaApple, FaMobile } from "react-icons/fa";

export default function DownloadApp() {
  return (
    
      <div className="">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex  gap-4 justify-start">
            {/* Google Play */}
            <Link
              href="https://play.google.com/store/apps/details?id=your.app.id"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary  rounded-xl px-4 py-2 flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
             
              <div className="text-end">
                <p className="text-xs text-white/70">GET IT ON</p>
                <p className="text-base lg:text-lg font-bold text-white">Google Play</p>
              </div>
               {/* <FaGooglePlay className="text-4xl" /> */}
               <Image src="/images/app1.png" alt="Google Play" width={26} height={26} />
            </Link>

            {/* App Store */}
            <Link
              href="https://apps.apple.com/app/your-app-id"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary  rounded-xl px-4 py-2 flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              
              <div className="text-end">
                <p className="text-xs text-white/70">Download on the</p>
                <p className="text-base lg:text-lg  font-bold text-white">App Store</p>
              </div>
              <FaApple className="text-4xl text-white" />
               {/* <Image src="/images/app2.png" alt="App Store" width={30} height={30} /> */}

            </Link>
          </div>
        </div>
      </div>
 
  );
}
