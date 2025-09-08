import {
    FETCH_USER_LOGIN_SUCCESS,
    USER_LOGOUT_SUCCESS,
    UPDATE_INFORMATION,
} from '../actions/userAction';

const INITIAL_STATE = {
    account: {
        token: '',
        id: '',
        username: '',
        email: '',
        address: '',
        phone: '',
        image: '',
        sex: '',
        birthDay: '',
        group: '',
        groupWithRoles: {},
    },
    isAuthenticated: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_LOGIN_SUCCESS:
            return {
                ...state,
                account: {
                    token: action?.payload?.access_token,
                    id: action?.payload?.id,
                    username: action?.payload?.fullname,
                    email: action?.payload?.email,
                    address: action?.payload?.address || '',
                    phone: action?.payload?.phone || '',
                    image: action?.payload?.image || '',
                    sex: action?.payload?.sex || '',
                    birthDay: action?.payload?.birthDay || '',
                    group: action?.payload?.group,
                    groupWithRoles: action?.payload?.groupWithRoles || {},
                },
                isAuthenticated: true,
            };

        case USER_LOGOUT_SUCCESS:
            return INITIAL_STATE;

        case UPDATE_INFORMATION:
            return {
                ...state,
                account: {
                    ...state.account,
                    username: action.payload.username,
                    address: action.payload.address,
                    phone: action.payload.phone,
                    sex: action.payload.sex,
                    birthDay: action.payload.birthDay,
                },
            };

        default:
            return state;
    }
};

export default userReducer;
