import { useEffect } from 'react';
import Head from 'next/head';
import MinisUnified from '@components/MinisUnified';
import { useDispatch } from 'react-redux';
import { setLoginStatus } from '@store/actions/userActions';

const HomePage = () => {
  const dispatch = useDispatch();

  // Set login status when component mounts
  useEffect(() => {
    dispatch(setLoginStatus(false));
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Tech Minis - Personalized Tech News & Career Insights</title>
        <meta name="description" content="Get personalized bite-sized tech news, career insights, and industry updates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <MinisUnified urlType="MINIS_ARTICLES" />
      </main>
    </>
  );
};

export default HomePage;
