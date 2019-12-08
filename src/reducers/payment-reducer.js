import { PAYMENT_STATE } from 'constants/store';
import * as types from 'constants/types';

export function paymentReducer(state = PAYMENT_STATE, action) {
    switch (action.type) {
        case types.SET_PAYMENT_PANEL:
            return {
                ...state,
                panel: action.nextPanel
            };

        default:
            return state;
    }
}

export const getPaymentPanel = (state) => state.payment.panel;