import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { ptSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Есөн Бэлчир ХХК - Агааржуулалт ба Хөргөлтийн Систем",
  description:
    "Есөн бэлчир нь агааржуулалт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг Монголын тэргүүлэгч компани юм.",
  icons: {
    icon: "/images/logo3.png",
  },
  openGraph: {
    title: "Есөн Бэлчир ХХК - Агааржуулалт ба Хөргөлтийн Систем",
    description:
      "Есөн бэлчир нь агааржуулалт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг Монголын тэргүүлэгч компани юм.",
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
    title: "Есөн Бэлчир ХХК - Агааржуулалт ба Хөргөлтийн Систем",
    description:
      "Есөн бэлчир нь агааржуулалт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээг үзүүлдэг Монголын тэргүүлэгч компани юм.",
    images: ["/images/logo3.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
