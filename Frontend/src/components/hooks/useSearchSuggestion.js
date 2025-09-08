import { useState, useEffect, useCallback } from 'react';
import { handleFetchSearchSuggestion } from '../../services/UserFlightList';

const useSearchSuggestion = (keyword, delay = 300) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const fetchSuggestions = useCallback(async (searchKeyword) => {
        if (!searchKeyword.trim()) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await handleFetchSearchSuggestion(searchKeyword);
            if (response?.EC === 0) {
                setSuggestions(response.DT || []);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (showSuggestions) {
                fetchSuggestions(keyword);
            }
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [keyword, showSuggestions, fetchSuggestions, delay]);

    const hideSuggestions = useCallback(() => {
        setShowSuggestions(false);
    }, []);

    const showSuggestionsHandler = useCallback(() => {
        setShowSuggestions(true);
    }, []);

    return {
        suggestions,
        loading,
        showSuggestions,
        hideSuggestions,
        showSuggestionsHandler,
    };
};

export default useSearchSuggestion;
