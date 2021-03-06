import React, { useState, useCallback, useEffect } from 'react';
import { string } from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { getPaymentState } from 'reducers/payment-reducer';
import { goForward, goBack } from 'actions/payment-actions';

import { getUserState } from 'reducers/user-reducer';
import { fetchAttachGroup } from 'actions/user-actions';

import { fetchMakeOrder } from 'actions/active-order-actions';

import connect from '@vkontakte/vk-connect';

import { View, ScreenSpinner } from '@vkontakte/vkui';

import Home from 'panels/Home';
import Order from 'panels/Order';
import * as PANELS from 'constants/panels';

import AddGroup from 'components/AddGroup';

const callback = (prevPanel, nextPanel) => {
    if (prevPanel === PANELS.HOME) {
        connect.send('VKWebAppEnableSwipeBack');
    }

    window.history.pushState({ panel: nextPanel }, nextPanel);
};

const Payment = ({ id }) => {
    const viewState = useSelector(getPaymentState);
    const [popout, setPopout] = useState(<ScreenSpinner />);

    const { loading, ownedGroups, cashiedGroups } = useSelector(getUserState);

    const [showAddGroup, setShowAddGroup] = useState(false);

    const dispatch = useDispatch();

    const back = useCallback(() => dispatch(goBack), [dispatch]);

    const onAttachGroup = useCallback(async (groupId, accessToken) => {        
        const result = await dispatch(fetchAttachGroup(groupId, accessToken));
        
        if (result) {
            setShowAddGroup(false);
        }
    }, [dispatch]);

    const createOrder = useCallback(async (groupId, value) => {
        setPopout(<ScreenSpinner />);
        const result = await dispatch(fetchMakeOrder(groupId, value));

        if (result) {
            dispatch(goForward(PANELS.ORDER, callback));
        }

        setPopout(null);
    }, [dispatch]);

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

    useEffect(() => {
        if (!loading && Array.isArray(ownedGroups) && Array.isArray(cashiedGroups)) {
            setPopout(null);

            if (ownedGroups.length === 0 && cashiedGroups.length === 0) {
                setShowAddGroup(true);
            }
        }
    }, [loading, ownedGroups, cashiedGroups]);

    return <>
        <View id={id} {...viewState} popout={popout} onSwipeBack={back}>
            <Home id={PANELS.HOME} createOrder={createOrder} />
            <Order id={PANELS.ORDER} back={back} />
        </View>

        <AddGroup
            visible={showAddGroup}
            disabled={true}
            attachGroup={onAttachGroup} />
    </>;
};

Payment.propTypes = {
    id: string.isRequired
};

export default Payment;