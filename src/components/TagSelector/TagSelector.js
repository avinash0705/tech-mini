import { useState, useMemo } from 'react';
import { NG_TAGS } from '@components/MinisUnified/constants';
import styles from './TagSelector.module.scss';

const TagSelector = ({ selectedTags, onTagsChange, onViewFeed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    return NG_TAGS.filter(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Show limited tags initially, all when expanded
  const displayTags = showAll ? filteredTags : filteredTags.slice(0, 20);

  const handleTagToggle = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(updatedTags);
  };

  const handleSelectAll = () => {
    onTagsChange(displayTags);
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className={styles.tagSelector}>
      <div className={styles.header}>
        <h2>Select Your Interests</h2>
        <p>Choose topics you'd like to see in your feed</p>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* View Feed Button - Moved to top */}
      <div className={styles.viewFeedContainer}>
        <button 
          onClick={onViewFeed}
          className={styles.viewFeedBtn}
          disabled={selectedTags.length === 0}
        >
          View Feed {selectedTags.length > 0 && `(${selectedTags.length} topics)`}
        </button>
        {selectedTags.length === 0 && (
          <p className={styles.helpText}>
            Select at least one topic to view your personalized feed
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          onClick={handleSelectAll}
          className={styles.selectAllBtn}
          disabled={displayTags.length === 0}
        >
          Select All ({displayTags.length})
        </button>
        <button 
          onClick={handleClearAll}
          className={styles.clearAllBtn}
          disabled={selectedTags.length === 0}
        >
          Clear All
        </button>
        <span className={styles.selectedCount}>
          {selectedTags.length} selected
        </span>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className={styles.selectedTagsContainer}>
          <h3>Selected Topics ({selectedTags.length})</h3>
          <div className={styles.selectedTags}>
            {selectedTags.map(tag => (
              <span 
                key={tag} 
                className={styles.selectedTag}
                onClick={() => handleTagToggle(tag)}
              >
                {tag} ×
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags Grid */}
      <div className={styles.tagsContainer}>
        <div className={styles.tagsGrid}>
          {displayTags.map(tag => (
            <label key={tag} className={styles.tagItem}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className={styles.checkbox}
              />
              <span className={styles.tagLabel}>{tag}</span>
            </label>
          ))}
        </div>

        {/* Show More/Less Button */}
        {filteredTags.length > 20 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className={styles.showMoreBtn}
          >
            {showAll ? 'Show Less' : `Show All (${filteredTags.length} topics)`}
          </button>
        )}
      </div>

    </div>
  );
};

export default TagSelector;
