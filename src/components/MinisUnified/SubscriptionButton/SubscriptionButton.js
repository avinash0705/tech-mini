import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './SubscriptionButton.module.scss';

const SubscriptionButton = ({
    articleSourceId,
    articleSourceName,
    contentId,
    isDetailPage = false,
    isSubscribed = false,
    isSubscribeAllowed = false,
    handleUBAonClick = () => {},
    sourceId = null,
    containerClassName = '',
    buttonClassName = ''
}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    
    // For now, we'll use local state for subscription status
    const [subscriptionStatus, setSubscriptionStatus] = useState(
        isSubscribed ? 'subscribed' : 'unsubscribed'
    );

    // Determine visibility
    const shouldShowButton = isSubscribeAllowed === true;
    const showSubscribeButton = subscriptionStatus === 'unsubscribed';
    const showUnsubscribeButton = subscriptionStatus === 'subscribed' && isDetailPage;

    if (!shouldShowButton) {
        return null;
    }

    const handleSubscribe = async (e) => {
        e.stopPropagation();

        if (isLoading) return;
        setIsLoading(true);
        
        try {
            // TODO: Implement actual subscription API call
            console.log('Subscribing to:', articleSourceName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setSubscriptionStatus('subscribed');
            
            if (handleUBAonClick && sourceId) {
                handleUBAonClick(sourceId, 'subscribe');
            }
        } catch (error) {
            console.error('Subscribe error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsubscribe = async (e) => {
        e.stopPropagation();

        if (isLoading) return;
        setIsLoading(true);

        try {
            // TODO: Implement actual unsubscription API call
            console.log('Unsubscribing from:', articleSourceName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setSubscriptionStatus('unsubscribed');

            if (handleUBAonClick && sourceId) {
                handleUBAonClick(sourceId, 'unsubscribe');
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (showUnsubscribeButton) {
        return (
            <div className={`${styles.subscribeButtonContainer} ${containerClassName}`}>
                <button
                    type="button"
                    onClick={handleUnsubscribe}
                    disabled={isLoading}
                    className={`${styles.button} ${styles.unsubscribeButton} ${buttonClassName}`}
                >
                    {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>
            </div>
        );
    }

    if (showSubscribeButton) {
        return (
            <div className={`${styles.subscribeButtonContainer} ${containerClassName}`}>
                <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className={`${styles.button} ${styles.subscribeButton} ${buttonClassName}`}
                >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </div>
        );
    }

    return null;
};

export default SubscriptionButton;
