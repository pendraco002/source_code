import React from 'react';
import { motion } from 'framer-motion';
import { useLazyImage } from '../hooks/usePerformance';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
  blurDataURL?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className = '',
  width,
  height,
  onLoad,
  onError,
  blurDataURL
}) => {
  const { imgRef, imageSrc, isLoaded, isError } = useLazyImage(src, placeholder);

  React.useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  React.useEffect(() => {
    if (isError && onError) {
      onError();
    }
  }, [isError, onError]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          {blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover opacity-50 blur-sm"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 
                        bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {/* Imagem principal */}
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 
                   ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.1
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Estado de erro */}
      {isError && (
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <div className="text-gray-500 text-sm text-center">
            <div className="mb-2">⚠️</div>
            <div>Erro ao carregar imagem</div>
          </div>
        </div>
      )}
    </div>
  );
};

interface OptimizedImageProps extends LazyImageProps {
  sizes?: string;
  srcSet?: string;
  quality?: 'low' | 'medium' | 'high';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  srcSet,
  sizes,
  quality = 'medium',
  ...props
}) => {
  // Gerar srcSet baseado na qualidade se não fornecido
  const generateSrcSet = (baseSrc: string, targetQuality: string) => {
    if (srcSet) return srcSet;
    
    // Assumindo que temos diferentes versões de qualidade
    const qualityMap = {
      low: '?w=400&q=30',
      medium: '?w=800&q=75', 
      high: '?w=1200&q=90'
    };
    
    return `${baseSrc}${qualityMap.low} 400w, ${baseSrc}${qualityMap.medium} 800w, ${baseSrc}${qualityMap.high} 1200w`;
  };

  const responsiveSizes = sizes || '(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px';

  return (
    <LazyImage
      {...props}
      src={`${src}${quality === 'low' ? '?w=400&q=30' : quality === 'high' ? '?w=1200&q=90' : '?w=800&q=75'}`}
    />
  );
};

export default LazyImage;