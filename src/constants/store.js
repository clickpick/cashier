import { LOADER } from 'constants/views';
import { HOME } from 'constants/panels';

export const STORY_STATE = LOADER;

export const PAYMENT_STATE = {
    activePanel: HOME,
    history: [HOME]
};

export const INITIAL_STATE = {
    story: STORY_STATE,
    payment: PAYMENT_STATE
};