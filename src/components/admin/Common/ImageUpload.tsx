import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase'; // kendi supabase client'ını import et

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // MB cinsinden
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Resim',
  accept = 'image/*',
  maxSize = 5,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Dosya boyutu kontrolü
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`);
      }

      // Dosya türü kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece resim dosyaları yüklenebilir');
      }

      // Dosya adını oluştur
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setUploading(true);

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('images') // kendi bucket adını yaz
        .upload(filePath, file);

      if (error) throw error;

      // Public URL oluştur
      const { publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(filePath).data;

      if (!publicUrl) throw new Error('Resim URL\'si alınamadı');

      setUploading(false);
      return publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Resim yüklenirken bir hata oluştu');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onChange('');
    // File input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Mevcut resim önizlemesi */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Önizleme"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Yükleme alanı */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-sage-400 dark:hover:border-sage-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-600"></div>
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center mx-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Yükleniyor...' : 'Resim Seç'}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              veya sürükleyip bırakın
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Maksimum {maxSize}MB, JPG, PNG, GIF desteklenir
          </p>
        </div>
      </div>

      {/* URL ile yükleme */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-600 dark:text-gray-400">
          veya URL girin:
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        />
      </div>
    </div>
  );
};

export default ImageUpload;