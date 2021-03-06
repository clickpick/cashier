import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { string, func } from 'prop-types';

import './Settings.css';

import { useSelector, useDispatch } from 'react-redux';
import { getUserSelectedGroup, getAddresses, getAlbums, getCashiers, getUserError } from 'reducers/user-reducer';
import {
    clearUserError,
    fetchCashiers, fetchAttachCashiers, fetchDetachCashier,
    fetchAddresses, fetchUpdateAddress,
    fetchSetPaymentMethod, fetchGroupPaymentParams, fetchGenerateGroupPaymentParams
} from 'actions/user-actions';

import connect from '@vkontakte/vk-connect';

import { STATUS_ACCEPTED, STATUS_DECLINED } from 'constants/group-statuses';
import { TABS, PAYMENT_GROUP_MESSAGE } from 'constants/settings';

import {
    Panel, PanelHeader,
    List, Cell, Avatar,
    Alert, FixedLayout,
    Group, Snackbar
} from '@vkontakte/vkui';
import Tabs from 'components/Tabs';
import Loader from 'components/Loader';
import ShopCard from 'components/ShopCard';
import Tag from 'components/Tag';
import Title from 'components/Title';
import Button from 'components/Button';
import Message from 'components/Message';
import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';

import { ReactComponent as IconTrash } from 'svg/trash.svg';
import { ReactComponent as IconVk } from 'svg/vk.svg';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import { PAYMENT_NOT_ACCEPT, PAYMENT_GROUP, PAYMENT_SERVICE } from 'constants/payment-methods';

const errorStyle = {
    backgroundColor: 'var(--color-red)'
};

const Settings = ({ id, activeTab, toggleSpinnerPopup, openPopout, closePopout, onTabChange }) => {
    const selectedGroup = useSelector(getUserSelectedGroup);
    const [loadingAddresses, addresses] = useSelector(getAddresses);
    const [loadingAlbums, albums] = useSelector(getAlbums);
    const [loadingCashiers, cashiers] = useSelector(getCashiers);

    const error = useSelector(getUserError);

    const dispatch = useDispatch();

    const hideSpinner = useCallback(() => dispatch(clearUserError()), [dispatch]);

    /**
     * Методы для группы
     */
    const [showSetAlbum, setShowSetAlbum] = useState(false);
    const [address, setAddress] = useState(null);

    const openSetAlbum = useCallback((address) => {
        setAddress(address);
        setShowSetAlbum(true);
    }, []);

    const closeSetAlbum = useCallback(() => {
        setAddress(null);
        setShowSetAlbum(false);
    }, []);

    const tag = useMemo(() => {
        if (selectedGroup) {
            let props = { children: 'На рассмотрении' };

            if (selectedGroup.status === STATUS_ACCEPTED) {
                props = { children: 'В каталоге', theme: 'green' };
            }

            if (selectedGroup.status === STATUS_DECLINED) {
                props = { children: 'Отклонено', theme: 'red' };
            }

            return <Tag {...props} />;
        }

        return undefined;
    }, [selectedGroup]);

    const renderAddress = useCallback((address, index) =>
        <Cell
            key={index}
            className="Settings__address"
            before={<Avatar src={address.thumb} size={28} />}
            children={address.address}
            description={address.title}
            onClick={() => openSetAlbum(address)} />, [openSetAlbum]);

    const setAlbum = useCallback((album) => {
        dispatch(fetchUpdateAddress({
            ...address,
            album_id: album.id,
            thumb: album.thumb_src
        }));
        closeSetAlbum();
    }, [address, closeSetAlbum, dispatch]);

    const renderAlbum = useCallback((album, index) =>
        <Cell
            key={index}
            className="Settings__address"
            before={<Avatar src={album.thumb_src} size={28} />}
            children={album.title}
            description={album.description}
            asideContent={(address.album_id === album.id) ? <Icon24Done className="Settings__Icon24Done" /> : undefined}
            data-album-id={album.id}
            onClick={() => setAlbum(album)} />, [address, setAlbum]);

    useEffect(() => {
        if (!loadingAddresses && addresses === null && activeTab === 'general') {
            dispatch(fetchAddresses);
        }
    }, [activeTab, loadingAddresses, addresses, dispatch]);

    /**
     * Методы для сотрудников
     */
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
            toggleSpinnerPopup();
        } catch (e) {}
    }, [dispatch, toggleSpinnerPopup]);

    useEffect(() => {
        if (!loadingCashiers && cashiers === null && activeTab === 'cashiers') {
            dispatch(fetchCashiers);
        }
    }, [activeTab, loadingCashiers, cashiers, dispatch]);

    /**
     * Методы для настройки получения денег
     */

    const paymentMethodNotAllowed = useMemo(() => {
        if (selectedGroup) {
            return selectedGroup.payment_method === PAYMENT_NOT_ACCEPT || selectedGroup.payment_method === '';
        }

        return false;
    }, [selectedGroup]);
    const paymentMethodGroup = useMemo(() => selectedGroup && selectedGroup.payment_method === PAYMENT_GROUP, [selectedGroup]);
    const paymentMethodService = useMemo(() => selectedGroup && selectedGroup.payment_method === PAYMENT_SERVICE, [selectedGroup]);
    
    const getGroupPaymentParams = useCallback(async () => {
        toggleSpinnerPopup();
        await dispatch(fetchGroupPaymentParams());
        toggleSpinnerPopup();
    }, [toggleSpinnerPopup, dispatch]);

    const setPaymentMethod = useCallback(async (paymentMethod) => {
        toggleSpinnerPopup();
        await dispatch(fetchSetPaymentMethod(selectedGroup.id, paymentMethod));
        toggleSpinnerPopup();
    }, [selectedGroup, toggleSpinnerPopup, dispatch]);

    const handlePaymentMethodChange = useCallback((e) => {
        if (e.target.value === '' && !paymentMethodNotAllowed) {            
            return setPaymentMethod(PAYMENT_NOT_ACCEPT);
        }

        if (e.target.value === PAYMENT_GROUP && !paymentMethodGroup) {
            return getGroupPaymentParams();
        }
    }, [
        paymentMethodNotAllowed, paymentMethodGroup,
        setPaymentMethod,
        getGroupPaymentParams
    ]);

    useEffect(() => {
        if (
            activeTab === 'money' &&
            selectedGroup &&
            selectedGroup.payment_method === PAYMENT_GROUP &&
            !selectedGroup.groupPaymentParams
        ) {
            getGroupPaymentParams();
        }
    }, [activeTab, selectedGroup, getGroupPaymentParams]);

    const generateGroupPaymentParams = useCallback(async () => {
        toggleSpinnerPopup();
        await dispatch(fetchGenerateGroupPaymentParams());
        toggleSpinnerPopup();
    }, [toggleSpinnerPopup, dispatch]);

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
                {(selectedGroup) && <>
                    <ShopCard
                        className="Settings__ShopCard"
                        {...selectedGroup}
                        afterContent={tag} />

                    {(selectedGroup.status === STATUS_DECLINED) &&
                        <Title children="Заведение отклонено" />}
                </>}

                <Group className="Settings__addresses" title="Фотографии филиалов">
                    {(loadingAddresses || loadingAlbums) && <Loader center />}

                    {(Array.isArray(addresses)) ?
                        (addresses.length === 0)
                            ? <Title children="Адреса отсутствуют" hint="Добавьте адреса в настройках группы" />
                            : (Array.isArray(albums) && albums.length === 0)
                                ? <Title children="Доступных альбомов нет" hint="Добавьте хотя бы один альюлм в группу" />
                                : addresses.map(renderAddress)
                        : null}
                        
                </Group>

                <FixedLayout
                    className="Settings__FixedLayout"
                    vertical="bottom">
                    <Button
                        className="Settings__Button"
                        theme="primary"
                        size="medium"
                        href="https://vk.me/click_places"
                        target="_blank"
                        children="Написать разработчику"
                        before={<IconVk />}
                        full />
                </FixedLayout>
            </details>

            <details className="Settings__details" open={activeTab === 'cashiers'}>
                <summary />
                
                {(loadingCashiers) && <Loader center />}

                {(Array.isArray(cashiers))
                    ? (cashiers.length > 0)
                        ? <div className="Settings__cashiers" children={cashiers.map(renderCashier)} />
                        : <Title
                            className="Settings__Title"
                            children="Сотрудники отсутствуют"
                            hint="Добавьте новых сотрудников" />
                        : null}

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
                        full />
                </FixedLayout>
            </details>

            {(selectedGroup) &&
                <details className="Settings__details" open={activeTab === 'money'}>
                    <summary />
                    <List className="Settings__List">
                        <Cell
                            className="Settings__Cell  Settings__Cell--selectable"
                            selectable
                            checked={paymentMethodNotAllowed}
                            value={''}
                            onChange={handlePaymentMethodChange}
                            children="Не принимать оплату" />
                        <Cell
                            className="Settings__Cell  Settings__Cell--selectable"
                            selectable
                            checked={paymentMethodGroup}
                            value={PAYMENT_GROUP}
                            onChange={handlePaymentMethodChange}
                            children="Принимать как физ. лицо" />
                        <Cell
                            className="Settings__Cell  Settings__Cell--selectable  Settings__Cell--disabled"
                            selectable
                            checked={paymentMethodService}
                            value={PAYMENT_SERVICE}
                            onChange={handlePaymentMethodChange}
                            children="Принимать как юр. лицо (скоро)" />
                    </List>

                    {(paymentMethodGroup) &&
                        <Message
                            className="Settings__Message"
                            theme="gray"
                            size="small"
                            children={PAYMENT_GROUP_MESSAGE} />}

                    
                    {(selectedGroup.groupPaymentParams) && <>
                        {(selectedGroup.groupPaymentParams.is_ready)
                            ? <p className="Settings__status" children="Статус: Всё готово." />
                            : <>
                                <p className="Settings__status" children="Статус: почти готово. Осталось сгенерировать параметры." />
                                <Button
                                    className="Settings__Button  Settings__Button--generate-payment-params"
                                    theme="primary"
                                    children="Сгенерировать параметры"
                                    onClick={generateGroupPaymentParams} />
                            </>}
                    </>}
                </details>}

            {(error) &&
                <Snackbar
                    before={<Avatar size={24} style={errorStyle}><Icon24Cancel fill="#fff" width={14} height={14} /></Avatar>}
                    children={error}
                    action="Закрыть"
                    onActionClick={hideSpinner}
                    onClose={hideSpinner} />}

            <PopupContainer>
                <Popup visible={showSetAlbum} onClose={closeSetAlbum}>
                    {(address) && <>
                        <Title children={`Фотографии для "${address.address}"`} />
                        {albums.map(renderAlbum)}
                    </>}
                </Popup>
            </PopupContainer>
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