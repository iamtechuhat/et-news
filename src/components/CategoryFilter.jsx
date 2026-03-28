const CATEGORIES = ['All', 'Tech', 'Finance', 'Markets', 'Politics', 'Startups', 'World'];

const CATEGORY_ICONS = {
    All: '📰',
    Tech: '💻',
    Finance: '💰',
    Markets: '📈',
    Politics: '🏛️',
    Startups: '🚀',
    World: '🌍',
};

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
    return (
        <div className="sticky top-[66px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === category
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                }`}
                        >
                            <span className="text-sm">{CATEGORY_ICONS[category]}</span>
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
