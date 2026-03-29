import { useState, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_RETRIES = 3;

async function callAI(prompt, retryCount = 0) {
    if (!API_KEY || API_KEY === 'your_key_here') {
        throw new Error('Please set a valid VITE_GEMINI_API_KEY in your .env file');
    }

    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `You are a helpful news assistant for Economic Times NewsAI.\n\n${prompt}`,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        }),
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 500;
        console.log(`[ET NewsAI] Rate limited, retrying in ${Math.round(delay)}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callAI(prompt, retryCount + 1);
    }

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
            throw new Error('API rate limit reached. Please wait a minute and try again.');
        }
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY.');
        }
        throw new Error(errData?.error?.message || `AI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map(part => part.text).join('')?.trim();
    if (!text) throw new Error('No response from AI');
    return text;
}

export function useGemini() {
    const [translationLoading, setTranslationLoading] = useState({});
    const [briefingLoading, setBriefingLoading] = useState(false);
    const [storyArcLoading, setStoryArcLoading] = useState({});

    const translateToHindi = useCallback(async (articleId, text) => {
        setTranslationLoading(prev => ({ ...prev, [articleId]: true }));
        try {
            const prompt = `Translate this news to simple Hindi in 2-3 sentences: ${text}`;
            const result = await callAI(prompt);
            return result;
        } catch (err) {
            throw err;
        } finally {
            setTranslationLoading(prev => ({ ...prev, [articleId]: false }));
        }
    }, []);

    const generateBriefing = useCallback(async (headlines) => {
        setBriefingLoading(true);
        try {
            const headlineList = headlines.map((h, i) => `${i + 1}. ${h}`).join('\n');
            const prompt = `Create a 60-second morning news briefing in simple English covering these headlines:\n${headlineList}\n\nMake it conversational and engaging. Start with a greeting and end with a sign-off. Use short paragraphs.`;
            const result = await callAI(prompt);
            return result;
        } catch (err) {
            throw err;
        } finally {
            setBriefingLoading(false);
        }
    }, []);

    const getStoryArc = useCallback(async (articleId, headline) => {
        setStoryArcLoading(prev => ({ ...prev, [articleId]: true }));
        try {
            const prompt = `This news is about: ${headline}. Give me 3 related follow-up questions and what background context a reader needs to understand this story fully. Format as JSON with keys: background (string), followup_questions (array of 3 strings), key_people (array of objects with name and role). Return ONLY valid JSON, no markdown formatting.`;
            const result = await callAI(prompt);

            // Extract JSON block even if the model returns extra surrounding text.
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : result;

            try {
                return JSON.parse(jsonText);
            } catch (parseError) {
                console.warn('[ET NewsAI] Failed to parse story arc JSON, using fallback.', parseError);
                return {
                    background: `Unable to parse structured story arc for: ${headline}`,
                    followup_questions: [
                        `What are the latest developments in: ${headline}?`,
                        `Who are the key stakeholders in this story?`,
                        `What should readers watch next in this topic?`,
                    ],
                    key_people: [],
                };
            }
        } catch (err) {
            throw err;
        } finally {
            setStoryArcLoading(prev => ({ ...prev, [articleId]: false }));
        }
    }, []);

    return {
        translateToHindi,
        generateBriefing,
        getStoryArc,
        translationLoading,
        briefingLoading,
        storyArcLoading,
    };
}
