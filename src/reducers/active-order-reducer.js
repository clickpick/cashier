import { ACTIVE_ORDER } from 'constants/store';
import * as types from 'constants/types';

export function activeOrderReducer(state = ACTIVE_ORDER, action) {
    switch (action.type) {
        case types.SET_ACTIVE_ORDER:
            return action.entities;

        default:
            return state;
    }
}

export const getActiveOrder = (state) => state.activeOrder;