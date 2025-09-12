import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MinisUnified from '@components/MinisUnified';
import { setLoginStatus } from '@store/actions/userActions';
import Head from 'next/head';

const MinisPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { urlType = 'MINIS_ARTICLES' } = router.query;

  useEffect(() => {
    // Set initial login status (you can modify this based on your auth logic)
    dispatch(setLoginStatus(false));
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Tech Minis - Latest Tech News & Career Insights</title>
        <meta name="description" content="Stay informed with bite-sized tech news, career insights, and industry updates from Naukri Minis." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <MinisUnified urlType={urlType} />
      </main>
    </>
  );
};

export default MinisPage;
