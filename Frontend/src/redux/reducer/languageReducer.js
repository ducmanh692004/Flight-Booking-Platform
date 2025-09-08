const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';

const INITIAL_STATE = {
    current_language: 'vi',
};

const languageReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_LANGUAGE:
            return {
                ...state,
                current_language: action.payload,
            };
        default:
            return state;
    }
};

export default languageReducer;
