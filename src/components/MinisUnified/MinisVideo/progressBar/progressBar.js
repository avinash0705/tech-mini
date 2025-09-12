import React, { useState, useEffect, useCallback, useRef } from 'react';
import VideoSeekSlider from '../VideoSeekSlider/index';
import styles from './progressBar.module.scss';
import { TRACK_VIDEO_VIEW_AT_PERC } from '../../constants';

const CustomProgressBar = React.memo(
    ({
        customClass,
        handleViewTracking = () => {},
        playerRef,
        updateCurrentTimeRef,
        onInteraction = () => undefined
    }) => {
        const [value, setValue] = useState(0);
        const [maxValue, setMaxValue] = useState(1);
        const isTriggerWatchedTrack = useRef(true);

        const onTimeUpdate = e => {
            const { currentTime = 0, duration = 1 } = e.target || {};

            setValue((currentTime || 0) * 1000);
            setMaxValue((duration || 0) * 1000);

            updateCurrentTimeRef({
                currentTime: currentTime / 1000,
                totalDuration: duration / 1000
            });
        };

        useEffect(() => {
            const videoElement = playerRef?.current;
            if (videoElement) {
                videoElement.addEventListener('timeupdate', onTimeUpdate);
            }

            return () => {
                isTriggerWatchedTrack.current = true;
                videoElement?.removeEventListener('timeupdate', onTimeUpdate);
            };
        }, [playerRef?.current]);

        const handleSeek = useCallback(time => {
            if (!playerRef?.current?.currentTime) {
                return;
            }

            playerRef.current.currentTime = time / 1000;

            setValue(time);
        }, []);

        const progress = (value / maxValue) * 100;

        if (
            Math.round(progress) === TRACK_VIDEO_VIEW_AT_PERC &&
            typeof handleViewTracking === 'function' &&
            isTriggerWatchedTrack.current
        ) {
            isTriggerWatchedTrack.current = false;
            handleViewTracking();
        }

        return (
            <div className={`${styles.progressBarContainer} ${customClass}`}>
                <VideoSeekSlider
                    max={maxValue}
                    currentTime={value}
                    bufferTime={progress}
                    onChange={handleSeek}
                    hideHoverTime={false}
                    secondsPrefix='00:'
                    // minutesPrefix="00:"
                    limitTimeTooltipBySides={true}
                    onInteraction={onInteraction}
                />
            </div>
        );
    }
);

export default CustomProgressBar;
