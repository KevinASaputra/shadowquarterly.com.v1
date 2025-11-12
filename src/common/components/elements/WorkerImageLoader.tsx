import { ImageLoaderProps } from 'next/image';

const WorkerImageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string => {
  const baseUrl =
    'https://shadowquarterly_workers.kevinadikasaputragithub.workers.dev';
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  return `${baseUrl}/${cleanSrc}?w=${width}&q=${quality || 75}`;
};

export default WorkerImageLoader;
