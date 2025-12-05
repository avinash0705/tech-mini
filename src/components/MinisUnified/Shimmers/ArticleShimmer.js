import React from 'react';
import styles from './Shimmer.module.scss';

const ArticleShimmer = ({ count = 3 }) => {
    return (
        <div className={styles.articleShimmerWrapper}>
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className={styles.shimmerContainer}>
                    <div className={styles.shimmerCard}>
                        {/* Header */}
                        <div className={styles.shimmerHeader}>
                            <div className={styles.shimmerAvatar}></div>
                            <div className={styles.shimmerText}>
                                <div className={styles.shimmerLine}></div>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className={styles.shimmerBody}>
                            <div className={styles.shimmerImage}></div>
                            <div className={styles.shimmerTitle}></div>
                            <div className={styles.shimmerDescription}>
                                <div className={styles.shimmerLine}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArticleShimmer;


