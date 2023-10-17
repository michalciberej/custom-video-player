'use client';

import { useRef } from 'react';
import Controls from './Controls';

const Video = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  return (
    <div
      className='
    bg-gray-700
      flex
      flex-col
      space-y-4
      p-2
      rounded-md
      shadow-lg'>
      <div
        ref={videoRef}
        className='
        group
        relative
        overflow-hidden'>
        <video
          width='100%'
          height='100%'
          src='/video.mp4'
          loop={false}
          className='rounded-md'>
          Your Browser doesnt support video
        </video>
        <Controls ref={videoRef} />
      </div>
    </div>
  );
};

export default Video;
