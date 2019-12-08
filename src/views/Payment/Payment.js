import React, { useCallback, useEffect } from 'react';
import { string } from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { getPaymentState } from 'reducers/payment-reducer';
import { goForward, goBack } from 'actions/payment-actions';

import connect from '@vkontakte/vk-connect';

import { ConfigProvider, View } from '@vkontakte/vkui';

import Home from 'panels/Home';

import * as PANELS from 'constants/panels';

const callback = (p) => window.history.pushState({ panel: p }, p);

const Payment = ({ id }) => {
    const viewState = useSelector(getPaymentState);

    const dispatch = useDispatch();

    const go = useCallback((e) => {
        dispatch(
            goForward(
                e.currentTarget.dataset.panel,
                callback
            )
        );
    }, [dispatch]);

    const back = useCallback(() => dispatch(goBack), [dispatch]);

    useEffect(() => {
        function handlePopState(e) {
            e.preventDefault();

            if (e.state) {
                if (e.state.panel === 'home') {
                    connect.send('VKWebAppDisableSwipeBack');
                }
            } else {
                connect.send('VKWebAppDisableSwipeBack');
                window.history.pushState({ panel: 'home' }, 'home');
            }

            back();
        }

        window.addEventListener('popstate', handlePopState);
        window.history.pushState({ panel: 'home' }, 'home');

        return () => {
            window.history.pushState(null, '');
            window.removeEventListener('popstate', handlePopState);
        };
    }, [back]);

    return (
        <ConfigProvider isWebView={true}>
            <View id={id} {...viewState} onSwipeBack={back}>
                <Home id={PANELS.HOME} />
            </View>
        </ConfigProvider>
    );
};

Payment.propTypes = {
    id: string.isRequired
};

export default Payment;