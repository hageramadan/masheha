import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import { Toaster } from "react-hot-toast";

// ✅ تحميل خط Almarai العربي
const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "تأجير السيارات",
  description: "أفضل خدمة لتأجير السيارات في المنطقة",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${almarai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-almarai">
        <Navbar />
        {children}
        <Footer />
        
        {/* Toaster - يظهر في أعلى المنتصف */}
        <Toaster
          position="top-center"
         
        
        />
      </body>
    </html>
  );
}