`use client;`

import Link from 'next/link';
import { BsArrowRightShort as ViewAllIcon } from 'react-icons/bs';

import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';

import LearnCarousel from './LearnCorousel';

const LearnPreview = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeading title="Latest Learn" className="ml-1" />
        <SectionSubHeading>
          <Link href="/learn">
            <div className="flex gap-1 hover:gap-3 transition-all duration-300 cursor-pointer text-sm text-neutral-700 dark:text-neutral-400 hover:text-neutral-700 hover:dark:text-neutral-300 mt-1">
              <div className="flex">
                View All <span className="hidden sm:block ml-1">Lessons</span>
              </div>
              <ViewAllIcon size={22} />
            </div>
          </Link>
        </SectionSubHeading>
      </div>

      <LearnCarousel perPage={4} showOnly="all" />
    </section>
  );
};

export default LearnPreview;
