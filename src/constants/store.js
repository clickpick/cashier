import { PAYMENT } from 'constants/views';
import { HOME } from 'constants/panels';

export const STORY_STATE = PAYMENT;

export const PAYMENT_STATE = {
    activePanel: HOME,
    history: [HOME]
};

export const SETTINGS_STATE = {
    activeTab: 'general'
};

export const USER_STATE = {
    loading: false,
    ownedGroups: null,
    cashiedGroups: null,
    selectedGroup: null,
    error: false
};

export const ACTIVE_ORDER = null;

export const INITIAL_STATE = {
    story: STORY_STATE,
    payment: PAYMENT_STATE,
    settings: SETTINGS_STATE,
    user: USER_STATE,
    activeOrder: ACTIVE_ORDER
};