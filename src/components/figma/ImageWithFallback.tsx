import React, { useState, useEffect } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lazy?: boolean;
  quality?: 'high' | 'medium' | 'low';
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const { src, alt, style, className, lazy = true, quality = 'high', ...rest } = props

  // Reset state when src changes so stale error/load state doesn't bleed across projects
  useEffect(() => {
    setDidError(false)
    setIsLoaded(false)
  }, [src])

  const handleError = () => {
    setDidError(true)
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  // Enhanced image styles for better quality
  const enhancedStyle: React.CSSProperties = {
    ...style,
    // High-quality rendering
    imageRendering: 'crisp-edges',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    // Smooth transitions
    transition: isLoaded ? 'opacity 0.3s ease-in-out' : 'none',
    opacity: isLoaded ? 1 : 0.95,
    // Prevent blur on scaling
    backfaceVisibility: 'hidden',
    perspective: 1000,
  }

  // Quality-based filter enhancements
  const filterStyles: Record<string, string> = {
    high: 'contrast(1.1) brightness(1.05) saturate(1.15) drop-shadow(0 0 0.5px rgba(0,0,0,0.1))',
    medium: 'contrast(1.05) brightness(1.02) saturate(1.1)',
    low: 'contrast(1) brightness(1) saturate(1)',
  }

  const enhancedClassName = `${className ?? ''} ${isLoaded ? 'opacity-100' : 'opacity-95'}`

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={enhancedClassName}
      style={{
        ...enhancedStyle,
        filter: filterStyles[quality],
      }}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      fetchPriority={lazy ? 'low' : 'high'}
      onError={handleError}
      onLoad={handleLoad}
      {...rest} 
    />
  )
}
