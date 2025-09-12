import React, { useEffect, useRef, useState } from 'react';
import styles from './videoSeekSlider.module.scss'; // Import SCSS module
import { TimeCodeItem } from './components/timeCodeItem';
import { TimeCodes } from './components/timeCodes';
import { HoverTimeWithPreview } from './components/hoverTimeWithPreview';
import { Thumb } from './components/thumb';
import { getEndTimeByIndex, positionToMs, isInRange } from './utils';

const VideoSeekSlider = ({
    max = 5000,
    currentTime = 0,
    bufferTime = 0,
    hideThumbTooltip = false,
    offset = 0,
    secondsPrefix = '',
    minutesPrefix = '',
    limitTimeTooltipBySides = true,
    timeCodes = [],
    onChange = () => undefined,
    getPreviewScreenUrl,
    onInteraction = () => undefined
}) => {
    const [seekHoverPosition, setSeekHoverPosition] = useState(0);
    const [label, setLabel] = useState('');
    const seeking = useRef(false);
    const mobileSeeking = useRef(false);
    const trackElement = useRef(null);

    const trackWidth = trackElement.current?.offsetWidth || 0;
    const isThumbActive = seekHoverPosition > 0 || seeking.current;
    const hoverTimeValue = positionToMs(max, seekHoverPosition, trackWidth);

    const changeCurrentTimePosition = pageX => {
        const clientRect = trackElement.current?.getBoundingClientRect();
        const left = clientRect?.left || 0;
        const width = clientRect?.width || 0;

        let position = pageX - left;
        position = position < 0 ? 0 : position;
        position = position > width ? width : position;

        const percent = (position * 100) / width;
        const time = +(percent * (max / 100)).toFixed(0);

        setSeekHoverPosition(position);
        onChange(time, time + offset);
    };

    const handleTouchSeeking = event => {
        event.preventDefault();
        event.stopPropagation();

        if (!mobileSeeking.current) {
            return;
        }

        const { changedTouches } = event;
        let pageX = changedTouches?.[changedTouches.length - 1]?.pageX || 0;

        pageX = pageX < 0 ? 0 : pageX;
        changeCurrentTimePosition(pageX);
    };

    const handleSeeking = event => {
        event.preventDefault();
        event.stopPropagation();

        if (seeking.current) {
            changeCurrentTimePosition(event.pageX);
        }
    };

    const handleTrackHover = (clear, event) => {
        const left = trackElement.current?.getBoundingClientRect().left || 0;
        const position = clear ? 0 : event.pageX - left;
        setSeekHoverPosition(position);
    };

    const setMobileSeeking = (state = true) => {
        mobileSeeking.current = state;
        setSeekHoverPosition(state ? seekHoverPosition : 0);
    };

    const setSeeking = (state, event) => {
        event.preventDefault();
        handleSeeking(event);
        seeking.current = state;
        setSeekHoverPosition(state ? seekHoverPosition : 0);
    };

    const mouseSeekingHandler = event => {
        setSeeking(false, event);
    };

    const mobileTouchSeekingHandler = () => {
        setMobileSeeking(false);
    };

    useEffect(() => {
        if (!mobileSeeking.current) {
            return;
        }

        const currentCode = timeCodes.find(({ fromMs }, index) => {
            const endTime = getEndTimeByIndex(timeCodes, index, max);
            return isInRange(currentTime, fromMs, endTime);
        });

        if (currentCode?.description !== label) {
            setLabel(currentCode?.description || '');
        }
    }, [currentTime, label, max, timeCodes]);

    useEffect(() => {
        if (typeof onInteraction == 'function') {
            onInteraction(isThumbActive);
        }
    }, [isThumbActive]);

    useEffect(() => {
        trackElement?.current?.addEventListener('mousemove', handleSeeking);
        trackElement?.current?.addEventListener('mouseup', mouseSeekingHandler);
        trackElement?.current?.addEventListener('touchmove', handleTouchSeeking);
        trackElement?.current?.addEventListener('touchend', mobileTouchSeekingHandler);

        return () => {
            trackElement?.current?.removeEventListener('mousemove', handleSeeking);
            trackElement?.current?.removeEventListener('mouseup', mouseSeekingHandler);
            trackElement?.current?.removeEventListener('touchmove', handleTouchSeeking);
            trackElement?.current?.removeEventListener('touchend', mobileTouchSeekingHandler);
        };
    }, [max, offset, trackWidth]);

    return (
        <div className={styles.videoSeekSlider}>
            <div
                className={isThumbActive ? `${styles.track} ${styles.active}` : styles.track}
                ref={trackElement}
                onMouseMove={event => handleTrackHover(false, event)}
                onMouseLeave={event => handleTrackHover(true, event)}
                onMouseDown={event => setSeeking(true, event)}
                onTouchStart={() => setMobileSeeking(true)}
                data-testid='main-track'>
                {Boolean(timeCodes.length) && (
                    <TimeCodes
                        currentTime={currentTime}
                        max={max}
                        bufferTime={bufferTime}
                        seekHoverPosition={seekHoverPosition}
                        timeCodes={timeCodes}
                        mobileSeeking={mobileSeeking.current}
                        trackWidth={trackWidth}
                        label={label}
                        setLabel={setLabel}
                    />
                )}

                {!timeCodes.length && (
                    <TimeCodeItem
                        maxTime={max}
                        startTime={0}
                        endTime={max}
                        currentTime={currentTime}
                        bufferTime={bufferTime}
                        seekHoverTime={hoverTimeValue}
                    />
                )}
            </div>

            {!hideThumbTooltip && (
                <HoverTimeWithPreview
                    max={max}
                    hoverTimeValue={hoverTimeValue}
                    isThumbActive={isThumbActive}
                    label={label}
                    limitTimeTooltipBySides={limitTimeTooltipBySides}
                    offset={offset}
                    seekHoverPosition={seekHoverPosition}
                    trackWidth={trackWidth}
                    getPreviewScreenUrl={getPreviewScreenUrl}
                    minutesPrefix={minutesPrefix}
                    secondsPrefix={secondsPrefix}
                />
            )}

            <Thumb max={max} currentTime={currentTime} isThumbActive={isThumbActive} />
        </div>
    );
};

export default VideoSeekSlider;
