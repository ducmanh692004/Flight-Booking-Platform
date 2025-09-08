// src/hooks/useDynamicTranslate.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export const useDynamicTranslate = (text) => {
    const language = useSelector((state) => state.language.current_language);
    const [translatedText, setTranslatedText] = useState(text);

    useEffect(() => {
        const translate = async () => {
            if (language === 'vi' || !text) {
                setTranslatedText(text);
                return;
            }

            try {
                const res = await fetch(
                    `${MYMEMORY_API}?q=${encodeURIComponent(
                        text
                    )}&langpair=vi|${language}`
                );
                const data = await res.json();

                setTranslatedText(data.responseData.translatedText || text);
            } catch (error) {
                console.error('Translation error:', error);
                setTranslatedText(text); // fallback nếu có lỗi
            }
        };

        translate();
    }, [text, language]);

    return translatedText;
};
