'use client';

import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';

import { LEARN_CONTENTS } from '@/common/constant/learn';
import LearnPreviewCard from '@/modules/learn/components/LearnPreviewCard';
import BlogCardNewSkeleton from '@/common/components/skeleton/BlogCardNewSkeleton';

type Props = {
  perPage?: number;
  showOnly?: 'all' | 'new' | 'free' | 'paid';
  loading?: boolean;
};

const LearnCarousel = ({ perPage = 4, showOnly = 'all', loading = false }: Props) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const setContainerRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
  };

  const { events } = useDraggable(
    containerRef as React.MutableRefObject<HTMLElement>
  );

  const items = useMemo(() => {
    let base = LEARN_CONTENTS.filter((i) => i.is_show);
    if (showOnly === 'new') base = base.filter((i) => i.is_new);
    if (showOnly === 'free') base = base.filter((i) => !i.is_paid);
    if (showOnly === 'paid') base = base.filter((i) => i.is_paid);
    return base.slice(0, perPage);
  }, [perPage, showOnly]);

  const renderCards = () => {
    if (loading) {
      return Array.from({ length: 3 }, (_, idx) => <BlogCardNewSkeleton key={idx} />);
    }

    return items.map((item, idx) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5, delay: idx * 0.03 }}
        className="min-w-[326px] gap-x-5"
      >
        <LearnPreviewCard {...item} />
      </motion.div>
    ));
  };

  return (
    <div
      className="flex p-1 gap-4 overflow-x-scroll scrollbar-hide"
      {...events}
      ref={setContainerRef}
      role="list"
      aria-label="Learn preview carousel"
    >
      {renderCards()}
    </div>
  );
};

export default LearnCarousel;
