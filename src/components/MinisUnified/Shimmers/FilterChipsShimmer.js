import React from 'react';
import styles from './Shimmer.module.scss';

const FilterChipsShimmer = ({ count = 5 }) => {
    return (
        <div className={styles.filterChipsShimmer}>
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className={styles.filterChip}></div>
            ))}
        </div>
    );
};

export default FilterChipsShimmer;
