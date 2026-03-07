export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Есөн Бэлчир ХХК",
    "description": "Агаар сэлгэлт, хөргөлтийн төхөөрөмж болон хоолойн системийн нийлүүлэлт, суурилуулалт, засвар үйлчилгээ",
    "url": "https://www.yesunbelchir.mn",
    "telephone": "+976-XXXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Улаанбаатар",
      "addressCountry": "MN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.8864,
      "longitude": 106.9057
    },
    "image": "https://www.yesunbelchir.mn/images/logo3.png",
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://www.facebook.com/yesunbelchir",
      "https://www.instagram.com/yesunbelchir"
    ],
    "brand": [
      {
        "@type": "Brand",
        "name": "KANION"
      },
      {
        "@type": "Brand",
        "name": "AUX"
      },
      {
        "@type": "Brand",
        "name": "BALLU"
      },
      {
        "@type": "Brand",
        "name": "SHUFT"
      },
      {
        "@type": "Brand",
        "name": "AIRONN"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Бүтээгдэхүүн",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Агаар сэрүүцэгч",
            "description": "KANION, AUX брэндийн агаар сэрүүцэгч"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Агаар сэлгэлт",
            "description": "BALLU, SHUFT брэндийн агаар сэлгэлтийн систем"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Галын сэнс",
            "description": "AIRONN брэндийн галын сэнс"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
