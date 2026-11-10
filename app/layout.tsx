import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteUrl } from "@/constants/data";
import { productMenu } from "@/constants/products";
import { shareMetadata, siteName } from "@/lib/metadata";
import type { Metadata } from "next";
import { golos, mono } from "./fonts";
import "./globals.css";

const defaultTitle = "Есөн Бэлчир ХХК – Агаар сэлгэлт, хөргөлтийн систем";
const defaultDescription =
  "Есөн Бэлчир нь агаар сэлгэлт, хөргөлтийн төхөөрөмж болон хоолойн системийг нийлүүлж, суурилуулж, засвар үйлчилгээ үзүүлдэг Монголын тэргүүлэгч компани юм.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "эйркондишн",
    "air conditioning",
    "агаар сэлгэлт",
    "agaar selgelt",
    "ventilation",
    "halaaltiin system",
    "хөргөлтийн систем",
    "cooling system",
    "horgoltiin system",
    "агаар сэлгэлт Улаанбаатар",
    "agaar selgelt Ulaanbaatar",
    "ventilation Ulaanbaatar",
    "эйркондишн Монгол",
    "air conditioning Mongolia",
    "агаар боловсруулах",
    "salhivch",
    "салхивч",
    "windmill",
    "air processing",
    "KANION",
    "AUX",
    "BALLU",
    "SHUFT",
    "AIRONN",
    "галын сэнс",
    "galiin sens",
    "fire damper",
    "smoke damper",
    "агаар сэлгэлт суурилуулалт",
    "agaar selgelt suuriluualalt",
    "ventilation installation",
    "эйркондишн засвар",
    "air condition zasvar",
    "air conditioning repair",
    "галын будаг",
    "galiin budag",
    "fire paint",
    "Есөн Бэлчир",
    "Yesun Belchir",
    "yusunbelchir",
    "yesunbelchir",
    "yesun belchir",
    "yesun belchir mn",
    "yusun belchir",
    "yusun belchir mn",
    "yesun belchir монгол",
    "yusun belchir монгол",
    "HVAC Mongolia",
    "HVAC Ulaanbaatar",
    "air conditioner Mongolia",
    "ventilation system Mongolia",
  ],
  icons: {
    icon: "/images/logo3.png",
  },
  ...shareMetadata(defaultTitle, defaultDescription, "/"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body
        className={`scroll-smooth font-sans ${golos.variable} ${mono.variable}`}
        suppressHydrationWarning
      >
        <Header productMenu={productMenu} />
        <main id="main">{children}</main>
        <Footer />
        <ContactBar />
      </body>
    </html>
  );
}
