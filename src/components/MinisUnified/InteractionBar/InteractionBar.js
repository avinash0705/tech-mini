import React from 'react';
import { formatCount } from '../../../utils';
import styles from './InteractionBar.module.scss';

// Thresholds for showing counts
const VIEWS_THRESHOLD = 100;
const LIKE_COUNT_THRESHOLD = 5;
const SHARE_COUNT_THRESHOLD = 5;

const InteractionBar = ({
    likeIcon,
    shareIcon,
    bookmarkIcon,
    reactionIcon,
    onLike,
    onShare,
    onBookmark,
    likeCount = 0,
    shareCount = 0,
    bookmarkCount = 0,
    reactions = 0,
    className = '',
    title,
    url
}) => {
    const handleShareClick = (e) => {
        e.stopPropagation();
        if (onShare && typeof onShare === 'function') {
            onShare({ title, url });
        }
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        if (onLike && typeof onLike === 'function') {
            onLike(e);
        }
    };

    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        if (onBookmark && typeof onBookmark === 'function') {
            onBookmark(e);
        }
    };

    return (
        <div className={`${styles.interactionBar} ${className}`}>
            <div className={styles.leftSection}>
                {/* Like Button */}
                <div className={styles.interactionItem}>
                    <button onClick={handleLikeClick} className={styles.interactionButton}>
                        <img src={likeIcon} alt="Like" className={styles.interactionIcon} />
                        {likeCount > LIKE_COUNT_THRESHOLD && (
                            <span className={styles.interactionCount}>{formatCount(likeCount)}</span>
                        )}
                    </button>
                </div>

                {/* Share Button */}
                <div className={styles.interactionItem}>
                    <button onClick={handleShareClick} className={styles.interactionButton}>
                        <img src={shareIcon} alt="Share" className={styles.interactionIcon} />
                        {shareCount > SHARE_COUNT_THRESHOLD && (
                            <span className={styles.interactionCount}>{formatCount(shareCount)}</span>
                        )}
                    </button>
                </div>

                {/* Bookmark Button - only show for logged in users */}
                {/* {loginDetail.isLoggedIn && (
                    <div className={styles.interactionItem}>
                        <button onClick={handleBookmarkClick} className={styles.interactionButton}>
                            <img src={bookmarkIcon} alt="Bookmark" className={styles.interactionIcon} />
                        </button>
                    </div>
                )} */}
            </div>

            {/* View Count - show on the right */}
            <div className={styles.interactionItem}>
                {reactions > VIEWS_THRESHOLD && (
                    <div className={styles.viewCount}>
                        <img src={reactionIcon} alt="Views" className={styles.interactionIcon} />
                        <span className={styles.interactionCount}>{formatCount(reactions)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractionBar;
