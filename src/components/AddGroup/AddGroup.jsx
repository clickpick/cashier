import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { bool, func, arrayOf, object } from 'prop-types';

import './AddGroup.css';

import connect from '@vkontakte/vk-connect';
import { VK_APP_ID, VK_API_VERSION } from 'constants/vk';

import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';
import Title from 'components/Title';
import { Cell, Avatar } from '@vkontakte/vkui';

const AddGroup = ({ visible, disabled, selectedGroups, attachGroup, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const actions = useRef(undefined);

    const [showAccessPopup, setShowAccessPopup] = useState(visible);
    const [showError, setShowError] = useState(false);

    const [groups, setGroups] = useState([]);
    const [showOwnedGroupsList, setShowOwnedGroupsList] = useState(false);

    const accessActions = useMemo(() => ([{
        theme: 'primary',
        title: 'Разрешить доступ',
        full: true,
        backlight: true,
        disabled: loading,
        action: async () => {
            setLoading(true);

            try {
                const { access_token } = await connect.sendPromise('VKWebAppGetAuthToken', {
                    app_id: VK_APP_ID,
                    scope: 'groups'
                });

                const { response: { items } } = await connect.sendPromise('VKWebAppCallAPIMethod', {
                    method: 'groups.get',
                    params: {
                        extended: 1,
                        filter: 'admin',
                        fields: ['name', 'photo_100', 'activity'],
                        access_token,
                        v: VK_API_VERSION
                    }
                });

                let groups = items
                if (selectedGroups && Array.isArray(selectedGroups) && selectedGroups.length > 0) {
                    groups = items.filter((item) => {
                        if (selectedGroups.find((group) => group.id === item.id)) {
                            return false;
                        }

                        return true;
                    });
                }

                setGroups(groups);
                setShowAccessPopup(false);
                setTimeout(() => setShowOwnedGroupsList(true), 75);
                setLoading(false);
            } catch (e) {
                setError('Для дальнейшей работы предоставьте доступ к вашим сообществам.');
                setShowAccessPopup(false);
                setTimeout(() => setShowError(true), 75);
            }
        }
    }]), [loading, selectedGroups]);

    const reshowGroups = useCallback(() => {
        setShowError(false);
        setTimeout(() => setShowOwnedGroupsList(true), 75);
    }, []);

    const onGroupClick = useCallback(async (e) => {
        const { groupId } = e.currentTarget.dataset;
        
        try {
            const { access_token } = await connect.sendPromise('VKWebAppGetCommunityAuthToken', {
                app_id: VK_APP_ID,
                group_id: Number(groupId),
                scope: 'manage'
            });

            attachGroup(groupId, access_token);
        } catch (e) {
            actions.current = [{
                theme: 'primary',
                title: 'Выбрать сообщество',
                full: true,
                backlight: true,
                action: reshowGroups
            }];

            setError('Для добавления сообщества, мы должны получиться доступ к нему.');
            setShowOwnedGroupsList(false);
            setTimeout(() => setShowError(true), 75);
        }
    }, [attachGroup, actions, reshowGroups]);

    const renderGroup = useCallback((group, index) =>
        <Cell
            key={index}
            before={<Avatar src={group.photo_100} alt={group.name} size={48} />}
            children={group.name}
            data-group-id={group.id}
            description={group.activity}
            onClick={onGroupClick} />, [onGroupClick]);

    useEffect(() => {
        setShowAccessPopup(visible);

        if (!visible) {
            if (showAccessPopup) {
                setShowAccessPopup(false);
            }
            if (showError) {
                setShowError(false);
            }
            if (showOwnedGroupsList) {
                setShowOwnedGroupsList(false);
            }
        }
    }, [visible, showAccessPopup, showError, showOwnedGroupsList]);

    return (
        <PopupContainer>
            <Popup
                visible={showAccessPopup}
                disabled={disabled}
                actions={accessActions}
                onClose={(showAccessPopup) ? onClose : undefined}>
                <Title>Разрешите<br />получить нам доступ к Вашим группам</Title>
            </Popup>
            <Popup
                visible={showOwnedGroupsList}
                disabled={disabled}
                onClose={(showOwnedGroupsList) ? onClose : undefined}>
                <Title>Выберите нужное<br />сообщество</Title>
                {groups.map(renderGroup)}
            </Popup>
            <Popup
                visible={showError}
                disabled={disabled}
                actions={actions.current}
                onClose={(showError) ? onClose : undefined}>
                <Title>Упс... Ошибка</Title>
                <p className="AddGroup__message" children={error} />
            </Popup>
        </PopupContainer>
    );
};

AddGroup.propTypes = {
    visible: bool,
    disabled: bool,
    selectedGroups: arrayOf(object),
    attachGroup: func,
    onClose: func
};

export default AddGroup;