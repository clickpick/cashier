import { combineReducers } from 'redux';
import { storyReducer } from 'reducers/story-reducer';
import { paymentReducer } from 'reducers/payment-reducer';
import { settingsReducer } from 'reducers/settings-reducer';

const rootReducer = combineReducers({
    story: storyReducer,
    payment: paymentReducer,
    settings: settingsReducer
});

export default rootReducer;