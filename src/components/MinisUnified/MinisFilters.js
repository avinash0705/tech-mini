import React, { useState } from 'react';
import styles from './MinisFilters.module.scss';

const MinisFilters = ({ filters = [], selectedFilters = [], onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterToggle = (filter) => {
        const newFilters = selectedFilters.includes(filter)
            ? selectedFilters.filter(f => f !== filter)
            : [...selectedFilters, filter];
        
        onFilterChange(newFilters);
    };

    const clearAllFilters = () => {
        onFilterChange([]);
    };

    if (filters.length === 0) {
        return null;
    }

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.filtersHeader}>
                <h3 className={styles.filtersTitle}>Filters</h3>
                {selectedFilters.length > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className={styles.clearAllBtn}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className={`${styles.filtersList} ${isExpanded ? styles.expanded : ''}`}>
                {filters.map((filter, index) => (
                    <button
                        key={index}
                        onClick={() => handleFilterToggle(filter)}
                        className={`${styles.filterBtn} ${
                            selectedFilters.includes(filter) ? styles.active : ''
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {filters.length > 6 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={styles.expandBtn}
                >
                    {isExpanded ? 'Show Less' : `Show All (${filters.length})`}
                </button>
            )}
        </div>
    );
};

export default MinisFilters;
