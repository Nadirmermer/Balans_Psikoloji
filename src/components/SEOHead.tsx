import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Balans Psikoloji - Bolu | Ruh Sağlığı ve Psikolojik Danışmanlık',
  description = 'Bolu\'da ruh sağlığınız için güvenilir destek. Bireysel terapi, çift terapisi, aile danışmanlığı ve çocuk psikolojisi hizmetleri. Uzman psikologlarımızdan randevu alın.',
  keywords = 'psikolog bolu, psikolojik danışmanlık bolu, terapi bolu, ruh sağlığı bolu, çift terapisi, aile danışmanlığı, çocuk psikolojisi',
  image = 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  url = window.location.href,
  type = 'website'
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Balans Psikoloji" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Balans Psikoloji" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Balans Psikoloji",
          "description": description,
          "url": "https://balanspsikoloji.com",
          "telephone": "0374 215 65 43",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Cumhuriyet Mah. Atatürk Cad. No: 123/A",
            "addressLocality": "Bolu",
            "addressRegion": "Bolu",
            "postalCode": "14000",
            "addressCountry": "TR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.7394",
            "longitude": "31.6068"
          },
          "openingHours": [
            "Mo-Fr 09:00-18:00",
            "Sa 09:00-15:00"
          ],
          "priceRange": "₺₺",
          "image": image,
          "sameAs": [
            "https://www.youtube.com/@balanspsikoloji"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;