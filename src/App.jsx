import { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import NewsCard from './components/NewsCard';
import BriefingModal from './components/BriefingModal';
import { useNewsData } from './hooks/useNewsData';
import { useGemini } from './hooks/useGemini';

const ALL_CATEGORIES = ['Tech', 'Finance', 'Markets', 'Politics', 'Startups', 'World'];

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="skeleton h-44 w-full mb-4" />
            <div className="skeleton h-5 w-3/4 mb-3" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-5/6 mb-4" />
            <div className="flex gap-3">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-3 w-16" />
            </div>
        </div>
    );
}

function OnboardingOverlay({ onComplete }) {
    const [selected, setSelected] = useState([]);

    const toggle = (cat) => {
        setSelected((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleComplete = () => {
        const cats = selected.length > 0 ? selected : ALL_CATEGORIES;
        localStorage.setItem('et-newsai-categories', JSON.stringify(cats));
        onComplete(cats);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-slide-up">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                        <span className="text-white font-bold text-2xl font-serif">ET</span>
                    </div>
                    <h1 className="text-2xl font-bold text-dark-gray mb-2">Welcome to ET NewsAI</h1>
                    <p className="text-sm text-medium-gray">Select topics you're interested in to personalize your feed</p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {ALL_CATEGORIES.map((cat) => {
                        const icons = { Tech: '💻', Finance: '💰', Markets: '📈', Politics: '🏛️', Startups: '🚀', World: '🌍' };
                        const isSelected = selected.includes(cat);
                        return (
                            <button
                                key={cat}
                                onClick={() => toggle(cat)}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-primary bg-red-50 shadow-md shadow-primary/10'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-2xl">{icons[cat]}</span>
                                <div>
                                    <p className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-dark-gray'}`}>{cat}</p>
                                </div>
                                {isSelected && (
                                    <svg className="w-5 h-5 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* CTA */}
                <button
                    onClick={handleComplete}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200"
                >
                    {selected.length > 0 ? `Start with ${selected.length} topic${selected.length > 1 ? 's' : ''}` : 'Show me everything'}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">You can change this anytime</p>
            </div>
        </div>
    );
}

export default function App() {
    const [userCategories, setUserCategories] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [briefingOpen, setBriefingOpen] = useState(false);
    const [briefingContent, setBriefingContent] = useState(null);
    const [briefingError, setBriefingError] = useState(null);

    const { news, loading, error, refetch } = useNewsData();
    const { translateToHindi, generateBriefing, getStoryArc, translationLoading, briefingLoading, storyArcLoading } = useGemini();

    // Check for saved preferences
    useEffect(() => {
        const saved = localStorage.getItem('et-newsai-categories');
        if (saved) {
            try {
                setUserCategories(JSON.parse(saved));
            } catch {
                setShowOnboarding(true);
            }
        } else {
            setShowOnboarding(true);
        }
    }, []);

    const handleOnboardingComplete = (categories) => {
        setUserCategories(categories);
        setShowOnboarding(false);
    };

    // Filter news based on active category and user preferences
    const filteredNews = news.filter((article) => {
        if (activeCategory === 'All') {
            return userCategories
                ? article.categories.some((c) => userCategories.includes(c)) || article.categories.includes('General')
                : true;
        }
        return article.categories.includes(activeCategory);
    });

    // Generate briefing
    const handleBriefing = async () => {
        setBriefingOpen(true);
        setBriefingContent(null);
        setBriefingError(null);
        try {
            const top5 = news.slice(0, 5).map((a) => a.title);
            const result = await generateBriefing(top5);
            setBriefingContent(result);
        } catch (err) {
            setBriefingError(err.message || 'Failed to generate briefing');
        }
    };

    // Reset preferences
    const handleResetPrefs = () => {
        localStorage.removeItem('et-newsai-categories');
        setShowOnboarding(true);
        setUserCategories(null);
    };

    if (showOnboarding) {
        return <OnboardingOverlay onComplete={handleOnboardingComplete} />;
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header onBriefing={handleBriefing} briefingLoading={briefingLoading} />
            <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Status bar */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-dark-gray">
                            {activeCategory === 'All' ? 'Your Feed' : activeCategory}
                        </h2>
                        <p className="text-xs text-medium-gray mt-0.5">
                            {loading ? 'Loading fresh news...' : `${filteredNews.length} articles`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={refetch}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                            title="Refresh news"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button
                            onClick={handleResetPrefs}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                            title="Change preferences"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-dark-gray mb-2">Unable to load news</h3>
                        <p className="text-sm text-medium-gray mb-4">{error}</p>
                        <button
                            onClick={refetch}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* News grid */}
                {!loading && !error && (
                    <>
                        {filteredNews.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📭</span>
                                </div>
                                <h3 className="text-lg font-bold text-dark-gray mb-2">No articles found</h3>
                                <p className="text-sm text-medium-gray">Try switching to a different category</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNews.map((article) => (
                                    <NewsCard
                                        key={article.id}
                                        article={article}
                                        onTranslate={translateToHindi}
                                        onStoryArc={getStoryArc}
                                        translationLoading={translationLoading}
                                        storyArcLoading={storyArcLoading}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm font-serif">ET</span>
                            </div>
                            <span className="text-sm font-semibold text-dark-gray">ET NewsAI</span>
                            <span className="text-xs text-gray-400">• ET AI Hackathon 2026</span>
                        </div>
                        <p className="text-xs text-gray-400">Powered by Google Gemini 2.0 Flash & Economic Times RSS</p>
                    </div>
                </div>
            </footer>

            {/* Briefing Modal */}
            <BriefingModal
                isOpen={briefingOpen}
                onClose={() => setBriefingOpen(false)}
                content={briefingContent}
                loading={briefingLoading}
                error={briefingError}
            />
        </div>
    );
}
