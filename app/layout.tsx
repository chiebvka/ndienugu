import { Geist } from "next/font/google";
import "./globals.css";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import PrivacyModalTrigger from "@/components/privacy-modal-trigger";
import { Providers } from "./providers";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "NDI ENUGU SCOTLAND ASSOCIATION | OGANIHU NDI ENUGU",
  description: "Ndi Enugu Scotland Association (est. 2022) is a vibrant community of Enugu indigenes in Scotland, fostering unity, culture, and progress. Join us for events, projects, and community support.",
  openGraph: {
    title: "NDI ENUGU SCOTLAND ASSOCIATION | OGANIHU NDI ENUGU",
    description: "Ndi Enugu Scotland Association (est. 2022) is a vibrant community of Enugu indigenes in Scotland, fostering unity, culture, and progress. Join us for events, projects, and community support.",
    url: defaultUrl,
    siteName: "Ndi Enugu Scotland Association",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NDI ENUGU SCOTLAND ASSOCIATION Logo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NDI ENUGU SCOTLAND ASSOCIATION | OGANIHU NDI ENUGU",
    description: "Ndi Enugu Scotland Association (est. 2022) is a vibrant community of Enugu indigenes in Scotland, fostering unity, culture, and progress. Join us for events, projects, and community support.",
    images: ["/opengraph-image.png"],
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
        {/* <> */}
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster richColors />
          <PrivacyModalTrigger />
        {/* </> */}
        </Providers>
      </body>
    </html>
  );
}
