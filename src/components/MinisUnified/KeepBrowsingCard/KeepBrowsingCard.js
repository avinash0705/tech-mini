import React from 'react';
import styles from './KeepBrowsingCard.module.scss';

const KeepBrowsingCard = ({ 
    onKeepExploring = () => {}, 
    triggerClickEvent = () => {} 
}) => {
    const onKeepExpClick = () => {
        triggerClickEvent('keepExploring');
        onKeepExploring();
    };

    return (
        <div className={styles.card}>
            <p className={styles.takeBreak}>Take a break</p>
            <h2 className={styles.title}>Want to keep browsing?</h2>
            <button className={styles.keepExploringButton} onClick={onKeepExpClick}>
                Keep exploring
            </button>
        </div>
    );
};

export default KeepBrowsingCard;


