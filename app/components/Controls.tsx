'use client';

import {
  BsPlay,
  BsPause,
  BsFastForward,
  BsSkipBackward,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsFullscreen,
  BsCloudUpload,
} from 'react-icons/bs';
import ControlButton from './ControlButton';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import UploadModal from './UploadModal';
import { SetStateAction } from 'react';

const convertSecsToMins = (s: number) => {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return { min, sec };
};

interface UploadModalProps {
  isModalOpened: boolean;
  setIsModalOpened: React.Dispatch<SetStateAction<boolean>>;
  setFile: React.Dispatch<SetStateAction<string>>;
}

const Controls = forwardRef(function Controls(
  props: UploadModalProps,
  ref: any
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState(0);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0.5);
  const { isModalOpened, setIsModalOpened, setFile } = props;

  useEffect(() => {
    if (ref.current.duration) {
      const { min, sec } = convertSecsToMins(ref.current.duration);
      setDurationSec(ref.current.duration);
      setDuration([min, sec]);
    }

    const interval = setInterval(() => {
      const { min, sec } = convertSecsToMins(ref.current.currentTime);
      setCurrentTimeSec(ref.current.currentTime);
      setCurrentTime([min, sec]);
      if (ref.current.currentTime === ref.current.duration) setIsPlaying(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, ref]);

  const handleSound = useCallback(() => {
    if (isMuted) {
      ref.current.volume = 1;
      setCurrentVolume(1);
      setIsMuted(false);
    } else {
      ref.current.volume = 0;
      setCurrentVolume(0);
      setIsMuted(true);
    }
  }, [ref, isMuted]);

  const handleSoundRange = (e: any) => {
    const value = e.target.value;
    ref.current.volume = value;
    setCurrentVolume(value);
    if (value == 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleModal = () => {
    setIsModalOpened(!isModalOpened);
  };

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      ref.current.pause();
      setIsPlaying(false);
    } else {
      ref.current.play();
      setIsPlaying(true);
    }
  }, [ref, isPlaying]);

  const handleBackward = useCallback(() => {
    const time = ref.current.currentTime;
    if (time - 5 > 0) {
      const { min, sec } = convertSecsToMins((ref.current.currentTime -= 5));
      setCurrentTimeSec(ref.current.currentTime);
      setCurrentTime([min, sec]);
    } else {
      ref.current.currentTime = 0;
      setCurrentTimeSec(ref.current.currentTime);
      setCurrentTime([0, 0]);
    }
  }, [ref]);

  const handleSkipForward = useCallback(() => {
    const time = ref.current.currentTime;
    if (time + 5 < ref.current.duration) {
      const { min, sec } = convertSecsToMins((ref.current.currentTime += 5));
      setCurrentTimeSec(ref.current.currentTime);
      setCurrentTime([min, sec]);
    } else {
      ref.current.currentTime = ref.current.duration;
      const { min, sec } = convertSecsToMins(ref.current.duration);
      setCurrentTimeSec(ref.current.duration);
      setCurrentTime([min, sec]);
    }
  }, [ref]);

  const handleFullscreen = useCallback(() => {
    if (ref.current.requestFullScreen) {
      ref.current.requestFullScreen();
    }
    if (ref.current.webkitRequestFullScreen) {
      ref.current.webkitRequestFullScreen();
    }
    if (ref.current.mozRequestFullScreen) {
      ref.current.mozRequestFullScreen();
    }

    if (document.fullscreenElement) document.exitFullscreen();
  }, [ref]);

  const handleKeyPress = useCallback(
    (e: any) => {
      if (e.key === ' ') handlePlay();
      if (e.key === 'ArrowLeft') handleBackward();
      if (e.key === 'ArrowRight') handleSkipForward();
      if (e.key === 'm') handleSound();
      if (e.key === 'f') handleFullscreen();
    },
    [
      handleFullscreen,
      handleSkipForward,
      handleBackward,
      handleSound,
      handlePlay,
    ]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress]);

  const controls = [
    {
      label: 'skip backward',
      icon: BsSkipBackward,
      onClick: handleBackward,
    },
    {
      label: 'pause',
      icon: BsPause,
      secondLabel: 'play',
      secondIcon: BsPlay,
      onClick: handlePlay,
      state: isPlaying,
    },
    {
      label: 'skip forward',
      icon: BsFastForward,
      onClick: handleSkipForward,
    },
    {
      label: 'mute',
      icon: BsFillVolumeMuteFill,
      secondLabel: 'unmute',
      secondIcon: BsFillVolumeUpFill,
      onClick: handleSound,
      state: isMuted,
    },
    {
      label: 'fullscreen',
      icon: BsFullscreen,
      onClick: handleFullscreen,
    },
    {
      label: 'upload',
      icon: BsCloudUpload,
      onClick: handleModal,
    },
  ];

  return (
    <>
      <div
        className={clsx(
          `
      absolute
      flex
      items-center
      bottom-0
      left-0
      px-2
      py-2
      bg-gray-900/60
      w-full
      text-lg
      flex-col
      duration-500
      group-hover:translate-y-0
      transition-transform
      `,
          isPlaying && 'translate-y-full'
        )}>
        <input
          type='range'
          max={durationSec}
          min={0}
          value={currentTimeSec}
          onChange={(e) => (ref.current.currentTime = e.target.value)}
          className='w-full absolute -top-2 left-0'
        />
        <div className='w-full flex justify-between items-center'>
          <div className='flex space-x-4 items-center'>
            {controls.map((obj, index) => {
              if (index <= 2) {
                return (
                  <ControlButton
                    key={index}
                    label={obj.label}
                    secondLabel={obj.secondLabel}
                    icon={obj.icon}
                    secondIcon={obj.secondIcon}
                    onClick={obj.onClick}
                    state={obj.state}
                  />
                );
              }
            })}
            <span className='text-sm md:text-base'>
              {currentTime[0]}:{currentTime[1]} / {duration[0]}:{duration[1]}
            </span>
          </div>
          <div className='flex space-x-4 items-center'>
            <input
              type='range'
              className='w-10'
              value={currentVolume}
              min={0}
              max={1}
              step={0.05}
              onChange={(e) => handleSoundRange(e)}
            />
            {controls.map((obj, index) => {
              if (index >= 3) {
                return (
                  <ControlButton
                    key={index}
                    label={obj.label}
                    secondLabel={obj.secondLabel}
                    icon={obj.icon}
                    secondIcon={obj.secondIcon}
                    onClick={obj.onClick}
                    state={obj.state}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
      <UploadModal
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
        setFile={setFile}
      />
    </>
  );
});

export default Controls;
