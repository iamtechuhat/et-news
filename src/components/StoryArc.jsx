export default function StoryArc({ data }) {
    if (!data) return null;

    return (
        <div className="mt-4 bg-blue-50 rounded-xl border border-blue-100 overflow-hidden animate-slide-up">
            {/* Background Context */}
            <div className="p-4 border-b border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">📖</span>
                    <h4 className="text-sm font-bold text-blue-900">Background Context</h4>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{data.background}</p>
            </div>

            {/* Follow-up Questions */}
            <div className="p-4 border-b border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">❓</span>
                    <h4 className="text-sm font-bold text-blue-900">Follow-up Questions</h4>
                </div>
                <ul className="space-y-2">
                    {(data.followup_questions || []).map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-200 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-blue-800 mt-0.5">
                                {i + 1}
                            </span>
                            <span className="text-sm text-blue-800 leading-relaxed">{q}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Key People */}
            {data.key_people && data.key_people.length > 0 && (
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">👤</span>
                        <h4 className="text-sm font-bold text-blue-900">Key People</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.key_people.map((person, i) => (
                            <div
                                key={i}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200"
                            >
                                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {(person.name || '?')[0]}
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-blue-900">{person.name}</p>
                                    <p className="text-[10px] text-blue-600">{person.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 bg-blue-100/50">
                <p className="text-[10px] text-blue-500 text-center">Story arc powered by Gemini AI</p>
            </div>
        </div>
    );
}
