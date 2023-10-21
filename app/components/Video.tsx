'use client';

import { useRef, useState } from 'react';
import Controls from './Controls';

const Video = () => {
  const [file, setFile] = useState<string>('/video.mp4');
  const [isModalOpened, setIsModalOpened] = useState(false);
  const videoRef = useRef(null);

  return (
    <div
      className='
      bg-gray-700
      flex
      flex-col
      p-2
      mx-4
      min-w-[10rem]
      min-h-[10rem]
      rounded-md
      shadow-lg'>
      <div
        className='
        group
        relative
        overflow-hidden 
        rounded-md'>
        <video
          ref={videoRef}
          width='100%'
          height='100%'
          src={file}
          loop={false}>
          Your Browser doesnt support video
        </video>
        <Controls
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          setFile={setFile}
          ref={videoRef}
        />
      </div>
    </div>
  );
};

export default Video;
