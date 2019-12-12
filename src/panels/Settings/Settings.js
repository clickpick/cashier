import React, { useCallback, useEffect } from 'react';
import { string, func } from 'prop-types';

import './Settings.css';

import { useSelector, useDispatch } from 'react-redux';
import { getCashiers } from 'reducers/user-reducer';
import { fetchCashiers, fetchAttachCashiers, fetchDetachCashier } from 'actions/user-actions';

import connect from '@vkontakte/vk-connect';

import { TABS } from 'constants/settings';

import { Panel, PanelHeader, Cell, Avatar, Alert, FixedLayout } from '@vkontakte/vkui';
import Tabs from 'components/Tabs';
import Loader from 'components/Loader';
import Title from 'components/Title';
import Button from 'components/Button';

import { ReactComponent as IconTrash } from 'svg/trash.svg';
import { ReactComponent as IconVk } from 'svg/vk.svg';

const Settings = ({ id, activeTab, toggleSpinnerPopup, openPopout, closePopout, onTabChange }) => { 
    const [loading, cashiers] = useSelector(getCashiers);

    const dispatch = useDispatch();

    const showDetachAlert = useCallback((e) => {
        e.persist();
        const cashierId = Number(e.currentTarget.dataset.cashierId);

        openPopout(
            <Alert
                actions={[{
                    title: 'Удалить',
                    autoclose: true,
                    style: 'destructive',
                    action: async () => {
                        toggleSpinnerPopup();
                        await dispatch(fetchDetachCashier(cashierId));
                        toggleSpinnerPopup();
                    }
                }, {
                    title: 'Не удалять',
                    autoclose: true,
                    style: 'cancel'
                }]}
                onClose={closePopout}>
                <h2>Подтвердите действие</h2>
                <p>Вы уверены, что хотите удалить кассира?</p>
            </Alert>
        );
    }, [openPopout, closePopout, toggleSpinnerPopup, dispatch]);

    const renderCashier = useCallback((cashier, index) => {
        const name = `${cashier.first_name} ${cashier.last_name}`;

        return <Cell
            key={index}
            className="Settings__Cell"
            before={<Avatar src={cashier.avatar_200} size={48} alt={name} />}
            children={name}
            description="Кассир"
            asideContent={
                <button
                    className="Settings__detach"
                    children={<IconTrash />}
                    data-cashier-id={cashier.id}
                    onClick={showDetachAlert} />
            } />;
    }, [showDetachAlert]);

    const attachCashiers = useCallback(async () => {
        try {
            const { users } = await connect.sendPromise('VKWebAppGetFriends', { multi: true });

            toggleSpinnerPopup();
            await dispatch(fetchAttachCashiers(users));
        } catch (e) {}
        toggleSpinnerPopup();
    }, [dispatch, toggleSpinnerPopup]);

    useEffect(() => {
        if (!loading && cashiers === null) {            
            dispatch(fetchCashiers);
        }
    }, [loading, cashiers, dispatch]);

    return (
        <Panel id={id} className="Settings">
            <PanelHeader children="Настройки" noShadow={true} />

            <FixedLayout vertical="top">
                <Tabs
                    className="Settings__Tabs"
                    items={TABS}
                    activeItem={activeTab}
                    onClick={onTabChange} />
            </FixedLayout>

            <details className="Settings__details" open={activeTab === 'general'}>
                <summary />
                general
            </details>

            <details className="Settings__details" open={activeTab === 'cashiers'}>
                <summary />
                
                {(loading) && <Loader center />}
                {(Array.isArray(cashiers)) &&
                    (cashiers.length > 0)
                        ? <div className="Settings__cashiers" children={cashiers.map(renderCashier)} />
                        : <Title
                            className="Settings__Title"
                            children="Кассиры отсутствуют"
                            hint="Добавьте кассиров" />}

                <FixedLayout
                    className="Settings__FixedLayout"
                    vertical="bottom">
                    <Button
                        className="Settings__Button"
                        theme="primary"
                        size="medium"
                        children="Добавить сотрудника"
                        before={<IconVk />}
                        onClick={attachCashiers}
                        full
                        backlight />
                </FixedLayout>
            </details>

            <details className="Settings__details" open={activeTab === 'money'}>
                <summary />
                money
            </details>

        </Panel>
    );
};

Settings.propTypes = {
    id: string.isRequired,
    activeTab: string.isRequired,
    toggleSpinnerPopup: func.isRequired,
    openPopout: func.isRequired,
    closePopout: func.isRequired,
    onTabChange: func.isRequired
};

export default Settings;