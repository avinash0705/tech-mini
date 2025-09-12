import React from 'react';
import styles from '../videoSeekSlider.module.scss';

export const Thumb = ({ max, currentTime, isThumbActive }) => {
    const getThumbHandlerPosition = () => {
        const thumbConstantOffset = -6;
        const leftPosition = (currentTime / max) * 100;

        return {
            left: `calc(${leftPosition}% + ${thumbConstantOffset}px)`
        };
    };

    return (
        <div
            className={isThumbActive ? `${styles.thumb} ${styles.active}` : styles.thumb}
            data-testid='testThumb'
            style={getThumbHandlerPosition()}>
            <div className={styles.handler} />
        </div>
    );
};
