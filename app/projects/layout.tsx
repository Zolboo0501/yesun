import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Төслүүд",
  "Есөн Бэлчир ХХК-ийн хэрэгжүүлсэн агаар сэлгэлт, хөргөлтийн системийн төслүүд.",
  "/projects",
);

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
