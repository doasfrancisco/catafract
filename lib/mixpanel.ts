import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const isBrowser = typeof window !== 'undefined';
const DISTINCT_ID_STORAGE_KEY = 'ceo-or-cto:distinct_id';

const ensureDistinctId = () => {
    if (!isBrowser) return;
    if (!MIXPANEL_TOKEN) return;

    const generateId = () => {
        if (typeof window.crypto !== 'undefined' && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }
        return `anon_${Math.random().toString(36).slice(2, 11)}${Date.now()}`;
    };

    try {
        let distinctId = window.localStorage.getItem(DISTINCT_ID_STORAGE_KEY);
        if (!distinctId) {
            distinctId = generateId();
            window.localStorage.setItem(DISTINCT_ID_STORAGE_KEY, distinctId);
        }
        mixpanel.identify(distinctId);
    } catch (error) {
        console.warn('Failed to initialize analytics identity:', error);
    }
};

console.log('Mixpanel is debug mode:', process.env.NEXT_PUBLIC_SETUP === 'local');
if (MIXPANEL_TOKEN && isBrowser) {
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NEXT_PUBLIC_SETUP === 'local',
        track_pageview: true,
        persistence: 'localStorage',
        record_sessions_percent: 100,
        record_heatmap_data: true,
        ignore_dnt: true,
        api_host: process.env.NEXT_PUBLIC_PROXY_MIXPANEL_API,
    });

    ensureDistinctId();
} else if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token not found. Analytics will not be tracked.');
}

export const analytics = {
    ensureIdentity: ensureDistinctId,

    identify: (userId: string) => {
        if (!MIXPANEL_TOKEN) return;
        mixpanel.identify(userId);
    },

    trackNodeAdded: (nodeType: 'upload' | 'generation') => {
        if (!MIXPANEL_TOKEN) return;
        mixpanel.track('Node Added', {
            node_type: nodeType,
        });
    },

    trackImageGeneration: (data: {
        prompt: string;
        inputNodeCount: number;
        status: 'started' | 'success' | 'failure';
    }) => {
        if (!MIXPANEL_TOKEN) return;
        mixpanel.track('Image Generation', {
            prompt: data.prompt,
            input_node_count: data.inputNodeCount,
            status: data.status,
        });
    },

    trackUpgradeClicked: (isPro: boolean) => {
        if (!MIXPANEL_TOKEN) return;
        mixpanel.track('Upgrade Clicked', {
            is_pro: isPro,
        });
    },

    trackCanvasLoaded: (userId?: string) => {
        if (!MIXPANEL_TOKEN) return;
        mixpanel.track('Canvas Loaded', {
            user_id: userId,
        });
    },
};

export default analytics;