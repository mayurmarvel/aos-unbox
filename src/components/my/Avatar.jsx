import React, { useEffect, useState } from 'react';

function Avatar({ seed, width }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [error, setError] = useState(false);

  const fallbackUrl = `https://avatar.iran.liara.run/public/boy?username=${seed}`;

  useEffect(() => {
    const generateAvatar = async (seed) => {
      const avatarSvg = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}&radius=15&eyes=eva,frame1,frame2,robocop,roundFrame01,roundFrame02,sensor,shade01&mouth=bite,diagram,grill03,smile01,smile02,square01,square02`; // Generate PNG

      setAvatarUrl(avatarSvg);
    };

    generateAvatar(seed);
  }, [seed]);

  const handleError = () => {
    setError(true); // Set error state to true if image fails to load
  };

  const handleFallbackLoad = () => {
    setError(false); // Reset error state when the fallback image loads successfully
  };

  return (
    <>
      {error || !avatarUrl ? (
        <img
          src={fallbackUrl}
          alt="Fallback Avatar"
          width={width}
          onLoad={handleFallbackLoad}
        />
      ) : (
        <img
          src={avatarUrl}
          className="mr-4 h-12 w-12 rounded-sm"
          alt="Avatar"
          width={width}
          onError={handleError}
        />
      )}
    </>
  );
}

export default Avatar;
