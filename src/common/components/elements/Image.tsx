'use client';

import clsx from 'clsx';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';

import clsxm from '@/common/libs/clsxm';
import WorkerImageLoader from './WorkerImageLoader';

type ImageProps = {
  rounded?: string;
  useCdn?: boolean;
} & NextImageProps;

const Image = (props: ImageProps) => {
  const { alt, src, className, rounded, useCdn, ...rest } = props;
  const [isLoading, setLoading] = useState(true);

  return (
    <div
      className={clsx(
        'overflow-hidden',
        isLoading ? 'animate-pulse' : '',
        rounded
      )}
    >
      <NextImage
        loader={useCdn ? WorkerImageLoader : undefined}
        className={clsxm(
          100,
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-[1.02] blur-xl grayscale'
            : 'scale-100 blur-0 grayscale-0',
          rounded,
          className
        )}
        src={src}
        alt={alt}
        loading='lazy'
        // priority={true}
        quality={100}
        onLoadingComplete={() => setLoading(false)}
        {...rest}
      />
    </div>
  );
};
export default Image;
