import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { fetchUnifiedFeed } from './store/actions';
import styles from './MinisUnified.module.scss';
import useRouteToUrlHook from './hooks/useRouteToUrlHook';
import { isBrowser } from '../../utils';
import {
    UNIFIED_LS_KEY,
    UNIFIED_SCROLL_POSITION,
    metaInfoSchema,
    noResultText
} from './constants';
import ArticleShimmer from './Shimmers/ArticleShimmer';
import SeoMetaTags from './SeoMetaTags/SeoMetaTags';
import MinisErrorScreen from './MinisErrorScreen/MinisErrorScreen';
import MinisEmptyScreen from './MinisEmptyScreen/MinisEmptyScreen';
import ArticleCard from './ArticleCard/ArticleCard';
import VideoTuple from './MinisVideo/VideoTuple';
import KeepBrowsingCard from './KeepBrowsingCard/KeepBrowsingCard';
import {
    getLikesData,
    saveLikesData,
    shareUrl,
    setItemInSS,
    formatTimeStamp
} from '../../utils';

// Import icons
const LikeIcon = '/icons/like.svg';
const LikedIcon = '/icons/liked.svg';
const ShareIcon = '/icons/share.svg';
const BookmarkIcon = '/icons/bookmark.svg';
const BookmarkedIcon = '/icons/bookmarked.svg';
const ReactionIcon = '/icons/reaction.svg';

const MinisUnifiedWrapper = props => {
    const { selectedTags = [] } = props; // Accept selectedTags prop
    const router = useRouter();
    const queryParams = router.query;
    const { filters } = queryParams;
    const articleIds = queryParams?.articleIds?.split(',') || [];
    const contentIds = queryParams?.contentIds?.split(',') || [];
    const saved = queryParams?.saved;
    const topType = queryParams?.topType;
    const dispatch = useDispatch();
    
    // For standalone, we'll use simulated login status
    const loginDetail = { isLoggedIn: false, syncDone: true };
    
    // Get the current feed from Redux store
    const workFeed = useSelector(state => state.minisUnified?.workFeed);
    const playFeed = useSelector(state => state.minisUnified?.playFeed);
    const [currentMode, setCurrentMode] = useState('Work');
    
    // Get the current feed based on mode
    const currentFeed = currentMode === 'Play' ? playFeed : workFeed;
    const records = currentFeed?.items?.records || [];
    const hasMore = currentFeed?.hasMore;
    const currentPage = useRef(1);
    const nextPageRef = useRef(1);
    const [loading, setLoading] = useState(false);
    const lastCardRef = useRef(null);
    const tuplesViewedArrRef = useRef([]);
    const tuplesViewedContentIdArrRef = useRef([]);
    const loaderRef = useRef(null);
    const dataFetchedRef = useRef(false);
    const [showKeepExploring, setShowKeepExploring] = useState(false);
    const [filterData, setFilterData] = useState(currentFeed?.filters || []);
    const activeFilter = useRef(null);
    
    const options = {
        root: null,
        threshold: 0.01,
        rootMargin: '0px'
    };

    const routeTo = useRouteToUrlHook();
    const continuationId = useRef(null);
    const [timerMap, setTimerMap] = useState(new Map());
    const isSavedTabSelected = useRef(saved || false);
    const isMute = useSelector(state => state.minisUnified?.isMuted) ?? true;

    const [tupleMetaInfo, setTupleMetaInfo] = useState(metaInfoSchema);

    // Intersection Observer for pagination
    const observerRef = useRef(
        isBrowser()
            ? new IntersectionObserver(entries => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting && hasMore && !loading) {
                         // loadMoreData();
                      }
                  });
              }, options)
            : null
    );

    useEffect(() => {
        if (!dataFetchedRef.current) {
            fetchInitialData();
            dataFetchedRef.current = true;
        }
    }, []);

    // Refetch data when selectedTags change
    useEffect(() => {
        if (dataFetchedRef.current && selectedTags.length > 0) {
            fetchInitialData();
        }
    }, [selectedTags]);

    useEffect(() => {
        if (lastCardRef.current && observerRef.current) {
            observerRef.current.observe(lastCardRef.current);
        }
        return () => {
            if (lastCardRef.current && observerRef.current) {
                observerRef.current.unobserve(lastCardRef.current);
            }
        };
    }, [records]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await dispatch(fetchUnifiedFeed({
                page: 1,
                filters: {
                    mode: currentMode,
                    saved: isSavedTabSelected.current,
                    tags: selectedTags,
                    curated_tags: selectedTags, // Use selected tags from props
                    sourceIds: []
                },
                loginStatus: loginDetail.isLoggedIn,
                articleIds,
                contentIds,
                topType
            }));
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreData = async () => {
        if (loading) return;
        
        setLoading(true);
        nextPageRef.current += 1;
        
        try {
            await dispatch(fetchUnifiedFeed({
                page: nextPageRef.current,
                filters: {
                    mode: currentMode,
                    saved: isSavedTabSelected.current,
                    tags: [],
                    curated_tags: selectedTags, // Use selected tags from props
                    sourceIds: []
                },
                loginStatus: loginDetail.isLoggedIn,
                articleIds,
                contentIds,
                topType
            }));
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTupleClick = (sourceId, contentId, highlightValue) => {
        console.log('Tuple clicked:', { sourceId, contentId, highlightValue });
        // Add tracking logic here
    };

    const handleClickEvent = (sourceId, action) => {
        console.log('Click event:', { sourceId, action });
        // Add UBA tracking logic here
    };

    const insertIntoTimerMap = (entry) => {
        const articleId = entry.target.dataset['articleid'];
        if (articleId && !timerMap.has(articleId)) {
            setTimerMap(prev => new Map(prev.set(articleId, Date.now())));
        }
    };

    const logTupleDuration = (articleId) => {
        if (timerMap.has(articleId)) {
            const startTime = timerMap.get(articleId);
            const duration = Date.now() - startTime;
            console.log(`Article ${articleId} viewed for ${duration}ms`);
            setTimerMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(articleId);
                return newMap;
            });
        }
    };

    // Render individual content items
    const renderContentItem = (record, index) => {
        const content = record.contents?.[0];        
        const metadata = record.metadata;
        const contentType = metadata?.content_type || 'articles';
        
        // Get interaction data
        const interactionCounts = {
            likes: content.interaction_data?.like?.count || 0,
            share: content.interaction_data?.share?.count || 0,
            bookmarks: content.interaction_data?.save?.count || 0,
            views: content.interaction_data?.view?.count || 0
        };

        // Check if user has liked/bookmarked (from localStorage)
        const likesData = getLikesData(UNIFIED_LS_KEY);
        const isLiked = likesData?.likes?.[content.source_id] || false;
        const isBookmarked = likesData?.bookmarks?.[content.source_id] || false;

        // Handle like click
        const handleLikeClick = async () => {
            const newLikeStatus = !isLiked;
            
            // Update localStorage
            let interactionStorageData = getLikesData(UNIFIED_LS_KEY);
            let lsData = interactionStorageData?.likes || {};
            lsData[content.source_id] = newLikeStatus;
            
            saveLikesData(UNIFIED_LS_KEY, {
                likes: lsData,
                bookmarks: { ...interactionStorageData?.bookmarks }
            });

            // Update Redux store (simplified)
            dispatch({
                type: 'UPDATE_FEED_INTERACTION',
                payload: {
                    itemId: content.id,
                    type: 'like',
                    status: newLikeStatus,
                    count: newLikeStatus ? interactionCounts.likes + 1 : Math.max(interactionCounts.likes - 1, 0)
                }
            });

            handleClickEvent(content.source_id, newLikeStatus ? 'like' : 'unlike');
        };

        // Handle bookmark click
        const handleBookmarkClick = async () => {
            const newBookmarkStatus = !isBookmarked;
            
            // Update localStorage
            let interactionStorageData = getLikesData(UNIFIED_LS_KEY);
            let lsData = interactionStorageData?.bookmarks || {};
            lsData[content.source_id] = newBookmarkStatus;
            
            saveLikesData(UNIFIED_LS_KEY, {
                likes: { ...interactionStorageData?.likes },
                bookmarks: lsData
            });

            // Update Redux store (simplified)
            dispatch({
                type: 'UPDATE_FEED_INTERACTION',
                payload: {
                    itemId: content.id,
                    type: 'save',
                    status: newBookmarkStatus,
                    count: newBookmarkStatus ? interactionCounts.bookmarks + 1 : Math.max(interactionCounts.bookmarks - 1, 0)
                }
            });

            handleClickEvent(content.source_id, newBookmarkStatus ? 'save' : 'unsave');
        };

        // Handle share click
        const handleShareClick = async ({ title, url }) => {
            // Update Redux store
            dispatch({
                type: 'UPDATE_FEED_INTERACTION',
                payload: {
                    itemId: content.id,
                    type: 'shares',
                    status: true,
                    count: (interactionCounts.share || 0) + 1
                }
            });

            shareUrl({
                url,
                title,
                utms: {
                    utm_medium: 'unifiedfeed'
                }
            });

            handleClickEvent(content.source_id, 'share');
        };

        const commonCardProps = {
            likeIcon: isLiked ? LikedIcon : LikeIcon,
            shareIcon: ShareIcon,
            bookmarkIcon: isBookmarked ? BookmarkedIcon : BookmarkIcon,
            reactionIcon: ReactionIcon,
            onLike: handleLikeClick,
            onShare: handleShareClick,
            onBookmark: handleBookmarkClick,
            likeCount: interactionCounts.likes ?? 0,
            shareCount: interactionCounts.share ?? 0,
            bookmarkCount: interactionCounts.bookmarks ?? 0,
            reactions: interactionCounts.views ?? 0,
            askSignInOnInteraction: props.askSignInOnInteraction || (() => false)
        };

        switch (contentType) {
            case 'articles':
            case 'web_stories':
            case 'memes':
                return (
                    <ArticleCard
                        key={content.source_id}
                        content={content}
                        images={
                            contentType === 'web_stories'
                                ? content.image_data?.map(img => img.url)
                                : null
                        }
                        publisher={{
                            name: content.source_info?.name || '',
                            logo: content.source_info?.logo || null,
                            verified: content.source_info?.verified || false,
                            id: content.source_info?.id || '',
                            isSubscribed: content?.source_info?.is_subscribed,
                            isSubscribeAllowed: content?.source_info?.is_subscribe_allowed
                        }}
                        backgroundUrl={
                            contentType === 'web_stories' ? content.background_url : undefined
                        }
                        isWebStory={contentType === 'web_stories'}
                        isArticle={contentType === 'articles'}
                        isMeme={contentType === 'memes'}
                        loginDetail={loginDetail}
                        observerInstance={observerRef.current}
                        contentType={contentType}
                        handleUBAonClick={handleClickEvent}
                        handleTupleClick={handleTupleClick}
                        continuationId={continuationId.current}
                        articlePositon={index}
                        tupleMetaInfo={tupleMetaInfo}
                        setTupleMetaInfo={setTupleMetaInfo}
                        {...commonCardProps}
                    />
                );
            case 'reels':
                return (
                    <VideoTuple
                        key={content.source_id}
                        feedData={record}
                        title={content.title}
                        url={content.url}
                        publisher={{
                            name: content.source_info?.name,
                            logo: content.source_info?.logo,
                            verified: content.source_info?.verified || false,
                            id: content.source_info?.id || '',
                            isSubscribed: content?.source_info?.is_subscribed,
                            isSubscribeAllowed: content?.source_info?.is_subscribe_allowed
                        }}
                        publishTime={content.vendor_created_at}
                        loginDetail={loginDetail}
                        observerInstance={observerRef.current}
                        contentType={contentType}
                        source_id={content.source_id}
                        insertIntoTimerMap={insertIntoTimerMap}
                        timerMap={timerMap}
                        logTupleDuration={logTupleDuration}
                        handleTupleClick={handleTupleClick}
                        continuationId={continuationId.current}
                        contentId={content.content_id}
                        handleUBAonClick={handleClickEvent}
                        tuplesViewedArrRef={tuplesViewedArrRef.current}
                        tuplesViewedContentIdArrRef={tuplesViewedContentIdArrRef.current}
                        slug={content.slug}
                        articlePositon={index}
                        tupleMetaInfo={tupleMetaInfo}
                        setTupleMetaInfo={setTupleMetaInfo}
                        {...commonCardProps}
                    />
                );
            default:
                return null;
        }
    };

    const onKeepExploring = () => {
        setShowKeepExploring(false);
        loadMoreData();
        //window.scrollTo({ top: 0, behavior: 'smooth' });
        
    };

    // Loading state
    if (loading && records.length === 0) {
        return (
            <>
                <SeoMetaTags />
                <div className={styles.unifiedContainer}>
                    <div className={styles.newsContainer}>
                        <ArticleShimmer count={5} />
                    </div>
                </div>
            </>
        );
    }

    // Error state
    if (currentFeed?.error) {
        return (
            <>
                <SeoMetaTags />
                <div className={styles.errorPageContainer}>
                    <MinisErrorScreen 
                        error={currentFeed.error} 
                        onRetry={fetchInitialData}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <SeoMetaTags />
            <div className={styles.unifiedContainer}>
                <div className={styles.newsContainer}>
                    {records.length > 0 ? (
                        records.map((record, index) => {
                            const isLastItem = index === records.length - 1;
                            const shouldShowKeepBrowsing = index > 0 && (index + 1) % 10 === 0;
                            
                            return (
                                <React.Fragment key={record.content?.source_id || index}>
                                    <div 
                                        className={styles.newsItem}
                                        ref={isLastItem ? lastCardRef : null}
                                    >
                                        {renderContentItem(record, index)}
                                    </div>
                                    {shouldShowKeepBrowsing && (
                                        <KeepBrowsingCard
                                            onKeepExploring={onKeepExploring}
                                            triggerClickEvent={handleClickEvent}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <MinisEmptyScreen
                            title={noResultText.title}
                            info={noResultText.info}
                            ctaText={noResultText.ctaText}
                            ctaCallback={fetchInitialData}
                        />
                    )}
                    
                    {loading && records.length > 0 && (
                        <div className={styles.shimmerContainer}>
                            <ArticleShimmer count={2} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MinisUnifiedWrapper;
