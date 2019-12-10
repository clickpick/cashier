import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { bool, func, arrayOf, object } from 'prop-types';

import './AddGroup.css';

import connect from '@vkontakte/vk-connect';
import { VK_APP_ID, VK_API_VERSION } from 'constants/vk';

import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';
import Title from 'components/Title';
import { Cell, Avatar } from '@vkontakte/vkui';

const POPUPS = {
    ACCESS_TOKEN: 'access-token',
    OWNED_GROUPS: 'owned-groups',
    ERROR: 'error'
};

const AddGroup = ({ visible, disabled, selectedGroups, attachGroup, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const actions = useRef(undefined);

    const [showPopup, setShowPopup] = useState(null);
    const [groups, setGroups] = useState([]);

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
                setShowPopup(POPUPS.OWNED_GROUPS);
                setLoading(false);
            } catch (e) {
                setError('Для дальнейшей работы предоставьте доступ к вашим сообществам.');
                setShowPopup(POPUPS.ERROR);
            }
        }
    }]), [loading, selectedGroups]);

    const reshowGroups = useCallback(() => setShowPopup(POPUPS.OWNED_GROUPS), []);

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
            setShowPopup(POPUPS.ERROR);
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

    useEffect(() => setShowPopup((visible) ? POPUPS.ACCESS_TOKEN : null), [visible]);

    return (
        <PopupContainer>
            <Popup
                visible={showPopup === POPUPS.ACCESS_TOKEN}
                disabled={disabled}
                actions={accessActions}
                onClose={(showPopup === POPUPS.ACCESS_TOKEN) ? onClose : undefined}>
                <Title>Разрешите<br />получить нам доступ к Вашим группам</Title>
            </Popup>
            <Popup
                visible={showPopup === POPUPS.OWNED_GROUPS}
                disabled={disabled}
                onClose={(showPopup === POPUPS.OWNED_GROUPS) ? onClose : undefined}>
                <Title>Выберите нужное<br />сообщество</Title>
                {groups.map(renderGroup)}
            </Popup>
            <Popup
                visible={showPopup === POPUPS.ERROR}
                disabled={disabled}
                actions={actions.current}
                onClose={(showPopup === POPUPS.ERROR) ? onClose : undefined}>
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