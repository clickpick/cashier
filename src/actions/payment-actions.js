import * as types from 'constants/types';

const setPanel = (nextPanel) => ({
    type: types.SET_PAYMENT_PANEL,
    nextPanel
});

export { setPanel };