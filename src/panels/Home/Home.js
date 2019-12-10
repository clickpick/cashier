import React, { useState, useMemo, useCallback } from 'react';
import { string } from 'prop-types';

import './Home.css';

import { useSelector, useDispatch } from 'react-redux';
import { getUserGroups, getUserSelectedGroup } from 'reducers/user-reducer';
import { selectGroup, fetchAttachGroup } from 'actions/user-actions';

import {
    Panel, PanelHeader, PanelHeaderContent,
    HeaderContext, List, Cell, Avatar
} from '@vkontakte/vkui';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import Input from 'components/Input';
import Button from 'components/Button';
import AddGroup from 'components/AddGroup';

const MODES = {
    SELECT_GROUP: 'select-group',
    ADD_GROUP: 'add-group'
};

const Home = ({ id }) => {
    const groups = useSelector(getUserGroups);
    const selectedGroup = useSelector(getUserSelectedGroup);

    const dispatch = useDispatch();

    const [contextOpened, setContextOpened] = useState(false);
    const [showAddGroup, setShowAddGroup] = useState(false);

    const [cash, setCash] = useState('');

    const hasGroups = useMemo(() => Array.isArray(groups) && groups.length > 0, [groups]);

    const toggleContext = useCallback(() => setContextOpened(state => !state), []);
    const toggleAddGroup = useCallback(() => setShowAddGroup(state => !state), []);

    const setSelectedGroup = useCallback((group) => dispatch(selectGroup(group)), [dispatch]);

    const select = useCallback((e) => {
        const { mode, groupId } = e.currentTarget.dataset;

        switch (mode) {
            case MODES.SELECT_GROUP:
                const nextSelectedGroup = groups.find((group) => group.id === Number(groupId));

                if (nextSelectedGroup) {
                    setSelectedGroup(nextSelectedGroup);
                }
                
                break;
            
            case MODES.ADD_GROUP:
                toggleAddGroup();
                
                break;

            default:
                break;
        }

        requestAnimationFrame(toggleContext);
    }, [groups, setSelectedGroup, toggleContext, toggleAddGroup]);

    const renderGroup = useCallback((group, index) =>
        <Cell
            key={index}
            before={<Avatar src={group.photo_200} alt={group.name} size={48} />}
            asideContent={(selectedGroup.id === group.id) ? <Icon24Done /> : undefined}
            children={group.name}
            data-mode={MODES.SELECT_GROUP}
            data-group-id={group.id}
            description={group.activity}
            onClick={select} />, [selectedGroup, select]);

    const onAttachGroup = useCallback((groupId, accessToken) => {
        const result = dispatch(fetchAttachGroup(groupId, accessToken));

        if (result) {
            toggleAddGroup();
        }
    }, [dispatch, toggleAddGroup]);

    const handleCashChange = useCallback((e) => setCash(String(e.currentTarget.value.replace(/\s/g, ''))), []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <Panel id={id} className="Home">
            <PanelHeader noShadow={true}>
                {(selectedGroup) &&
                    <PanelHeaderContent
                        status={selectedGroup.activity}
                        aside={<Icon16Dropdown />}
                        children={selectedGroup.name}
                        onClick={toggleContext} />}
            </PanelHeader>
            <HeaderContext opened={contextOpened} onClose={toggleContext}>
                <List>
                    {(hasGroups) && groups.map(renderGroup)}
                    <Cell
                        className="Home__Cell  Home__Cell--add-group"
                        before={<Icon24Add />}
                        data-mode={MODES.ADD_GROUP}
                        children="Добавить сообщество"
                        onClick={select} />
                </List>
            </HeaderContext>

            <form className="Home__form" onSubmit={handleSubmit}>
                <Input
                    className="Home__Input"
                    name="cash"
                    top="Выставить счёт"
                    placeholder="300"
                    value={cash}
                    postfix=" ₽"
                    onChange={handleCashChange} />
                <Button
                    className="Home__Button"
                    type="submit"
                    theme="primary"
                    size="medium"
                    children="Выставить QR-счёт"
                    disabled={!Boolean(cash)}
                    full
                    backlight />
            </form>

            <AddGroup
                visible={showAddGroup}
                selectedGroups={groups}
                attachGroup={onAttachGroup}
                onClose={toggleAddGroup} />
        </Panel>
    );
};

Home.propTypes = {
    id: string.isRequired
};

export default Home;