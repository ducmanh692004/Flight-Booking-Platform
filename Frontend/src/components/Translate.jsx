import { useDynamicTranslate } from '../components/hooks/translateLanguage';

export const TranslateText = ({ text }) => {
    const translatedText = useDynamicTranslate(text);

    return <>{translatedText}</>;
};
