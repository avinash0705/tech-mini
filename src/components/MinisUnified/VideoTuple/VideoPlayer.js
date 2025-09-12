import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import HlsPlayer from './hlsPlayer';
import CustomProgressBar from './progressBar/progressBar';
import muteIcon from '@src/resources/images/news/mute-unified.svg';
import speakerIcon from '@src/resources/images/news/unmute_unified.svg';
import playIcon from '@src/resources/svg/videoPlayerIcons/playIcon.svg';
import styles from './videoPlayer.module.scss';
import swipeGestureGif from '@src/resources/images/swipeGesture.gif';
import { useRouter } from 'next/router';
import SpinnerLoader from '@src/components/common/SpinnerLoader/SpinnerLoader';
import { useSelector } from 'react-redux';

const VideoPlayer = props => {
    let { content = {}, metadata = {} } = props.videoContent,
        {
            behavioral_data = {},
            caption = '',
            title = '',
            streaming_url,
            thumbnail_url,
            url = '',
            source_info,
            vendor_created_at
        } = content;

    const router = useRouter();
    const queryParams = router.query;
    const continuationId = queryParams?.continuationId;
    const playerRef = useRef(null);
    const loginDetail = useSelector(state => state.ssr_loginDetails);
    const isAskingSignIn = useSelector(state => state.minisUnified.showAskSignInModal);
    const { isLoggedIn } = loginDetail;
    const [hidePlayerInfo, setHidePlayerInfo] = useState(false);

    useEffect(() => {
        if (props.autoPlay) {
            playerRef?.current?.play();
        } else {
            playerRef?.current?.pause();
        }
    }, [props.autoPlay]);

    const onLoadedMetadata = useCallback(e => {
        // setDuration(e.currentTarget.duration);
        props.mappedIsVideoPaused(false);
    }, []);

    const togglePlayPause = useCallback(
        async e => {
            props.onVideoInteraction();
        },
        [props.videoPosition, props.pageIndex]
    );

    const muteVideo = () => {
        playerRef.current.muted = !props.isMute;
        props.onMute();
    };

    // Memoize the videoProps
    const videoProps = useMemo(
        () => ({
            src: streaming_url,
            width: '100%',
            loop: true,
            height: '100%',
            className: styles['video'],
            // onTimeUpdate: onTimeUpdate,
            onClick: togglePlayPause,
            muted: isAskingSignIn || props.isMute,
            onLoadedMetadata: onLoadedMetadata,
            autoPlay: props.autoPlay || false
        }),
        [streaming_url, props.isMute, props.autoPlay, isAskingSignIn]
    );

    const renderPlayerLoader = useCallback(() => {
        return <SpinnerLoader backgroundColor='none' />;
    }, []);

    const hlsConfig = useMemo(
        () => ({
            // startLevel: -1,
            maxMaxBufferLength: 5
        }),
        []
    );

    const onInteraction = async isActive => {
        if (props.currentVideoPos === props.videoPosition) {
            if (isActive) {
                playerRef.current.pause();
            } else {
                !props.isVideoPaused && playerRef.current.play();
            }
            setHidePlayerInfo(isActive);
        }
    };

    // let seoTitle = SEO_TAGS.VIDEO_PLAYER.title.replace('<captions>', caption),
    //     desc = SEO_TAGS.VIDEO_PLAYER.desc.replace('<captions>', caption).replace('<title>', title);

    return (
        <>
            <HlsPlayer
                videoProps={videoProps}
                playerRef={playerRef}
                poster={thumbnail_url}
                hlsConfig={hlsConfig}
                // videoPosition={props.videoPosition}
                // customHlsConfig={
                //     {
                //         // loadNFragment:1,
                //     }
                // }
                // renderPlayerLoader={renderPlayerLoader}
            />
            <div className={styles['videoContent']}>
                {/* <div className={styles['threeDotsIconContainer']}>
                    <img className={`${styles.icon} ${styles.threeDotsIcon}`} src={threeDotsIcon}></img>  
                </div> */}

                {!hidePlayerInfo && (
                    <>
                        {props.isVideoPaused && (
                            <div
                                className={styles['iconContainer']}
                                onClick={() => {
                                    togglePlayPause(playerRef.current);
                                }}>
                                <img
                                    className={`${styles.icon} ${styles.playIcon}`}
                                    src={playIcon}
                                    alt={playIcon}
                                />
                            </div>
                        )}
                        <div className={styles['bottom_right_icons']}>
                            <div className={styles['iconContainer']} onClick={muteVideo}>
                                <img
                                    className={`${styles.icon} ${styles.volIcon}`}
                                    src={props.isMute ? muteIcon : speakerIcon}
                                    alt={'mute icon'}
                                />
                            </div>
                        </div>
                    </>
                )}
                <div className={styles['infoContainer']}>
                    {!hidePlayerInfo && (
                        <>
                            {props.showGesture && (
                                <div className={styles['swipeGesture']}>
                                    <div className={styles['circle']}>
                                        <img
                                            className={styles['gestureBox']}
                                            src={swipeGestureGif}
                                            alt={'swipe gif icon'}
                                        />
                                    </div>
                                    <div className={styles['info']}>
                                        Swipe up to move to the next video
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <CustomProgressBar
                        customClass={styles['customProgressBarContainer']}
                        playerRef={playerRef}
                        updateCurrentTimeRef={payload => {
                            props.updateCurrentTimeRef(payload);
                        }}
                        onInteraction={onInteraction}
                        // handleViewTracking={() =>
                        //     props.handleViewTracking({
                        //         currentTarget: playerRef.current
                        //     })
                        // }
                    />
                </div>
            </div>
        </>
    );
};
export default VideoPlayer;
