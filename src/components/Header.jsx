import { useState } from 'react';

export default function Header({ onBriefing, briefingLoading }) {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg font-serif">ET</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-dark-gray leading-tight">
                                    NewsAI
                                </h1>
                                <p className="text-[10px] text-medium-gray -mt-1 tracking-wider uppercase">
                                    AI-Native News Experience
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Briefing Button */}
                    <button
                        onClick={onBriefing}
                        disabled={briefingLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm 
              hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {briefingLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="hidden sm:inline">Today's Briefing</span>
                                <span className="sm:hidden">Briefing</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary via-red-400 to-orange-400" />
        </header>
    );
}
