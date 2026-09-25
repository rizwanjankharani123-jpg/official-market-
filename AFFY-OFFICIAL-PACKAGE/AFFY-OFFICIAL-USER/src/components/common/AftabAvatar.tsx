import React, { useState } from 'react';

interface AftabAvatarProps {
  className?: string;
  imgClassName?: string;
  alt?: string;
  showBadge?: boolean;
}

export const AFTAB_PROFILE_IMAGE_URL = 'https://i.ibb.co/rR2WdxJ0/1772950442657-1.jpg';
export const AFTAB_LOCAL_FALLBACK_IMAGE = '/assets/aftab-profile.jpg';

export const AftabAvatar: React.FC<AftabAvatarProps> = ({
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover object-top',
  alt = 'Aftab — Web Developer & Software Developer',
  showBadge = false
}) => {
  const [src, setSrc] = useState(AFTAB_PROFILE_IMAGE_URL);

  const handleError = () => {
    if (src !== AFTAB_LOCAL_FALLBACK_IMAGE) {
      setSrc(AFTAB_LOCAL_FALLBACK_IMAGE);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={handleError}
        className={imgClassName}
        loading="eager"
      />
      {showBadge && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
          VERIFIED DEVELOPER
        </div>
      )}
    </div>
  );
};
