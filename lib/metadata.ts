import type { Metadata } from "next";

const siteName = "Есөн Бэлчир ХХК";
const shareImage = {
  url: "/images/logo3.png",
  width: 594,
  height: 420,
  alt: siteName,
};

function shareMetadata(title: string, description: string, path: string) {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      images: [shareImage],
      locale: "mn_MN",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [shareImage.url],
    },
  } satisfies Metadata;
}

function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...shareMetadata(`${title} | ${siteName}`, description, path),
  };
}

export { pageMetadata, shareMetadata, siteName };
