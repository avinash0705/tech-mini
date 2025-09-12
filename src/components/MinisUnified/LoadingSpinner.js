import React from 'react';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading tech minis...</p>
        </div>
    );
};

export default LoadingSpinner;
