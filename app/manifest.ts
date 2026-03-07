import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Есөн Бэлчир ХХК - Агаар Сэрүүцэгч, Эйркондишн',
    short_name: 'Есөн Бэлчир',
    description: 'Агаар сэрүүцэгч, эйркондишн, халаалтын систем, агаар сэлгэлт - KANION, AUX, BALLU, SHUFT, AIRONN брэндийн албан ёсны нийлүүлэгч',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0100FD',
    icons: [
      {
        src: '/images/logo3.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
