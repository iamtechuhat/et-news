import { useState, useEffect, useCallback } from 'react';

const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://economictimes.indiatimes.com/rssfeedsdefault.cms';

const CATEGORY_KEYWORDS = {
    Tech: ['tech', 'software', 'ai', 'artificial intelligence', 'digital', 'app', 'internet', 'cyber', 'data', 'cloud', 'computing', 'startup', 'gadget', 'smartphone', 'google', 'apple', 'microsoft', 'amazon', 'meta', 'chip', 'semiconductor'],
    Finance: ['bank', 'finance', 'loan', 'credit', 'rbi', 'interest rate', 'deposit', 'insurance', 'mutual fund', 'tax', 'gst', 'fiscal', 'budget', 'revenue', 'investment', 'inflation'],
    Markets: ['sensex', 'nifty', 'stock', 'share', 'market', 'bse', 'nse', 'trading', 'ipo', 'equity', 'bull', 'bear', 'rally', 'index', 'portfolio', 'dividend'],
    Politics: ['government', 'minister', 'parliament', 'election', 'bjp', 'congress', 'modi', 'policy', 'bill', 'law', 'political', 'vote', 'democracy', 'opposition', 'chief minister'],
    Startups: ['startup', 'unicorn', 'funding', 'venture', 'entrepreneur', 'founder', 'seed', 'series', 'valuation', 'acquisition', 'incubator', 'accelerator', 'pitch', 'bootstrap'],
    World: ['global', 'world', 'international', 'us', 'china', 'europe', 'uk', 'russia', 'japan', 'trade war', 'geopolitical', 'nato', 'un', 'climate', 'foreign', 'export', 'import'],
};

function categorizeArticle(article) {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    const matched = [];

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                matched.push(category);
                break;
            }
        }
    }

    return matched.length > 0 ? matched : ['General'];
}

function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
}

export function useNewsData() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(RSS_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.status !== 'ok') {
                throw new Error(data.message || 'Failed to fetch news feed');
            }

            const articles = (data.items || []).map((item, index) => ({
                id: `news-${index}-${Date.now()}`,
                title: item.title || 'Untitled',
                description: item.description
                    ? item.description.replace(/<[^>]*>/g, '').substring(0, 250)
                    : 'No description available.',
                link: item.link || '#',
                pubDate: item.pubDate || new Date().toISOString(),
                timeAgo: timeAgo(item.pubDate),
                thumbnail: item.thumbnail || item.enclosure?.link || null,
                author: item.author || 'ET Bureau',
                categories: categorizeArticle(item),
            }));

            setNews(articles);
        } catch (err) {
            setError(err.message || 'Failed to load news');
            setNews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return { news, loading, error, refetch: fetchNews };
}
