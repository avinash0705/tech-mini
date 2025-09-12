import React, { useRef } from 'react';
import styles from '../videoSeekSlider.module.scss';
import { timeToTimeString, getHoverTimePosition } from '../utils';

export const HoverTimeWithPreview = ({
    max,
    hoverTimeValue,
    offset,
    trackWidth,
    seekHoverPosition,
    isThumbActive,
    limitTimeTooltipBySides,
    label,
    minutesPrefix,
    secondsPrefix,
    getPreviewScreenUrl
}) => {
    const hoverTimeElement = useRef(null);

    const hoverTimeClassName = isThumbActive
        ? `${styles.hoverTime} ${styles.active}`
        : styles.hoverTime;

    const hoverTimePosition = getHoverTimePosition(
        seekHoverPosition,
        hoverTimeElement?.current,
        trackWidth,
        limitTimeTooltipBySides
    );

    const hoverTimeString = timeToTimeString(
        max,
        hoverTimeValue,
        offset,
        minutesPrefix,
        secondsPrefix
    );

    return (
        <div
            className={hoverTimeClassName}
            style={hoverTimePosition}
            ref={hoverTimeElement}
            data-testid='hover-time'>
            {isThumbActive && getPreviewScreenUrl && (
                <div
                    className={styles.previewScreen}
                    style={{
                        backgroundImage: `url(${getPreviewScreenUrl(hoverTimeValue)})`
                    }}
                />
            )}
            {label && <div>{label}</div>}
            {hoverTimeString}
        </div>
    );
};
