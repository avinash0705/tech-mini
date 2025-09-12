import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TagSelector from '@components/TagSelector/TagSelector';
import MinisUnified from '@components/MinisUnified';
import { useDispatch } from 'react-redux';
import { setLoginStatus } from '@store/actions/userActions';

const HomePage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFeed, setShowFeed] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Set login status when component mounts
  useEffect(() => {
    dispatch(setLoginStatus(false));
  }, [dispatch]);

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleViewFeed = () => {
    if (selectedTags.length > 0) {
      setShowFeed(true);
      // Update URL to include selected tags
      const tagsParam = selectedTags.join(',');
      router.push(`/?tags=${encodeURIComponent(tagsParam)}`, undefined, { shallow: true });
    }
  };

  const handleBackToSelector = () => {
    setShowFeed(false);
    router.push('/', undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>Tech Minis - Personalized Tech News & Career Insights</title>
        <meta name="description" content="Choose your interests and get personalized bite-sized tech news, career insights, and industry updates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {!showFeed ? (
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
            onViewFeed={handleViewFeed}
          />
        ) : (
          <div>
            {/* Header with selected tags and back button */}
            <div style={{
              background: 'white',
              padding: '15px 20px',
              borderBottom: '1px solid #e0e6ed',
              position: 'sticky',
              top: 0,
              zIndex: 100
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <button
                  onClick={handleBackToSelector}
                  style={{
                    background: 'transparent',
                    border: '1px solid #3498db',
                    color: '#3498db',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Change Topics
                </button>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '6px',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: '#7f8c8d',
                    marginRight: '8px'
                  }}>
                    Showing: 
                  </span>
                  {selectedTags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#ebf3fd',
                        color: '#2980b9',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {selectedTags.length > 3 && (
                    <span style={{
                      background: '#ecf0f1',
                      color: '#7f8c8d',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      +{selectedTags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Feed Content */}
            <MinisUnified 
              urlType="MINIS_ARTICLES" 
              selectedTags={selectedTags}
            />
          </div>
        )}
      </main>
    </>
  );
};

export default HomePage;
