import { PAYMENT_STATE } from 'constants/store';
import * as types from 'constants/types';

export function paymentReducer(state = PAYMENT_STATE, action) {
    switch (action.type) {
        case types.SET_PAYMENT_PANEL:
            return {
                ...state,
                activePanel: action.nextPanel,
                history: action.nextHistory
            };

        default:
            return state;
    }
}

export const getPaymentState = (state) => ({
    activePanel: state.payment.activePanel,
    history: state.payment.history
});