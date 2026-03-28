import { useState } from 'react';
import StoryArc from './StoryArc';

export default function NewsCard({ article, onTranslate, onStoryArc, translationLoading, storyArcLoading }) {
    const [translation, setTranslation] = useState(null);
    const [translationError, setTranslationError] = useState(null);
    const [storyArc, setStoryArc] = useState(null);
    const [storyArcError, setStoryArcError] = useState(null);
    const [showStoryArc, setShowStoryArc] = useState(false);

    const handleTranslate = async () => {
        if (translation) {
            setTranslation(null);
            return;
        }
        setTranslationError(null);
        try {
            const result = await onTranslate(article.id, `${article.title}. ${article.description}`);
            setTranslation(result);
        } catch (err) {
            setTranslationError(err.message || 'Translation failed');
        }
    };

    const handleStoryArc = async () => {
        if (storyArc) {
            setShowStoryArc(!showStoryArc);
            return;
        }
        setStoryArcError(null);
        try {
            const result = await onStoryArc(article.id, article.title);
            setStoryArc(result);
            setShowStoryArc(true);
        } catch (err) {
            setStoryArcError(err.message || 'Story arc failed');
        }
    };

    const isTranslating = translationLoading[article.id];
    const isLoadingArc = storyArcLoading[article.id];

    return (
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden animate-fade-in group">
            {/* Thumbnail */}
            {article.thumbnail && (
                <div className="relative overflow-hidden">
                    <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {/* Category badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        {article.categories.map(cat => (
                            <span key={cat} className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary rounded-full">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-5">
                {/* Categories if no thumbnail */}
                {!article.thumbnail && (
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                        {article.categories.map(cat => (
                            <span key={cat} className="px-2.5 py-0.5 bg-red-50 text-xs font-semibold text-primary rounded-full">
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                {/* Headline */}
                <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <h2 className="text-lg font-bold text-dark-gray leading-snug mb-2 hover:text-primary transition-colors line-clamp-3">
                        {article.title}
                    </h2>
                </a>

                {/* Description */}
                <p className="text-sm text-medium-gray leading-relaxed mb-4 line-clamp-3">
                    {article.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{article.author}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{article.timeAgo}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={handleTranslate}
                        disabled={isTranslating}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
              ${translation
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isTranslating ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Translating...
                            </>
                        ) : translation ? (
                            '✕ Hide Hindi'
                        ) : (
                            'हिंदी में पढ़ें'
                        )}
                    </button>

                    <button
                        onClick={handleStoryArc}
                        disabled={isLoadingArc}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
              ${showStoryArc
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoadingArc ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Analyzing...
                            </>
                        ) : showStoryArc ? (
                            '✕ Hide Story Arc'
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Track Story
                            </>
                        )}
                    </button>
                </div>

                {/* Translation Result */}
                {translation && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 animate-slide-up">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">🇮🇳</span>
                            <span className="text-xs font-semibold text-orange-700">Hindi Translation</span>
                        </div>
                        <p className="text-sm text-orange-900 leading-relaxed">{translation}</p>
                    </div>
                )}

                {translationError && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600">
                        ⚠️ {translationError}
                    </div>
                )}

                {/* Story Arc */}
                {showStoryArc && storyArc && (
                    <StoryArc data={storyArc} />
                )}

                {storyArcError && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600">
                        ⚠️ {storyArcError}
                    </div>
                )}
            </div>
        </article>
    );
}
