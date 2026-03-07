import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { ptSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Есөн Бэлчир ХХК - Агаар сэлгэлт ба Хөргөлтийн Систем",
  description:
    "Есөн бэлчир нь агаар сэлгэлт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг Монголын тэргүүлэгч компани юм.",
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
  openGraph: {
    title: "Есөн Бэлчир ХХК - Агаар сэлгэлт ба Хөргөлтийн Систем",
    description:
      "Есөн бэлчир нь агаар сэлгэлт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг Монголын тэргүүлэгч компани юм.",
    siteName: "Есөн Бэлчир ХХК",
    images: [
      {
        url: "/images/logo3.png",
        width: 1200,
        height: 630,
        alt: "Есөн Бэлчир ХХК",
      },
    ],
    locale: "mn_MN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Есөн Бэлчир ХХК - Агаар сэлгэлт ба Хөргөлтийн Систем",
    description:
      "Есөн бэлчир нь агаар сэлгэлт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг Монголын тэргүүлэгч компани юм.",
    images: ["/images/logo3.png"],
  },
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
  alternates: {
    canonical: "https://www.yesunbelchir.mn",
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
        className={`scroll-smooth ${ptSans.variable}`}
        suppressHydrationWarning
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
