import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Layout/Header";
import ScrollToTop from "@/app/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import { GeneralProvider } from "@/context/GeneralContext";
const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <GeneralProvider>
          <Aoscompo>
            <Header />
            {children}
          </Aoscompo>
          <ScrollToTop />
        </GeneralProvider>
      </body>
    </html>
  );
}
