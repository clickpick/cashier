import { combineReducers } from 'redux';
import { storyReducer } from 'reducers/story-reducer';

const rootReducer = combineReducers({
    story: storyReducer
});

export default rootReducer;