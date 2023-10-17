'use client';

import {
  BsPlay,
  BsPause,
  BsFastForward,
  BsSkipBackward,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsFullscreen,
} from 'react-icons/bs';
import ControlButton from './ControlButton';
import {
  KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';

const convertSecsToMins = (sec: number) => {
  const min = Math.floor(sec / 60);
  const secRemain = Math.floor(sec % 60);
  return {
    min: min,
    sec: secRemain,
  };
};

const Controls = forwardRef(function Controls(props, ref: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState();
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState();

  console.log(ref.current.children[0]);

  useEffect(() => {
    const { min, sec } = convertSecsToMins(ref.current.duration);
    setDurationSec(ref.current.duration);
    setDuration([min, sec]);

    const interval = setInterval(() => {
      const { min, sec } = convertSecsToMins(ref.current.currentTime);
      setCurrentTimeSec(ref.current.currentTime);
      setCurrentTime([min, sec]);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, ref]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      ref.current.pause();
      setIsPlaying(false);
    } else {
      ref.current.play();
      setIsPlaying(true);
    }
  }, [ref, isPlaying]);

  const handleSound = useCallback(() => {
    if (isMuted) {
      ref.current.volume = 1;
      setIsMuted(false);
    } else {
      ref.current.volume = 0;
      setIsMuted(true);
    }
  }, [ref, isMuted]);

  const handleBackward = useCallback(() => {
    if (ref.current.currentTime - 5 > 0) {
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
    const { min, sec } = convertSecsToMins((ref.current.currentTime += 5));
    setCurrentTimeSec(ref.current.currentTime);
    setCurrentTime([min, sec]);
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
      if (e.keyCode === 32) handlePlay();
      if (e.keyCode === 37) handleBackward();
      if (e.keyCode === 39) handleSkipForward();
      if (e.keyCode === 77) handleSound();
      if (e.keyCode === 70) handleFullscreen();
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
      secondLabel: null,
      secondIcon: null,
      onClick: handleBackward,
      state: true,
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
      secondLabel: null,
      secondIcon: null,
      onClick: handleSkipForward,
      state: true,
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
      secondLabel: null,
      secondIcon: null,
      onClick: handleFullscreen,
      state: true,
    },
  ];

  return (
    <div
      className={clsx(
        `
      absolute
      flex
      items-center
      bottom-0
      left-0
      px-6
      py-2
      bg-gray-900/60
      w-full
      text-lg
      flex-col
      duration-500
      transition-all
      `,
        isPlaying &&
          'group-hover:-translate-y-0 group-hover:opacity-100 translate-y-full'
      )}>
      <input
        type='range'
        max={durationSec}
        min={0}
        defaultValue={0}
        value={currentTimeSec}
        onChange={(e) => (ref.current.currentTime = e.target.value)}
        className='w-full absolute -top-2 left-0'
      />
      <div className='w-full flex justify-between items-center'>
        <div className='flex space-x-4'>
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
        </div>
        <div className='flex space-x-4 items-center'>
          <span>
            {currentTime[0]}:{currentTime[1]} / {duration[0]}:{duration[1]}
          </span>
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
  );
});

export default Controls;
