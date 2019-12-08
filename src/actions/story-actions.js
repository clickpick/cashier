import * as types from 'constants/types';

const setStory = (nextStory) => ({
    type: types.SET_STORY,
    nextStory
});

export { setStory };