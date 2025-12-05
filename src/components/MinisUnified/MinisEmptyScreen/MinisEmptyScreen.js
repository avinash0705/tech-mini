import React from 'react';
import styles from './MinisEmptyScreen.module.scss';

// Default empty state icon
const defaultEmptyIcon = '/icons/empty-state.svg';

const MinisEmptyScreen = ({
    title = 'No content available',
    info = 'Check back later for more updates',
    ctaText = 'Refresh',
    ctaCallback = () => window.location.reload(),
    hideCtaIcon = false,
    infoCls = '',
    screenIcon = defaultEmptyIcon,
    imgWidth = 116,
    imgHeight = 116
}) => (
    <div className={styles.emptySavedContainer}>
        <img src={screenIcon} alt='empty state' height={imgHeight} width={imgWidth} />
        <div className={styles.savedVideosHere}>
            <div className={`${styles.savedVideos} ${styles.title}`}>{title}</div>
            <div className={`${styles.watchLater} ${styles.subtitle} ${infoCls}`}>{info}</div>
            {ctaText && (
                <button type='button' className={styles.startExploreBtn} onClick={ctaCallback}>
                    {!hideCtaIcon && (
                        <span className={styles.ctaIcon}>↻</span>
                    )}
                    <span className={styles.ctaText}>{ctaText}</span>
                </button>
            )}
        </div>
    </div>
);

export default MinisEmptyScreen;


