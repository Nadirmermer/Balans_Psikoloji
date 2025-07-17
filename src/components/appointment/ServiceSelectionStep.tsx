import React from 'react';
import { Heart, Users, Baby, GraduationCap, Building, Brain } from 'lucide-react';

interface ServiceSelectionStepProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  hizmetler: Array<{
    id: string;
    slug: string;
    ad: string;
    aciklama: string;
    icon_name: string;
    kategori: string;
  }>;
  onNext: () => void;
}

const iconMap = {
  Heart,
  Users,
  Baby,
  GraduationCap,
  Building,
  Brain
};

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  selectedService,
  onServiceSelect,
  hizmetler,
  onNext
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Heart;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Hangi Hizmeti Almak İstiyorsunuz?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {hizmetler.map((hizmet) => (
          <button
            key={hizmet.id}
            onClick={() => onServiceSelect(hizmet.slug)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedService === hizmet.slug
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                selectedService === hizmet.slug
                  ? 'bg-sage-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {getIcon(hizmet.icon_name)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {hizmet.ad}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {hizmet.aciklama}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedService}
        className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Devam Et
      </button>
    </div>
  );
};