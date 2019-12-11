import React, { useEffect } from 'react';
import { string, func } from 'prop-types';

import './Order.css';

import { useSelector, useDispatch } from 'react-redux';
import { getActiveOrder } from 'reducers/active-order-reducer';
import { updateActiveOrder } from 'actions/active-order-actions';

import { Panel, PanelHeader, PanelHeaderBack, FixedLayout } from '@vkontakte/vkui';

import Title from 'components/Title';
import QR from 'components/QR';
import Success from 'components/Success';
import Error from 'components/Error';
import Button from 'components/Button';

import { gaps } from 'helpers/numbers';
import { CREATED, PAID, ERROR_PAY } from 'constants/order';
import { callTaptic, TAPTIC_SUCCESS } from 'helpers/taptic';
import { VK_MAIN_APP_ID } from 'constants/vk';

const Order = ({ id, back }) => {
    const activeOrder = useSelector(getActiveOrder);

    const dispatch = useDispatch();

    useEffect(() => {        
        window.Echo
            .private(`order.${activeOrder.id}`)
            .listen('OrderUpdated', ({ order }) => {
                if (order.status === PAID) {
                    callTaptic(TAPTIC_SUCCESS);
                }

                dispatch(updateActiveOrder(order));
            });

        return () => window.Echo.leave(`order.${activeOrder.id}`);
    }, [activeOrder.id, dispatch]);

    return (
        <Panel id={id} className="Order">
            <PanelHeader left={<PanelHeaderBack onClick={back} />} noShadow={true} />

            {(activeOrder) && <>
                {(activeOrder.status === CREATED) && <>
                    <Title
                        className="Order__Title"
                        children={`К оплате ${gaps(activeOrder.value)} ₽`}
                        hint="Покажите QR-счёт клиенту" />
                    <QR
                        className="Order__QR"
                        value={`https://vk.com/app${VK_MAIN_APP_ID}#order=${activeOrder.id}`} />
                </>}

                {(activeOrder.status === PAID) && <>
                    <Title
                        className="Order__Title"
                        type="success"
                        children={`${gaps(activeOrder.value)} ₽ оплачено`} />
                    <Success className="Order__Success" />

                    <FixedLayout
                        className="Order__FixedLayout"
                        vertical="bottom">
                        <Button
                            className="Order__Button"
                            theme="primary"
                            size="medium"
                            children="Вернуться на главную"
                            full
                            backlight
                            onClick={back} />
                    </FixedLayout>
                </>}

                {(activeOrder.status === ERROR_PAY) && <>
                    <Title
                        className="Order__Title"
                        type="error"
                        children={`${gaps(activeOrder.value)} ₽ не оплачено`} />
                    <Error className="Order__Error" />
                </>}
            </>}
        </Panel>
    );
};

Order.propTypes = {
    id: string.isRequired,
    back: func.isRequired
};

export default Order;