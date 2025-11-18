import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AiFillFire as NewIcon } from 'react-icons/ai';
import { AiOutlineDollarCircle as PaidIcon } from 'react-icons/ai';
import { HiOutlineArrowSmRight as ViewIcon } from 'react-icons/hi';
import { BiLabel as LevelIcon } from 'react-icons/bi';
import { MdLibraryBooks as LessonIcon } from 'react-icons/md';
import useSWR from 'swr';

import Card from '@/common/components/elements/Card';
import Image from '@/common/components/elements/Image';
import { fetcher } from '@/services/fetcher';
import { ContentProps } from '@/common/types/learn';
import Breakline from '@/common/components/elements/Breakline';

const LearnCard = ({
  title,
  slug,
  description,
  image,
  is_new,
  is_paid,
  level,
}: ContentProps) => {
  const { data } = useSWR(`/api/learn?slug=${slug}`, fetcher);
  const lessonCount = data?.count ?? 0;

  const [isHovered, setIsHovered] = useState(false);

  const slideDownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Link href={`/learn/${slug}`}>
      <Card
        className='transition-transform duration-300 hover:scale-105 hover:duration-300 gap-5 group relative flex flex-col border dark:border-neutral-800 shadow-sm rounded-lg cursor-pointer border-neutral-700'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='relative rounded-xl overflow-hidden duration-500 border-b border-neutral-700'>
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            useCdn={true}
            className='object-cover w-full h-full object-centers transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm'
          />
          <div className='flex gap-2 absolute top-2 left-2 transition-transform group-hover:scale-105 duration-300'>
            {is_new && (
              <div className='px-2.5 py-1 rounded-full text-xs font-mono text-neutral-800 bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-800 flex items-center gap-1 transition-all duration-300'>
                <NewIcon size={15} className='text-[#9d4edd]' />
                <span>New</span>
              </div>
            )}

            {is_paid && (
              <div className='px-2.5 py-1 rounded-full text-xs font-mono text-neutral-800 bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-800 flex items-center gap-1 transition-all duration-300'>
                <PaidIcon size={15} />
                <span>Paid</span>
              </div>
            )}
            <div className='px-2.5 py-1 rounded-full text-xs font-mono text-neutral-800 bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-800 flex items-center gap-1 transition-all duration-300'>
              <LessonIcon size={14} />
              {lessonCount} Lessons
            </div>

            <div className='px-2.5 py-1 rounded-full text-xs font-mono text-neutral-800 bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-800 flex items-center gap-1 transition-all duration-300'>
              <LevelIcon size={14} />
              {level}
            </div>
          </div>
          <div className='inset-0 bg-gradient-to-b from-black/20 to-black opacity-80 transition-opacity duration-300'></div>
        </div>

        <div className='relative flex flex-col justify-between p-5 h-full w-full'>
          <div className='flex flex-col space-y-3'>
            <h3 className='font-sora text-lg font-medium text-neutral-800 dark:text-neutral-400 group-hover:underline group-hover:underline-offset-4 transition-all duration-300'>
              {title}
            </h3>
            <Breakline className='border-t-2 border-neutral-600' />
            <p className='leading-relaxed text-sm text-neutral-800 dark:text-neutral-400 transition-all duration-300'>
              {description}
            </p>

            <div className='flex justify-between items-center mt-2 text-neutral-700 dark:text-neutral-400 transition-all duration-300'>
              <motion.div
                variants={slideDownVariants}
                initial='visible'
                animate={isHovered ? 'hidden' : 'visible'}
                className={isHovered ? 'hidden' : 'flex gap-1 items-center'}
              >
                <span className='text-xs font-medium'>View Details</span>
              </motion.div>

              <motion.div
                variants={slideDownVariants}
                initial='hidden'
                animate={isHovered ? 'visible' : 'hidden'}
                className={!isHovered ? 'hidden' : 'flex gap-1 items-center'}
              >
                <span className='text-xs font-medium mr-0.5'>View Lessons</span>
                <ViewIcon size={16} />
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default LearnCard;
