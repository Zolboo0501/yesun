import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Есөн Бэлчир ХХК – Агаар сэлгэлт, хөргөлт',
    short_name: 'Есөн Бэлчир',
    description: 'Агаар сэлгэлт, хөргөлтийн төхөөрөмж нийлүүлж, угсарч, засвар үйлчилгээ хийдэг. KANION, AUX, BALLU, SHUFT, AIRONN, LAVFILL брэндийн албан ёсны нийлүүлэгч.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a8cf0',
    icons: [
      {
        src: '/images/logo3.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
