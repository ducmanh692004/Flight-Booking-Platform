import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../Translate';

const SearchSuggestion = memo(({ suggestions, loading, onSelect }) => {
    const handleItemClick = (item) => {
        onSelect(item.province);
    };
    const { t } = useTranslation();

    return (
        <div
            className="p-2 pt-2 px-3"
            style={{
                position: 'absolute',
                top: '100%',
                marginTop: '5px',
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                height: '300px',
                width: '550px',
                overflowY: 'auto',
            }}
        >
            {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                    <div
                        className="d-flex justify-content-between w-100 pt-3 pb-3 list-group-item-action"
                        style={{
                            borderBottom: '1px solid #dee2e6',
                            cursor: 'pointer',
                        }}
                        key={`${item.province}-${index}`}
                        onClick={() => handleItemClick(item)}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                    >
                        <span>{<TranslateText text={item.name} />}</span>
                        <span>{<TranslateText text={item.province} />}</span>
                    </div>
                ))
            ) : (
                <div className="text-center text-muted py-4">
                    {t('failSearchDestinationSuggestion')}
                </div>
            )}
        </div>
    );
});

SearchSuggestion.displayName = 'SearchSuggestion';

export default SearchSuggestion;
