import * as types from 'constants/types';

const setPanel = (nextPanel, nextHistory) => ({
    type: types.SET_PAYMENT_PANEL,
    nextPanel,
    nextHistory
});

const goForward = (nextPanel, callback) => (dispatch, getState) => {
    const { payment: { history } } = getState();

    const nextHistory = [...history, nextPanel];

    // if (activePanel === initialActivePanel) {
    //     connect.send('VKWebAppEnableSwipeBack');
    // }

    // window.history.pushState({ panel: nextPanel }, nextPanel);
    
    dispatch(setPanel(nextPanel, nextHistory));
    callback();
};

const goBack = (dispatch, getState) => {
    const { payment: { history } } = getState();
    const nextHistory = [...history];

    if (nextHistory.length < 2) {
        return;
    }

    nextHistory.pop();
    const nextPanel = nextHistory[nextHistory.length - 1];

    dispatch(setPanel(nextPanel, nextHistory));
};

export { goForward, goBack };