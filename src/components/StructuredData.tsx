import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'organization' | 'person' | 'article' | 'service';
  data: Record<string, unknown>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org"
    };

    switch (type) {
      case 'organization':
        return {
          ...baseData,
          "@type": "Organization",
          ...data
        };
      
      case 'person':
        return {
          ...baseData,
          "@type": "Person",
          ...data
        };
      
      case 'article':
        return {
          ...baseData,
          "@type": "Article",
          ...data
        };
      
      case 'service':
        return {
          ...baseData,
          "@type": "Service",
          ...data
        };
      
      default:
        return baseData;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default StructuredData;