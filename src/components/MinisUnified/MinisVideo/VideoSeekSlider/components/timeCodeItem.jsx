import React, { memo } from 'react';
import styles from '../videoSeekSlider.module.scss';
import { getTimeScale, getPositionPercent } from '../utils';

export const TimeCodeItem = memo(
    ({
        label = '',
        startTime,
        maxTime,
        endTime,
        currentTime,
        seekHoverTime,
        bufferTime,
        isTimePassed = false,
        isBufferPassed = false,
        isHoverPassed = false,
        onHover = () => undefined,
        withGap
    }) => {
        const positionPercent = getPositionPercent(maxTime, startTime);
        const timeDiff = endTime - startTime;
        const widthPercent = (timeDiff / maxTime) * 100;
        const mainClassName = `${styles.main} ${withGap ? styles.withGap : ''}`;

        const currentTimeScale = getTimeScale(currentTime, startTime, endTime, isTimePassed);

        const seekHoverTimeScale = getTimeScale(seekHoverTime, startTime, endTime, isHoverPassed);

        const bufferTimeScale = getTimeScale(bufferTime, startTime, endTime, isBufferPassed);

        const handleMouseMove = () => onHover(label);

        return (
            <div
                className={mainClassName}
                onMouseMove={handleMouseMove}
                style={{
                    width: `${widthPercent}%`,
                    left: `${positionPercent}%`
                }}>
                <div
                    className={`${styles.innerSeekBlock} ${styles.buffered}`}
                    data-test-id='test-buffered'
                    style={{ transform: `scaleX(${bufferTimeScale})` }}
                />

                <div
                    className={`${styles.innerSeekBlock} ${styles.seekHover}`}
                    data-test-id='test-seek-hover'
                    style={{ transform: `scaleX(${seekHoverTimeScale})` }}
                />

                <div
                    className={`${styles.innerSeekBlock} ${styles.connect}`}
                    style={{ transform: `scaleX(${currentTimeScale})` }}
                />
            </div>
        );
    }
);
