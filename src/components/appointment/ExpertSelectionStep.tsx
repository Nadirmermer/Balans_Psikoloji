import React from 'react';
import { User, Star, Clock, MapPin } from 'lucide-react';

interface ExpertSelectionStepProps {
  selectedExpert: string;
  onExpertSelect: (expert: string) => void;
  uzmanlar: Array<{
    id: string;
    slug: string;
    ad: string;
    soyad: string;
    unvan: string;
    uzmanlik_alanlari: string[];
    deneyim_yili: number;
    profil_resmi: string;
  }>;
  onNext: () => void;
  onBack: () => void;
}

export const ExpertSelectionStep: React.FC<ExpertSelectionStepProps> = ({
  selectedExpert,
  onExpertSelect,
  uzmanlar,
  onNext,
  onBack
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Uzmanınızı Seçin
      </h2>
      
      <div className="space-y-4 mb-6">
        {uzmanlar.map((uzman) => (
          <button
            key={uzman.id}
            onClick={() => onExpertSelect(uzman.slug)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedExpert === uzman.slug
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={uzman.profil_resmi}
                alt={`${uzman.ad} ${uzman.soyad}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {uzman.ad} {uzman.soyad}
                </h3>
                <p className="text-sm text-sage-600 dark:text-sage-400 font-medium">
                  {uzman.unvan}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{uzman.deneyim_yili} yıl deneyim</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Uzman</span>
                  </div>
                </div>
                {uzman.uzmanlik_alanlari.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Uzmanlık: {uzman.uzmanlik_alanlari.slice(0, 3).join(', ')}
                      {uzman.uzmanlik_alanlari.length > 3 && '...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedExpert}
          className="flex-1 bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
};