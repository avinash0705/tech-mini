import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useLogger } from '../../../utils/logger/provider';

const HlsPlayer = React.memo(
    ({
        hlsConfig,
        customHlsConfig = {
            loadNFragment: null,
            fragmentStoped: () => {}
        },
        playerRef = React.createRef(),
        // videoPlayerStopped,
        // videoPlayerPlayed,
        loadVideoResource = true,
        renderPlayerShimmer,
        poster = '',
        renderPlayerLoader = () => {},
        videoProps = {
            src: '',
            controls: false,
            autoPlay: false
        }
    }) => {
        const hlsRef = useRef(null);
        const [isManifestParsed, setIsManifestParsed] = useState(false);
        const [showShimmer, setShowShimmer] = useState(false);
        const [loadedVersions, setLoadedVersions] = useState([]);
        const [buffering, setBuffering] = useState(true);
        const pLogger = useLogger();

        const onManifestParsed = () => {
            // stop video preloading when the manifest has been parsed
            setShowShimmer(false);
            setIsManifestParsed(true);
            if (videoProps.autoPlay) {
                playerRef?.current
                    ?.play()
                    .catch(() =>
                        console.error('Unable to autoplay prior to user interaction with the dom.')
                    );
            }
        };
       

        const onHlsEventError = (event, data) => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
            console.error('inside HLS Error callback ', connection.effectiveType, connection.downlink);
         
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error(
                            'HLS ERROR: fatal network error encountered ',
                            JSON.stringify(data)
                        );
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hlsRef.current.recoverMediaError();
                        break;
                    default:
                        hlsRef.current.destroy();
                        break;
                }
            } else {
                console.error(
                    'HLS ELSE ERROR: fatal network error encountered ',
                    JSON.stringify(data)
                );
            }
        };

        useEffect(() => {
            function _initPlayer() {
                setShowShimmer(true);
                hlsRef?.current?.destroy();

                hlsRef.current = new Hls({
                    enableWorker: true,
                    ...hlsConfig
                });

                if (playerRef.current != null) {
                    hlsRef.current.attachMedia(playerRef.current);
                }

                const onAttachedMedia = () => {
                    if (loadVideoResource) {
                        hlsRef.current.loadSource(videoProps.src);
                    }
                };

                hlsRef.current.once(Hls.Events.MEDIA_ATTACHED, onAttachedMedia);

                hlsRef.current.once(Hls.Events.MANIFEST_PARSED, onManifestParsed);
            }

            // Check for Media Source support
            if (Hls.isSupported()) {
                _initPlayer();
            }

            return () => {
                if (hlsRef.current != null) {
                    hlsRef.current.destroy();
                    hlsRef.current = null;
                }
            };
        }, [loadVideoResource]);

        const handleWaiting = () => setBuffering(true);
        const handlePlaying = () => setBuffering(false);

        useEffect(() => {
            // let fragmentCounter = 0;
            if (videoProps.autoPlay && isManifestParsed) {
                playerRef?.current
                    ?.play()
                    .catch(() =>
                        pLogger.error('Unable to autoplay prior to user interaction with the dom.')
                    );
            }

            playerRef?.current.addEventListener('waiting', handleWaiting);
            playerRef?.current.addEventListener('playing', handlePlaying);

            if (Hls.isSupported()) {
                //     hlsRef.current.on(Hls.Events.LEVEL_UPDATED, function () {
                //         // stop video preloading when the manifest has been parsed
                //         fragmentCounter--;
                //     });

                //     hlsRef.current.on(Hls.Events.FRAG_LOADED, function (e, data) {
                //         // stop video preloading when the manifest has been parsed
                //         const fragmentVersion = data.frag.sn;
                //         setLoadedVersions(prevVersions => [...prevVersions, fragmentVersion]);

                //         fragmentCounter++;
                //         if (customHlsConfig.loadNFragment !== null) {
                //             if (fragmentCounter == customHlsConfig.loadNFragment) hlsRef.current.stopLoad();
                //             customHlsConfig.fragmentStoped(playerRef?.current);
                //         }
                //     });

                hlsRef.current.on(Hls.Events.ERROR, onHlsEventError);
            }

            return () => {
                hlsRef?.current?.off(Hls.Events.ERROR, onHlsEventError);
                playerRef?.current?.removeEventListener('waiting', handleWaiting);
                playerRef?.current?.removeEventListener('playing', handlePlaying);
            };
        }, [hlsConfig, loadedVersions]);

        // If Media Source is supported, use HLS.js to play video
        if (Hls.isSupported())
            return (
                <>
                    {buffering && renderPlayerLoader()}
                    <video
                        style={{
                            display: showShimmer ? 'none' : 'block',
                            objectFit: 'fill'
                        }}
                        ref={playerRef}
                        {...videoProps}
                        playsInline={true}
                        poster={poster}
                    />
                    {showShimmer && renderPlayerShimmer && renderPlayerShimmer()}
                </>
            );

        // Fallback to using a regular video player if HLS is supported by default in the user's browser
        return (
            <>
                {buffering && renderPlayerLoader()}
                <video
                    ref={playerRef}
                    type={'application/x-mpegURL'}
                    {...videoProps}
                    autoPlay={false}
                    poster={poster}
                    playsInline={true}>
                    <source src={videoProps.src} type='application/x-mpegURL' />
                </video>
                {showShimmer && renderPlayerShimmer && renderPlayerShimmer()}
            </>
        );
    }
);

export default HlsPlayer;
