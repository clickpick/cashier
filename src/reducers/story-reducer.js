import { STORY_STATE } from 'constants/store';
import * as types from 'constants/types';

export function storyReducer(state = STORY_STATE, action) {
    switch (action.type) {
        case types.SET_STORY:
            return action.nextStory;
        default:
            return state;
    }
}

export const getStory = (state) => state.story;