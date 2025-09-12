import React from 'react';
import styles from './ErrorMessage.module.scss';

const ErrorMessage = ({ error, onRetry }) => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3 className={styles.errorTitle}>Oops! Something went wrong</h3>
            <p className={styles.errorMessage}>
                We are unable to load the information at the moment. Please try again later!
            </p>
            {onRetry && (
                <button onClick={onRetry} className={styles.retryBtn}>
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
