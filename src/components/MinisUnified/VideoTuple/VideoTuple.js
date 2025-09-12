// import React, { useRef, useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import styles from './VideoTuple.module.scss';
// import {
//     MINIS_UNIFIED_PLAYED_VID,
//     MINIS_UNIFIED_VIDEO_RESUME,
//     UNIFIED_SCROLL_POSITION
// } from '@src/components/MinisUnified/constants';
// import {
//     setItemInSS,
//     createVideoPlayerUrl,
//     addPlayerControlEvent,
//     addCurrentPlayerVidInStorage,
//     getCurrentPlayerVidData
// } from '@src/components/MinisUnified/utils';
// import { redirectToAppPage } from '@src/components/NaukriMinis/utils';
// import InteractionBar from '@src/components/MinisUnified/common/InteractionBar/InteractionBar';
// import { formatTimeStamp } from '@src/components/MinisUnified/utils';
// import VideoPlayer from './VideoPlayer';
// import { isBrowser } from '@src/utils';
// import useRouteToUrlHook from '@customHooks/router';
// import { useRouter } from 'next/router';
// import verifiedVendorLogo from '@src/resources/images/news/verifiedIcon.svg';
// import SubscriptionButton from '@src/components/MinisUnified/components/SubscriptionButton';
// import { TOGGLE_VIDEO_AUDIO } from '../store';
// const VideoTuple = ({
//     feedData,
//     likeIcon,
//     shareIcon,
//     bookmarkIcon,
//     reactionIcon,
//     onLike,
//     onShare,
//     onBookmark,
//     likeCount,
//     shareCount,
//     bookmarkCount,
//     reactions,
//     publishTime,
//     loginDetail,
//     observerInstance,
//     contentType,
//     source_id,
//     insertIntoTimerMap,
//     timerMap,
//     logTupleDuration,
//     handleTupleClick,
//     continuationId,
//     contentId,
//     handleUBAonClick,
//     tuplesViewedArrRef,
//     tuplesViewedContentIdArrRef,
//     publisher,
//     slug,
//     url,
//     title,
//     articlePositon,
//     tupleMetaInfo,
//     setTupleMetaInfo,
//     askSignInOnInteraction
// }) => {
//     const videoRef = useRef(null);
//     const routeTo = useRouteToUrlHook();
//     const router = useRouter();
//     const queryParams = router.query;
//     const { saved } = queryParams;

//     const dispatch = useDispatch();

//     const currentVideoTime = useRef({ currentTime: 0, totalDuration: 0 });
//     const [autoPlay, setAutoPlay] = useState(false);
//     const [showMore, setShowMore] = useState(false);

//     const [logoError, setLogoError] = useState(false);
//     // const [isMute, setIsMute] = useState(true);

//     const isMute = useSelector(state => state.minisUnified.isMuted);
//     const hasIntersected = useRef(false);

//     const isMuteRef = useRef(isMute);
//     useEffect(() => {
//         isMuteRef.current = isMute;
//     }, [isMute]);

//     const handleVidResume = e => {
//         const vidStorageData = getCurrentPlayerVidData(MINIS_UNIFIED_PLAYED_VID);
//         if (vidStorageData) {
//             const stored_id = vidStorageData.source_id;
//             if (stored_id == source_id) {
//                 setAutoPlay(true);
//             }
//         }
//     };

//     useEffect(() => {
//         window.addEventListener(MINIS_UNIFIED_VIDEO_RESUME, handleVidResume);
//     }, []);

//     useEffect(() => {
//         if (feedData?.content?.caption?.length > 36) {
//             setShowMore(true);
//         }
//     }, [feedData?.content?.caption?.length]);

//     const options = {
//         root: null,
//         threshold: [0, 0.2, 0.5, 0.8, 1]
//     };

//     const updateMuteStatus = newMuteStatus => {
//         // console.log("new mute status" , newMuteStatus)
//         addPlayerControlEvent(newMuteStatus);
//         dispatch({
//             type: TOGGLE_VIDEO_AUDIO,
//             payload: {
//                 status: newMuteStatus
//             }
//         });
//     };

//     const handleIntersect = entries => {
//         entries.forEach(entry => {
//             const visibleRatio = entry.intersectionRatio;
//             // if(visibleRatio >= 0.5){
//             //   setAutoPlay(true)
//             // }
//             // else if(visibleRatio < 0.9){
//             //     console.log("visboe , " ,visibleRatio)
//             //     setAutoPlay(false)
//             // }
//             if (visibleRatio < 0.8) {
//                 setAutoPlay(false);
//             } else {
//                 setAutoPlay(true);
//             }

//             if (
//                 entry.isIntersecting &&
//                 entry.target.dataset['articleid'] &&
//                 !hasIntersected.current
//             ) {
//                 insertIntoTimerMap(entry);
//                 if (!tuplesViewedArrRef.includes(entry.target.dataset['articleid'])) {
//                     tuplesViewedArrRef.push(entry.target.dataset['articleid']);
//                     tuplesViewedContentIdArrRef.push(entry.target.dataset['contentid']);
//                 }
//                 hasIntersected.current = true;
//             } else if (!entry.isIntersecting && timerMap.has(entry.target.dataset['articleid'])) {
//                 logTupleDuration(entry.target.dataset['articleid']);
//                 hasIntersected.current = false;
//                 // setAutoPlay(false)
//             }
//         });
//     };

//     const videoObserverRef = useRef(
//         isBrowser() ? new IntersectionObserver(handleIntersect, options) : null
//     );

//     useEffect(() => {
//         if (videoObserverRef.current) {
//             videoObserverRef.current.observe(videoRef.current);
//         }
//     }, []);

//     const onItemClick = (feedItem, { ...args }) => {
//         // let { url } = feedItem?.content;
//         // if (url) {
//         //     const currentTime = (currentVideoTime?.current?.currentTime || 0) * 1000 ;
//         //     url += `?seekTime=${currentTime}`;
//         //     let obj = {
//         //         scrollPos: window.scrollY,
//         //         url: window.location.href
//         //     };
//         //     setItemInSS(UNIFIED_SCROLL_POSITION, JSON.stringify(obj));
//         //     // window.location.href = url;
//         handleTupleClick(source_id, contentId);
//         //     routeTo({url: url, softLoad: false});
//         //     return;
//         // }

//         const isAskSignInOnInteraction = askSignInOnInteraction?.();

//         if (isAskSignInOnInteraction) {
//             return;
//         }


//         const currentTime = (currentVideoTime?.current?.currentTime || 0) * 1000;

//         let obj = {
//             scrollPos: window.scrollY,
//             url: window.location.href
//         };
//         setItemInSS(UNIFIED_SCROLL_POSITION, JSON.stringify(obj));

//         //  const {url} = feedItem?.content;
//         addCurrentPlayerVidInStorage(MINIS_UNIFIED_PLAYED_VID, source_id);
//         const { caption } = feedItem?.content;
//         // let videoFullScreenUrl = createUrlWithQueryParams(url, {seekTime: currentTime , continuationId: continuationId});
//         let videoFullScreenUrl = createVideoPlayerUrl(
//             slug || caption,
//             source_id,
//             null,
//             continuationId,
//             {
//                 seekTime: currentTime,
//                 mute: isMuteRef.current,
//                 isCaptionExpanded: args?.showMore || false
//             }
//         );
//         // videoFullScreenUrl = videoFullScreenUrl.replace("http://homepage.test2.sumit-verma-test2.cluster.infoedge.com/" , "/")
//         // navigateToPage(videoFullScreenUrl, router);
//         if (saved) {
//             videoFullScreenUrl += videoFullScreenUrl.includes('?')
//                 ? `&size=1&saved=true&filters=saved`
//                 : '?size=1&saved=true&filters=saved';
//         }

//         setAutoPlay(false);

//         redirectToAppPage(videoFullScreenUrl, () => {
//             routeTo({
//                 url: videoFullScreenUrl,
//                 softLoad: true,
//                 preserveNavBarParam: true,
//                 preserveUtmParams: true
//             });
//         });
//     };

//     const updateCurrentTimeRef = payload => {
//         // console.log(payload)

//         let metaInfo = { ...tupleMetaInfo };
//         metaInfo[contentType][source_id] = {
//             totalDuration: payload.totalDuration,
//             watchedDuration: payload.currentTime
//         };
//         setTupleMetaInfo(metaInfo);
//         currentVideoTime.current = {
//             currentTime: payload.currentTime,
//             totalDuration: payload.totalDuration
//         };
//     };

//     const renderDynamicInitials = name => {
//         if (name) {
//             const initials = name?.trim()?.split(' ');
//             const firstName = initials?.[0] || '';
//             const lastName = initials?.[1] || '';
//             const fullName = (firstName?.[0] || '') + (lastName?.[0] || '');
//             return fullName || ' ';
//         }

//         return '';
//     };

//     const renderShowMore = () =>
//         showMore ? (
//             <>
//                 ...
//                 <button
//                     className={styles.seeMore}
//                     onClick={() => {
//                         onItemClick(feedData, { showMore });
//                     }}>
//                     {' '}
//                     See more
//                 </button>
//             </>
//         ) : (
//             ''
//         );

//     return (
//         <div
//             className={styles.videoTuple}
//             ref={videoRef}
//             data-articleid={source_id}
//             data-contentid={contentId}
//             data-contenttype={contentType}
//             data-articleposition={articlePositon}>
//             <div className={styles.publisherInfo}>
//                 <div className={styles.publisherInfoWrapper}>
//                     <div className={styles.publisherLogoContainer}>
//                         {publisher.logo ? (
//                             <img
//                                 src={publisher.logo}
//                                 alt={publisher.name}
//                                 className={styles.publisherLogo}
//                                 onError={() => setLogoError(true)}
//                             />
//                         ) : (
//                             <div className={styles.dummyLogo}>
//                                 {renderDynamicInitials(publisher?.name)}
//                             </div>
//                         )}
//                     </div>
//                     <div className={styles.publisherInfoContainer}>
//                         {publisher?.name && (
//                             <div className={styles.publisherName}>
//                                 {publisher.name}
//                                 {publisher?.verified && (
//                                     <img
//                                         src={verifiedVendorLogo}
//                                         alt='verified vendor'
//                                         className={styles['verifiedVendorLogo']}
//                                         width={14}
//                                         height={14}
//                                     />
//                                 )}
//                             </div>
//                         )}
//                         {publishTime && (
//                             <div className={styles.publishTime}>
//                                 {formatTimeStamp(publishTime)}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <SubscriptionButton
//                     articleSourceId={publisher?.id}
//                     articleSourceName={publisher?.name}
//                     contentId={contentId}
//                     handleUBAonClick={handleUBAonClick}
//                     sourceId={source_id}
//                     isSubscribed={publisher?.isSubscribed}
//                     isSubscribeAllowed={publisher?.isSubscribeAllowed}
//                     containerClassName=''
//                     buttonClassName=''
//                 />
//             </div>

//             <div className={styles.videoContainer}>
//                 <VideoPlayer
//                     videoContent={feedData}
//                     currPlayingIndex={0}
//                     isMute={isMute}
//                     mappedIsVideoPaused={() => {
//                         // onItemClick(feedData);
//                     }}
//                     onVideoInteraction={() => {
//                         onItemClick(feedData);
//                     }}
//                     onMute={() => {
//                         updateMuteStatus(!isMute);
//                         // setIsMute(!isMute)
//                     }}
//                     showGesture={false}
//                     videoPosition={0}
//                     autoPlay={autoPlay}
//                     updateCurrentTimeRef={payload => updateCurrentTimeRef(payload)}
//                 />
//             </div>
//             <div className={styles.interactionBarContainer}>
//                 <div className={styles.caption}>
//                     {feedData?.content?.caption?.substring(0, 36) || ''}
//                     {renderShowMore()}
//                 </div>
//                 <InteractionBar
//                     likeIcon={likeIcon}
//                     shareIcon={shareIcon}
//                     bookmarkIcon={bookmarkIcon}
//                     reactionIcon={reactionIcon}
//                     onLike={onLike}
//                     onShare={onShare}
//                     onBookmark={onBookmark}
//                     likeCount={likeCount}
//                     shareCount={shareCount}
//                     bookmarkCount={bookmarkCount}
//                     reactions={reactions}
//                     loginDetail={loginDetail}
//                     url={url}
//                     title={title}
//                 />
//             </div>
//         </div>
//     );
// };

// export default VideoTuple;
