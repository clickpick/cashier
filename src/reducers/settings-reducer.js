import { SETTINGS_STATE } from 'constants/store';
import * as types from 'constants/types';

export function settingsReducer(state = SETTINGS_STATE, action) {
    switch (action.type) {
        case types.SET_SETTINGS_TAB:
            return {
                ...state,
                activeTab: action.tab
            };

        default:
            return state;
    }
}

export const getActiveTab = (state) => state.settings.activeTab;