import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Холбоо барих",
  "Есөн Бэлчир ХХК-ийн оффис, үйлдвэрийн хаяг, утас, имэйл, байршил.",
  "/contact",
);

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
