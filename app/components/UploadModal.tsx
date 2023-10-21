'use client';

import { SetStateAction, useState, useRef } from 'react';
import { BsCloudUpload, BsCheck2 } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';

interface UploadModalProps {
  isModalOpened: boolean;
  setIsModalOpened: React.Dispatch<SetStateAction<boolean>>;
  setFile: React.Dispatch<SetStateAction<string>>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isModalOpened,
  setIsModalOpened,
  setFile,
}) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!inputRef.current?.files) return;
    const file = inputRef.current.files[0];
    if (file.size <= 5 * 1024 * 1024 && file.type === 'video/mp4') {
      setFile(URL.createObjectURL(file));
      setSuccess(true);
      setError(false);
    } else {
      setSuccess(false);
      setError(true);
      console.error('Upload file with correct size and type');
    }
  };

  return (
    <>
      {isModalOpened && (
        <div
          className='
          absolute
          h-full
          top-0
          bottom-0
          left-0
          right-0
          bg-gray-500
          p-10
          md:p-6
          flex
          flex-col
          justify-center
          items-center
          rounded-md
          space-y-4'>
          <button
            type='button'
            aria-label='close'
            className='place-self-end text-2xl'
            onClick={() => {
              setIsModalOpened(!isModalOpened);
              setSuccess(false);
            }}>
            <AiOutlineClose />
          </button>
          <form
            className='
            flex
            flex-col
            space-y-6
            items-center
            w-full   
            rounded-md'
            onSubmit={(e) => handleSubmit(e)}>
            <label
              htmlFor='fileUpload'
              className='
              w-full
              h-full
              flex
              py-6
              rounded-md
              items-center
              justify-center
              cursor-pointer
              space-x-4
              border-white
              border-dashed
              border
              md:border-2
              '>
              <input
                ref={inputRef}
                id='fileUpload'
                type='file'
                accept='video/*'
              />
              {success ? (
                <BsCheck2 className='text-green-400 text-4xl sm:text-6xl md:text-8xl shrink-0' />
              ) : (
                <BsCloudUpload className='text-4xl sm:text-6xl md:text-8xl shrink-0' />
              )}
              <div className='flex flex-col text-center'>
                <span className='sm:text-xl md:text-2xl'>
                  Upload video to watch
                </span>
                <span className='text-xs md:text-sm text-gray-300'>
                  ( max 5MB and mp4 format )
                </span>
              </div>
            </label>
            <button className='px-2 py-1 bg-gray-50 rounded-md text-gray-800'>
              Upload
            </button>
          </form>
          {error && (
            <span className='text-red-400'>
              Upload File with correct size and format
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default UploadModal;
