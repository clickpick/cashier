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
                cashiedGroups: action.cashiedGroups,
                selectedGroup: (action.ownedGroups.length > 0)
                    ? action.ownedGroups[0]
                    : (action.cashiedGroups.length > 0)
                        ? action.cashiedGroups[0]
                        : null
            };

        case types.FETCH_GROUPS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        case types.ATTACH_OWNED_GROUP:
            return {
                ...state,
                ownedGroups: state.ownedGroups.concat(action.entities),
                selectedGroup: action.entities
            };

        case types.SET_SELECTED_GROUP:            
            return {
                ...state,
                selectedGroup: action.entities
            };

        default:
            return state;
    }
}

export const getUserState = (state) => state.user;
export const getUserLoading = (state) => state.user.loading;
export const getUserGroups = (state) => {
    const { ownedGroups, cashiedGroups } = state.user;

    if (Array.isArray(ownedGroups) && Array.isArray(cashiedGroups)) {
        return ownedGroups.concat(cashiedGroups);
    }

    return null;
}
export const getUserSelectedGroup = (state) => state.user.selectedGroup;