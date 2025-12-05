export const SEO_TITLE = 'Short Summaries on Latest Tech News, Career, Employment | Naukri Minis';
export const SEO_DESCRIPTION =
    "Read latest tech news with Naukri Mini's related to Employment, Technology, Career, AI (artificial intelligence) in India.";

export const PAGE_TITLE = 'Minis by naukri';

// Feed Item Types
export const FEED_ITEM_TYPES = {
    ARTICLE: 'article',
    VIDEO: 'video',
    SLIDESHOW: 'slideshow',
    POLL: 'poll',
    SPOTLIGHT: 'spotlight'
};

// Interaction Types
export const INTERACTION_TYPES = {
    VIEW: 'view',
    LIKE: 'like',
    SAVE: 'save',
    SHARE: 'share',
    CLICK: 'click',
    ATTEMPT: 'attempt'
};

// Content Types
export const CONTENT_TYPES = {
    REELS: 'reels',
    ARTICLES: 'articles',
    SLIDES: 'slides',
    WEB_STORY: 'web_stories',
    MEMES: 'memes'
};

export const metaInfoSchema = {
    [CONTENT_TYPES.ARTICLES]: {},
    [CONTENT_TYPES.WEB_STORY]: {},
    [CONTENT_TYPES.MEMES]: {},
    [CONTENT_TYPES.REELS]: {}
};

// Media Types
export const MEDIA_TYPES = {
    VIDEO: 'video',
    IMAGE: 'image',
    TEXT: 'text'
};

// Publisher Types
export const PUBLISHER_TYPES = {
    MINIS: 'minis',
    YOURSTORY: 'yourstory',
    TECHCRUNCH: 'techcrunch',
    TECHPULSE: 'techpulse'
};

export const TRACK_VIDEO_VIEW_AT_PERC = 100;

export const MEDIA_TYPE_CONTENT = {
    reels: 'video',
    memes: 'image',
    articles: 'text',
    web_stories: 'image'
};

//UBA Details
export const UNIFIED_UBA_EVENT_NAMES = {
    PAGE_VIEW: 'unifiedFeedView',
    PAGE_CLICK: 'unifiedFeedClick',
    TUPLE_VIEW: 'unifiedFeedTupleView',
    PAGE_SCROLL: 'unifiedFeedScroll'
};

export const UNIFIED_TRACKING_ACTION_TYPES = {
    VIEW: 'view',
    CLICK: 'click',
    SCROLL: 'scroll',
    FILTERS: 'filters',
    START_EXPLORE: 'startExplore'
};

export const UNIFIED_PAGE_NAME = {
    MINIS_UNIFIED: 'Naukri Minis Unified'
};

export const MAX_SCROLLING_PAGE_COUNT = 4;

export const SAVED_QPARAM = 'saved';
export const FILTERS_QPARAM = 'filters';
export const ARTICLE_IDS_QPARAM = 'articleIds';
export const DEFAULT_TAGS_QPARAM = 'default_tags';

export const DEFAULT_COMP_URL = 'https://techminis.com/api/suggestions/channel/placeholder';

export const UNIFIED_LS_KEY = 'NaukriMinisUnified';

export const UNIFIED_SCROLL_POSITION = 'unified-scrollPosition';

export const NAUKRI_MINI_ARTICLES_URL = '/minis';
export const MINI_VIDEO_LISTING_URL = '/minis/videos';
export const MINI_VIDEO_PLAYER_URL = '/minis/video-[caption]-vid-[videoId]';
export const MINI_SLIDES_LISTING_URL = '/minis/slides';
export const MINIS_ARTICLE_PLAYER_URL = '/minis/article-[caption]-aid-[articleId]';
export const MINI_SLIDE_PLAYER_URL = '/minis/slide-[caption]-sid-[slideId]';

export const MINI_CONTINUATION_ID_SS_KEY = 'miniContinuationId';
export const CONTINUATION_ID_LENGTH = 13;

export const VIEWS_THRESHOLD = 100;
export const LIKE_COUNT_THRESHOLD = 5;
export const SHARE_COUNT_THRESHOLD = 5;

export const miniUnifiedWidgetPageNames = {
    MINIS_WIDGET_PAGE_loggedIn_NAME: 'ni-pwa-unified-feed-v0',
    MINIS_WIDGET_PAGE_loggedOut_NAME: 'ni-pwa-unified-feed-v0'
};

export const noResultText = {
    title: 'No saved items yet',
    info: `See something interesting? Tap save and it'll appear here.`,
    ctaText: 'Keep exploring'
};

export const pageSizeConfig = {
    SAVED: 20,
    UNSAVED: 10
};

export const MINIS_UNIFIED_VID_VOL_MUTE_STAUS = 'MINIS_UNIFIED_VID_VOL_MUTE_STAUS';
export const MINI_CURATED_WIDGET_ON_LOAD_LISTENER = 'MINI_CURATED_WIDGET_ON_LOAD_LISTENER';
export const MINI_SPOTLIGHT_WIDGET_ON_LOAD_LISTENER = 'MINI_SPOTLIGHT_WIDGET_ON_LOAD_LISTENER';
export const MINI_QUICK_UPDATES_WIDGET_ON_LOAD_LISTENER = 'MINI_QUICK_UPDATES_WIDGET_ON_LOAD_LISTENER';

export const MINIS_UNIFIED_PLAYED_VID = 'MINIS_UNIFIED_PLAYED_VID';
export const MINIS_UNIFIED_VIDEO_RESUME = 'MINIS_UNIFIED_VIDEO_RESUME';
export const MINIS_UNIFIED_WIDGET_RESUME_LISTENER = 'MINIS_UNIFIED_VID_RESUME_LISTENER';



export const NG_TAGS = ["Artificial General Intelligence","Artificial Intelligence","Augmented Reality","Automation","Automotive Industry","Autonomous Driving","Aviation and Airlines","Banking and Finance","Behavioral Health","Big Data","Biotech and Healthcare","Biotechnology","Blockchain","Business","Business Growth","Business Travel","Careers","Cloud Computing","Content Creation","Cryptocurrency","Cybersecurity","Data Science","Data Security & Privacy","DevOps","Digital Marketing","Digital Payments","Digital Transformation","E-Commerce","Economy","Education Technology","Electric Vehicles","Enterprise","Entrepreneurship","FinTech","Funding","Gaming","Generative AI","Hardware","Health Tech","Human Resources","Innovation","Investment","Job Market","Leadership","Leadership and Management","Machine Learning","Marketing & Sales","Markets","Media and Entertainment","Mergers and Acquisitions","Metaverse","Microservices","Mobile Technology","Open Source","Policy and Regulation","Product Design","Productivity","Programming","Quantum Computing","Real Estate","Remote Work","Renewable Energy","Robotics","SaaS","Salary","Science and Technology","Semiconductors","Smart Devices","Social Media","Software Development","Space Exploration","Startups","Strategy","Streaming Services","Surveillance","Sustainability","Tech News","Technology","Transportation","Venture Capital","Video Generation","Virtual Reality","Wearables","Web Development","Workforce Innovation","Workplace Culture"];


