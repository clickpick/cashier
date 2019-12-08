import React, { useCallback } from 'react';
import { string, func } from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { getPaymentPanel } from 'reducers/payment-reducer';
import { setPanel } from 'actions/payment-actions';
import useNavigation from 'hooks/use-navigation';

import { ConfigProvider, View } from '@vkontakte/vkui';

import Home from 'panels/Home';

const Main = ({ id }) => {
    const activePanel = useSelector(getPaymentPanel);
    // const [activePanel, history, goForward, goBack] = useNavigation('home');

    const dispatch = useDispatch();

    const onPanelChange = useCallback((e) => dispatch(setPanel(e.currentTarget.dataset.panel)), [dispatch]);

    return (
        <ConfigProvider isWebView={true}>
            <View
                id={id}
                activePanel={activePanel}>
                {/* // history={history}
                // onSwipeBack={goBack}> */}
                <Home id="home" />
            </View>
        </ConfigProvider>
    );
};

Main.propTypes = {
    id: string.isRequired,
    goOrder: func.isRequired
};

export default Main;