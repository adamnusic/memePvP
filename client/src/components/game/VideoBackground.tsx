import { useEffect, useRef } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => 
        console.error("Error playing video:", err)
      );
    }
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        opacity: 0.6, // Adjust for desired blend with game
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: 'auto', 
          objectFit: 'fill', 
          objectPosition: 'center top', 
          minWidth: '100%', 
        }}
      >
        <source src="/attached_assets/F4LL3N.mp4" type="video/mp4" />
      </video>
    </div>
  );
}