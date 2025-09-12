import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import savedIcon from '@src/resources/images/savedIcon.png';
import HlsPlayer from '@src/components/NaukriMinis/MinisVideo/components/hlsPlayer';

const HLSPlayerWrapper = ({
    feedItem,
    observer,
    styles,
    onItemClick,
    isSavedTab,
    index,
    isHlsPlayerVisible,
    onTimeUpdateCallBack,
    renderPlayerShimmer,
    onSavedItemClick,
    currPlayingIndex,
    isThumbnailsVisible
}) => {
    const tuple = useRef(null);
    useEffect(() => {
        observer.current.observe(tuple.current);
    }, []);

    const videoProps = useMemo(() => ({
        // this props will directly adds to Video Tag
        src: feedItem.content?.streaming_url,
        width: '100%',
        loop: true,
        height: '100%',
        id: `player-${index}`,
        playsInline: true,
        loop: true,
        autoPlay: true,
        muted: true,
        className: styles.carouselVideo,
        onTimeUpdate: onTimeUpdateCallBack

    }), [
        feedItem?.content?.streaming_url,
        onTimeUpdateCallBack
    ]);


    const hlsConfig = useMemo(() => ({
        maxMaxBufferLength: 1
    }), []);

    return (
        <div
            key={index}
            ref={tuple}
            data-id={index}
            data-source-id={feedItem?.metadata?.content_id}
            onClick={e => onItemClick(e, feedItem, index)}
            className={`${styles.feedItem}`}>
            {isSavedTab && (
                <div className={`${styles.savedIcon}`}>
                    <img
                        src={savedIcon}
                        alt='saved'
                        name='unSave'
                        height='20'
                        width='20'
                        onClick={e => onSavedItemClick(e, feedItem)}
                    />
                </div>
            )}
            {isHlsPlayerVisible ? (
                <>
                    {/* <div className={`${styles.title} typ-11Bold`}>{feedItem.content?.caption}</div> */}
                    <HlsPlayer
                        videoProps={videoProps}
                        poster={feedItem.content?.thumbnail_url}
                        //   videoContent={videoContent}
                        // autoPlay={currentPlayingIdx == idx} // autoPlay in iphones will open videos in full screen mode with controls
                        // loadVideoResource = {loadedVideoIdx.includes(idx)}
                        hlsConfig={hlsConfig}
                        // customHlsConfig={{
                        //   loadNFragment:1,
                        // }}
                        renderPlayerShimmer={renderPlayerShimmer}
                        // onClick={e => onVideClick(e)}
                    />
                    {currPlayingIndex !== index && (
                        <img
                            src={feedItem.content?.thumbnail_url}
                            alt="Poster"
                            className={styles.poster}
                        />
                    )}
                </>
            ) : (
                isThumbnailsVisible ? (
                    <>
                        <img
                            src={feedItem.content?.thumbnail_url}
                            alt="Poster"
                            className={styles.poster}
                        />
                    </>
                ):(
                    renderPlayerShimmer()
                )
            )}
        </div>
    );
};

export default HLSPlayerWrapper;
