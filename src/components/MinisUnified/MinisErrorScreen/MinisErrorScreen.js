import React from 'react';
import styles from './MinisErrorScreen.module.scss';

const MinisErrorScreen = ({ 
    error = 'Something went wrong',
    onRetry = () => window.location.reload(),
    showRetry = true
}) => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <div className={styles.errorIcon}>⚠️</div>
                <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
                <p className={styles.errorMessage}>
                    {typeof error === 'string' ? error : 'We encountered an unexpected error'}
                </p>
                {showRetry && (
                    <button className={styles.retryButton} onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default MinisErrorScreen;
