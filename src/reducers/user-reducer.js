import { USER_STATE } from 'constants/store';
import * as types from 'constants/types';

export function userReducer(state = USER_STATE, action) {
    switch (action.type) {
        case types.FETCH_GROUPS_LOAD:
            return {
                ...state,
                loading: true
            };

        case types.FETCH_GROUPS_SUCCESS:            
            return {
                ...state,
                loading: false,
                ownedGroups: action.ownedGroups,
                cashiedGroups: action.cashiedGroups
            };

        case types.FETCH_GROUPS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        default:
            return state;
    }
}

export const getUserState = (state) => state.user;
export const getUserLoading = (state) => state.user.loading;