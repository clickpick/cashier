import { ACTIVE_ORDER } from 'constants/store';
import * as types from 'constants/types';

export function activeOrderReducer(state = ACTIVE_ORDER, action) {
    switch (action.type) {
        case types.SET_ACTIVE_ORDER:
            return action.entities;

        case types.UPDATE_ACTIVE_ORDER:
            return {
                ...state,
                ...action.entities
            };

        default:
            return state;
    }
}

export const getActiveOrder = (state) => state.activeOrder;