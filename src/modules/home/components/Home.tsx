import Breakline from '@/common/components/elements/Breakline';

import BlogPreview from './BlogPreview';
import Introduction from './Introduction';
import Services from './Services';
import LearnPreview from './LearnPreview';

const Home = () => {
  return (
    <>
      <Introduction />
      <Breakline className='mt-8 mb-7' />
      <LearnPreview />
      <Breakline className='my-8' />
      <Services />
    </>
  );
};

export default Home;
