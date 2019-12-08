import { combineReducers } from 'redux';
import { storyReducer } from 'reducers/story-reducer';
import { paymentReducer } from 'reducers/payment-reducer';
import { settingsReducer } from 'reducers/settings-reducer';
import { userReducer } from 'reducers/user-reducer';

const rootReducer = combineReducers({
    story: storyReducer,
    payment: paymentReducer,
    settings: settingsReducer,
    user: userReducer
});

export default rootReducer;