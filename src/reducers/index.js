import { combineReducers } from 'redux';
import { storyReducer } from 'reducers/story-reducer';
import { paymentReducer } from 'reducers/payment-reducer';

const rootReducer = combineReducers({
    story: storyReducer,
    payment: paymentReducer
});

export default rootReducer;