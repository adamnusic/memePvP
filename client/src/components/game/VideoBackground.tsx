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
        width: '100vw', // Use viewport width
        height: '100vh', // Use viewport height
        zIndex: -1,
        overflow: 'hidden',
        opacity: 0.6, // Slightly more visible
        backgroundColor: 'black', // Add background color to help with contrast
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center the video
          objectFit: 'cover',
        }}
      >
        <source src="/attached_assets/F4LL3N.mp4" type="video/mp4" />
      </video>
    </div>
  );
}