export const LS_KEY = 'NaukriMinis';
export const DEFAULT_COMP_URL = 'https://techminis.com/api/suggestions/channel/placeholder';

export const SEO_TITLE = 'Short Summaries on Latest Tech News, Career, Employment | Naukri Minis';
export const SEO_DESCRIPTION =
    "Read latest tech news with Naukri Mini's related to Employment, Technology, Career, AI (artificial intelligence) in India.";

export const PAGE_TITLE = 'Minis by naukri';

export const TUPLE_UBA_EVENT_NAMES = {
    VIEW: 'minisTupleView',
    CLICK: 'minisClick'
};

export const PAGE_UBA_EVENT_NAMES = {
    VIEW: 'minisView',
    CLICK: 'minisClick',
    SCROLL: 'minisScroll'
};

export const TRACKING_ACTION_TYPES = {
    VIEW: 'view',
    CLICK: 'click',
    SCROLL: 'scroll',
    FILTERS: 'filters',
    START_EXPLORE: 'startExplore'
};

export const ERROR_HEADING = 'Oops! something went wrong';
export const ERROR_SUBHEADING =
    'We are unable to load the information at the moment. Please try again later!';
export const RETRY_CTA_LABEL = 'Go back';

export const BANNER_HEADING = 'Stay informed with bite-sized news';
export const LINK_COPIED_TEXT = 'Link copied successfully';
export const MINIS_SOURCE = 'Minis';

export const MINIS_HEADING = "Here's what's trending";

export const MINIS_CONTENT_TYPE = {
    SHORT_ARTICLES: 'articles',
    UNIFIED: 'UNIFIED',
    PLAY_MODE: 'PLAY_MODE'
};

export const MINIS_MEDIA_TYPE = {
    TEXT: 'text',
    VIDEO: 'video'
};

export const MINIS_VENDOR = {
    MINIS: 'minis'
};

export const MINIS_API_CONSTANTS = {
    DEAFULT_PAGE_SIZE: 15,
    FLOW: 'minis_homepage'
};

export const UNIFIED_API_CONSTANTS = {
    DEAFULT_PAGE_SIZE: 10,
    FLOW: 'minis_unified'
};

export const MINIS_ARTICLES_PLAYER_API_CONSTANTS = {
    DEAFULT_PAGE_SIZE: 10,
    FLOW: 'minis_article_player'
};

export const miniWidgetPageNames = {
    MINIS_WIDGET_PAGE_loggedIn_NAME: 'ni-pwa-minis-video-loggedin-v0',
    MINIS_WIDGET_PAGE_loggedOut_NAME: 'ni-pwa-minis-video-loggedout-v0'
};

export const NAUKRI_360_HOME_URL = '/naukri360';

export const MINI_WIDGET_ON_LOAD_LISTENER = 'miniVideoWidgetLoading';
export const MINI_SLIDES_WIDGET_ON_LOAD_LISTENER = 'miniSlidesWidgetLoading';
export const MINIS_API_PAGE_CONFIG = {
    page: 1,
    size: 15
};

export const MINIS_WIDGET_SCROLL = 'minis_widgetScroll';

export const SAVED_PAGE_CONFIG = {
    page: 1,
    size: 20
};

export const MINIS_URLS = {
    MINIS_ARTICLES: 'MINIS_ARTICLES',
    MINIS_ARTICLES_LANDING_URL: {
        ARTICLE_LISTING: 'ARTICLE_LISTING'
    },
    MINIS_VIDEOS_URL: {
        VIDEO_LISTING: 'VIDEO_LISTING',
        VIDEO_PLAYER: 'VIDEO_PLAYER'
    },
    MINIS_SLIDES_URL: {
        SLIDES_LISTING: 'SLIDES_LISTING',
        SLIDES_PLAYER: 'SLIDES_PLAYER'
    }
};

export const NAUKRI_MINI_ARTICLES_URL = '/minis';
export const MINI_VIDEO_LISTING_URL = '/minis/videos';
export const MINI_VIDEO_PLAYER_URL = '/minis/video-[caption]-vid-[videoId]';
export const MINI_SLIDES_LISTING_URL = '/minis/slides';
export const MINI_SLIDE_PLAYER_URL = '/minis/slide-[caption]-sid-[slideId]';
export const MINIS_ARTICLE_PLAYER_URL = '/minis/article-[caption]-aid-[articleId]';

export const TABS_CONFIG = [
    {
        key: MINIS_URLS.MINIS_ARTICLES,
        label: 'Articles',
        url: NAUKRI_MINI_ARTICLES_URL,
        softLoad: true
    },
    {
        key: MINIS_URLS.MINIS_VIDEOS_URL.VIDEO_LISTING,
        label: 'Short Videos',
        url: MINI_VIDEO_LISTING_URL,
        softLoad: true
    },
    {
        key: MINIS_URLS.MINIS_SLIDES_URL.SLIDES_LISTING,
        label: 'Slides',
        url: MINI_SLIDES_LISTING_URL,
        softLoad: true,
        tag: 'New'
    }
];

export const savedFilter = {
    key: 'Saved',
    count: 0
};

export const MINI_CONTINUATION_ID_SS_KEY = 'miniContinuationId';
export const CONTINUATION_ID_LENGTH = 13;

export const DEFAULT_TAGS_QPARAM = 'default_tags';
export const DEFAULT_TAGS_LS_KEY = 'isMVDefaultTagsApplied';
