import React, { useState, useRef, useEffect } from 'react';
import styles from './ArticleCard.module.scss';
import {
    createMinisArticlePlayerUrl,
    createSlidePlayerUrl,
    createUrlWithQueryParams,
    formatTimeStamp,
    getQueryObj,
    redirectToAppPage,
    setItemInSS
} from '../../../utils';
import InteractionBar from '../InteractionBar/InteractionBar';
import useRouteToUrlHook from '../hooks/useRouteToUrlHook';
import { CONTENT_TYPES, DEFAULT_COMP_URL, UNIFIED_SCROLL_POSITION } from '../constants';
import { useRouter } from 'next/router';
import { navigateToPage } from '../../../utils';
import Tag from '../Tag/Tag';
import SubscriptionButton from '../SubscriptionButton/SubscriptionButton';

import right_arrow from '../../../resources/images/right-arrow.png';
import verifiedVendorLogo from '../../../resources/images/news/verifiedIcon.svg';


const ArticleCard = ({
    images,
    backgroundUrl,
    isWebStory,
    isMeme,
    likeIcon,
    shareIcon,
    bookmarkIcon,
    reactionIcon,
    onLike,
    onShare,
    onBookmark,
    likeCount,
    shareCount,
    bookmarkCount,
    reactions,
    loginDetail,
    observerInstance,
    isArticle,
    contentType,
    handleUBAonClick,
    handleTupleClick,
    continuationId,
    content,
    articlePositon,
    publisher,
    tupleMetaInfo,
    setTupleMetaInfo,
    askSignInOnInteraction
}) => {
    const {
        source_id: key,
        vendor_created_at: publishTime,
        title,
        description,
        media_url: image,
        source_id,
        url,
        content_id: contentId,
        caption,
        channel_ids,
        slug
    } = content;
    const category = content?.curated_tags?.[0] || content.tags?.[0] || null;

    const [currentLikeIcon, setCurrentLikeIcon] = useState(likeIcon);
    const [currentBookmarkIcon, setCurrentBookmarkIcon] = useState(bookmarkIcon);
    const [logoError, setLogoError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const tupleRef = useRef(null);
    const router = useRouter();
    const queryParams = router.query;
    const saved = queryParams?.saved;
    const slideContainerRef = useRef(null);

    useEffect(() => {
        if (caption?.length > 36 && !isMeme) {
            setShowMore(true);
        }
    }, [caption?.length]);

    const handleTupleMetaInfo = slideNum => {
        let metaInfo = { ...tupleMetaInfo };
        let tupleInfo = metaInfo?.[contentType]?.source_id || {};
        if (Object.keys(tupleInfo).length == 0) {
            metaInfo[contentType][source_id] = {};
        }

        tupleInfo = {
            watchedSlides: Math.max(tupleInfo?.watchedSlides || 0, slideNum + 1),
            totalSlides: images.length || 0
        };
        metaInfo[contentType][source_id] = { ...tupleInfo };

        setTupleMetaInfo(metaInfo);
    };

    useEffect(() => {
        const container = slideContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const item = container.querySelector(`.${styles.slideCard}`);
            if (item) {
                const itemStyle = getComputedStyle(item);
                const itemMarginRight = parseInt(itemStyle.marginRight || '0');
                const itemWidth = item.offsetWidth + itemMarginRight;
                const exact = scrollLeft / itemWidth;
                const scrolled = Math.floor(exact + 0.5);
                handleTupleMetaInfo(scrolled);
            }
        };
        if (contentType == CONTENT_TYPES.WEB_STORY) {
            handleScroll();
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (contentType == CONTENT_TYPES.WEB_STORY) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        if (observerInstance) {
            observerInstance.observe(tupleRef.current);
        }
    }, []);

    // Update icons when props change
    useEffect(() => {
        setCurrentLikeIcon(likeIcon);
        setCurrentBookmarkIcon(bookmarkIcon);
    }, [likeIcon, bookmarkIcon]);

    const routeTo = useRouteToUrlHook();

    const handleCardClick = e => {
        if (isMeme || isWebStory) {
            return;
        }
        // Don't open full article if clicking on interaction buttons
        if (e?.target?.closest(`.${styles.interactions}`)) {
            return;
        }
        if (isArticle) {
            handleTupleClick(source_id, contentId, content?.highlight_details?.value);

            const isAskSignInOnInteraction = askSignInOnInteraction?.();

            if (isAskSignInOnInteraction) {
                return;
            }

            let url = createMinisArticlePlayerUrl(slug || title, source_id, continuationId, null);
            if (saved) {
                url += url.includes('?')
                    ? `&size=1&saved=true&filters=saved`
                    : `?size=1&saved=true&filters=saved`;
            }
            let obj = {
                scrollPos: window.scrollY,
                url: window.location.href
            };
            setItemInSS(UNIFIED_SCROLL_POSITION, JSON.stringify(obj));
            routeTo({
                url: url,
                softLoad: true,
                preserveNavBarParam: true,
                preserveUtmParams: true
            });
        }
    };

    const handleLike = e => {
        e.stopPropagation();
        onLike();
        // Toggle the like icon
        setCurrentLikeIcon(
            currentLikeIcon.includes('liked_unified')
                ? currentLikeIcon.replace('liked_unified', 'like_unified')
                : currentLikeIcon.replace('like_unified', 'liked_unified')
        );
    };

    const handleBookmark = e => {
        e.stopPropagation();
        onBookmark();
        // Toggle the bookmark icon
        setCurrentBookmarkIcon(
            currentBookmarkIcon.includes('bookmarked_unified')
                ? currentBookmarkIcon.replace('bookmarked_unified', 'bookmark_unified')
                : currentBookmarkIcon.replace('bookmark_unified', 'bookmarked_unified')
        );
    };

    const handleSlideClick = (index, args) => {
        handleTupleClick(source_id, contentId);

        const isAskSignInOnInteraction = askSignInOnInteraction?.();

        if (isAskSignInOnInteraction) {
            return;
        }

        let redirectUrl = createSlidePlayerUrl(caption, source_id, index, continuationId, {
            slideIndex: index,
            isCaptionExpanded: args?.showMore || false
        });

        let obj = {
            scrollPos: window.scrollY,
            url: window.location.href
        };
        if (saved) {
            redirectUrl += redirectUrl.includes('?')
                ? `&size=1&saved=true&filters=saved`
                : `?size=1&saved=true&filters=saved`;
        }
        setItemInSS(UNIFIED_SCROLL_POSITION, JSON.stringify(obj));
        redirectToAppPage(redirectUrl, () => {
            routeTo({
                url: redirectUrl,
                softLoad: true,
                preserveNavBarParam: true,
                preserveUtmParams: true
            });
        });
    };

    const renderSlidesCard = () => {
        const handleImageLoad = e => {
            e.target.classList.add(styles.loaded);
        };

        return (
            <div className={styles.slidesCardContainer} ref={slideContainerRef}>
                {(images || []).map((image, index) => (
                    <div
                        className={styles.slideCard}
                        key={index}
                        style={{
                            backgroundImage: `url(${backgroundUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        onClick={() => handleSlideClick(index)}>
                        <img
                            src={image}
                            alt={`${title} - Slide ${index + 1}`}
                            className={styles.slideImage}
                            loading='lazy'
                            onLoad={handleImageLoad}
                        />
                        <div className={styles.slideNumber}>
                            {index + 1}/{images.length}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderShowMore = () =>
        showMore ? (
            <>
                ...
                <button
                    className={styles.seeMore}
                    onClick={() => handleSlideClick(0, { showMore: true })}>
                    {' '}
                    See more
                </button>
            </>
        ) : (
            ''
        );

    const defaultImageOnError = (event, defaultImg) => {
        const target = event.target;
        if (target && !target.getAttribute('isErrored')) {
            target.src = defaultImg;
            target.setAttribute('isErrored', true);
        }
    };

    const renderDynamicInitials = name => {
        if (!name) return ' ';
        const initials = name?.trim()?.split(' ');
        const firstName = initials?.[0] || '';
        const lastName = initials?.[1] || '';
        const fullName = (firstName?.[0] || '') + (lastName?.[0] || '');
        return fullName || ' ';
    };

    const isTagVisible = isArticle && !!content?.highlight_details;
        
    return (
        <>
            <div
                className={`${styles.articleCard} ${isWebStory ? styles.webStoryCard : ''}`}
                ref={tupleRef}
                data-articleid={source_id}
                data-contentid={contentId}
                data-articleposition={articlePositon}
                data-contenttype={contentType}
                onClick={handleCardClick}>
                {isTagVisible && (
                    <Tag wrapperClass={styles.tags} tagInfo={content?.highlight_details} />
                )}
                <div className={styles.publisherInfo}>
                    <div className={styles.publisherInfoWrapper}>
                        <div className={styles.publisherLogoContainer}>
                            {publisher.logo && !logoError ? (
                                <img
                                    src={publisher.logo}
                                    alt={publisher.name}
                                    className={styles.publisherLogo}
                                    onError={e => {
                                        e.target.setAttribute('isErrored', true);
                                        setLogoError(true);
                                    }}
                                />
                            ) : null}

                            {((publisher?.name && logoError) ||
                                (!logoError && !publisher?.logo && publisher?.name)) && (
                                <div className={styles.dummyLogo}>
                                    {renderDynamicInitials(publisher?.name)}
                                </div>
                            )}
                        </div>
                        <div className={styles.publisherInfoContainer}>
                            {publisher?.name ? (
                                <div className={styles.publisherName}>
                                    {publisher.name}
                                    {publisher?.verified && (
                                        <img
                                            src={verifiedVendorLogo}
                                            alt='verified vendor'
                                            className={styles['verifiedVendorLogo']}
                                            width={14}
                                            height={14}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className={styles.dummyLogo}>
                                    {renderDynamicInitials('')}
                                </div>
                            )}
                            {publishTime && (
                                <div className={styles.publishTime}>
                                    {formatTimeStamp(publishTime)}
                                </div>
                            )}
                        </div>
                    </div>
                    {!isTagVisible && (
                        <SubscriptionButton
                            articleSourceId={publisher?.id}
                            articleSourceName={publisher?.name}
                            contentId={contentId}
                            handleUBAonClick={handleUBAonClick}
                            sourceId={content?.source_id}
                            isSubscribed={publisher?.isSubscribed}
                            isSubscribeAllowed={publisher?.isSubscribeAllowed}
                            containerClassName=''
                            buttonClassName=''
                        />
                    )}
                </div>
                {isWebStory ? (
                    renderSlidesCard()
                ) : (
                    <div
                        className={`${styles.imageContainer} ${
                            isMeme ? styles.memeImageContainer : ''
                        }`}>
                        <img
                            src={image || DEFAULT_COMP_URL + `/${channel_ids?.[0]}.png`}
                            alt='article image'
                            className={`
                    ${isArticle ? styles.articleImage : ''}
                    ${isMeme ? styles.memeImage : ''} 
                    ${styles.fadeImage} 
                    ${loaded ? styles.loaded : ''}
                `}
                            onError={e => {
                                defaultImageOnError(
                                    e,
                                    DEFAULT_COMP_URL + `/${channel_ids?.[0]}.png`
                                );
                            }}
                            onLoad={() => setLoaded(true)}
                        />
                    </div>
                )}

                <div className={styles.articleInfoContainer}>
                    {isArticle ? (
                        <div className={styles.articleInfo}>
                            {category && <div className={styles.category}>{category}</div>}

                            <h2
                                className={styles.title}
                                dangerouslySetInnerHTML={{ __html: title }}></h2>
                            <div className={styles.readMore}>
                                <div className={styles.read__text}>Read more </div>
                                <div className={styles.img__read}>
                                    {/* <img
                                        src={right_arrow}
                                        alt='right_arrow'
                                        width={10}
                                        height={10}
                                    />{' '} */}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.memeInfo}>
                            <p className={styles.memeCaption}>
                                {caption?.length > 36 && !isMeme
                                    ? caption?.substring(0, 36)
                                    : caption}
                                {renderShowMore()}
                            </p>
                        </div>
                    )}
                    <InteractionBar
                        likeIcon={currentLikeIcon}
                        shareIcon={shareIcon}
                        bookmarkIcon={currentBookmarkIcon}
                        reactionIcon={reactionIcon}
                        onLike={handleLike}
                        onShare={onShare}
                        onBookmark={handleBookmark}
                        likeCount={likeCount}
                        shareCount={shareCount}
                        bookmarkCount={bookmarkCount}
                        reactions={reactions}
                        loginDetail={loginDetail}
                        title={title}
                        url={url}
                    />
                </div>
            </div>
        </>
    );
};

export default ArticleCard;