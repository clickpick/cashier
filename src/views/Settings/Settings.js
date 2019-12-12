import React, { useState, useCallback } from 'react';
import { string } from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { getActiveTab } from 'reducers/settings-reducer';
import { setSettingsTab } from 'actions/settings-actions';

import { View, ScreenSpinner } from '@vkontakte/vkui';

import SettingsPanel from 'panels/Settings';

import * as PANELS from 'constants/panels';

const Settings = ({ id }) => {
    const [popout, setPopout] = useState(null);
    const activeTab = useSelector(getActiveTab);    

    const dispatch = useDispatch();

    const openPopout = useCallback((popout) => setPopout(popout), []);
    const closePopout = useCallback(() => setPopout(null), []);

    const toggleSpinnerPopup = useCallback(() => setPopout(state => {
        if (state) {
            return null;
        }

        return <ScreenSpinner />;
    }), [])

    const handleTabChange = useCallback((e) =>
        dispatch(setSettingsTab(e.currentTarget.dataset.index)), [dispatch]);

    return (
        <View id={id} activePanel={PANELS.SETTINGS} popout={popout}>
            <SettingsPanel
                id={PANELS.SETTINGS}
                activeTab={activeTab}
                toggleSpinnerPopup={toggleSpinnerPopup}
                openPopout={openPopout}
                closePopout={closePopout}
                onTabChange={handleTabChange} />
        </View>
    );
};

Settings.propTypes = {
    id: string.isRequired
};

export default Settings;