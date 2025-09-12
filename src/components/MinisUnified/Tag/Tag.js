import React from 'react';
import styles from './Tag.module.scss';

const TAGS_VARIANTS = {
    TRENDING: 'TRENDING',
    BREAKING_NEWS: 'BREAKING_NEWS'
};

const getLabel = (tagInfo) => {
    switch (tagInfo?.value) {
        case TAGS_VARIANTS.TRENDING:
            return tagInfo?.label || 'Trending';
        case TAGS_VARIANTS.BREAKING_NEWS:
            return tagInfo?.label || 'Breaking News';
        default:
            return tagInfo?.label;
    }
};

const getIcon = (variant) => {
    switch (variant) {
        case TAGS_VARIANTS.TRENDING:
            return '/icons/trending.svg';
        case TAGS_VARIANTS.BREAKING_NEWS:
            return '/icons/breaking.svg';
        default:
            return null;
    }
};

const Tag = ({ wrapperClass = '', tagInfo = {} }) => {
    const variant = tagInfo?.value;
    const label = getLabel(tagInfo);
    const icon = getIcon(variant);

    if (!label) return null;

    return (
        <span className={`${styles.tag} ${styles[variant] || ''} ${wrapperClass}`}>
            {icon && (
                <img src={icon} height={11} width={11} alt={label} />
            )}
            <span className={`${styles.label} ${styles[variant] || ''}`}>
                {label}
            </span>
        </span>
    );
};

export default Tag;
