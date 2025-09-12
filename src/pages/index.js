import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to minis page
    router.push('/minis');
  }, [router]);

  return (
    <>
      <Head>
        <title>Tech Minis - Redirecting...</title>
        <meta name="description" content="Redirecting to Tech Minis..." />
      </Head>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Redirecting to Tech Minis...
      </div>
    </>
  );
};

export default HomePage;
