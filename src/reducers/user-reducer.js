import { USER_STATE } from 'constants/store';
import * as types from 'constants/types';

export function userReducer(state = USER_STATE, action) {
    switch (action.type) {
        case types.FETCH_GROUPS_LOAD: case types.FETCH_CASHIERS_LOAD:
            return {
                ...state,
                loading: true
            };

        case types.FETCH_GROUPS_SUCCESS:
            return {
                ...state,
                loading: false,
                ownedGroups: action.ownedGroups.map((group) => ({ ...group, owned: true, cashiers: null })),
                cashiedGroups: action.cashiedGroups.map((group) => ({ ...group, owned: false })),
                selectedGroup: (action.ownedGroups.length > 0)
                    ? { ...action.ownedGroups[0], owned: true, cashiers: null }
                    : (action.cashiedGroups.length > 0)
                        ? { ...action.cashiedGroups[0], owned: false }
                        : null
            };

        case types.FETCH_GROUPS_ERROR: case types.FETCH_CASHIERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        case types.ATTACH_OWNED_GROUP:
            const newOwnedGroups = { ...action.entities, owned: true };

            return {
                ...state,
                ownedGroups: state.ownedGroups.concat(newOwnedGroups),
                selectedGroup: newOwnedGroups
            };

        case types.SET_SELECTED_GROUP:            
            return {
                ...state,
                selectedGroup: action.entities
            };

        case types.FETCH_CASHIERS_SUCCESS:
            return {
                ...state,
                loading: false,
                ownedGroups: (state.selectedGroup)
                    ? state.ownedGroups.map((group) => {
                        if (group.id === state.selectedGroup.id) {
                            return {
                                ...group,
                                cashiers: action.cashiers
                            };
                        }

                        return group;
                    })
                    : state.ownedGroups,
                selectedGroup: {
                    ...state.selectedGroup,
                    cashiers: action.cashiers
                }
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
export const getCashiers = (state) => {
    const selectedGroups = getUserSelectedGroup(state);

    if (selectedGroups) {
        return [getUserLoading(state), selectedGroups.cashiers];
    }

    return [false, []];
};