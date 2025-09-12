import React from 'react';
import { useDispatch } from 'react-redux';
import { makeInteractionCall } from '@store/actions/minisActions';
import styles from './MinisCard.module.scss';

const MinisCard = ({ item, index, urlType }) => {
    const dispatch = useDispatch();

    const handleCardClick = () => {
        // Track interaction
        dispatch(makeInteractionCall({
            metadata: {
                vendor: 'minis',
                content_type: 'articles',
                media_type: 'text',
                source_id: item.source_id
            },
            actions: [{
                action_type: 'click',
                timestamp: new Date().getTime()
            }]
        }));

        // Handle navigation based on content type
        if (item.url) {
            window.open(item.url, '_blank');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.minisCard} onClick={handleCardClick}>
            <div className={styles.cardContent}>
                {item.image_url && (
                    <div className={styles.imageContainer}>
                        <img
                            src={item.image_url}
                            alt={item.title || 'Minis content'}
                            className={styles.cardImage}
                        />
                    </div>
                )}
                
                <div className={styles.textContent}>
                    <h3 className={styles.title}>
                        {item.title || 'Untitled'}
                    </h3>
                    
                    {item.description && (
                        <p className={styles.description}>
                            {item.description}
                        </p>
                    )}
                    
                    <div className={styles.metaInfo}>
                        {item.published_date && (
                            <span className={styles.date}>
                                {formatDate(item.published_date)}
                            </span>
                        )}
                        
                        {item.source && (
                            <span className={styles.source}>
                                {item.source}
                            </span>
                        )}
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                        <div className={styles.tags}>
                            {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className={styles.cardActions}>
                <button className={styles.readMoreBtn}>
                    Read More
                </button>
            </div>
        </div>
    );
};

export default MinisCard;
