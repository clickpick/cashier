import React, { useCallback } from 'react';
import { string } from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { getActiveTab } from 'reducers/settings-reducer';

import { ConfigProvider, View } from '@vkontakte/vkui';

import SettingsPanel from 'panels/Settings';

import * as PANELS from 'constants/panels';

const Settings = ({ id }) => {
    const activeTab = useSelector(getActiveTab);    

    const dispatch = useDispatch();

    const handleTabChange = useCallback(() => dispatch(), [dispatch]);

    return (
        <ConfigProvider isWebView={true}>
            <View id={id} activePanel={PANELS.SETTINGS}>
                <SettingsPanel id={PANELS.SETTINGS} onTabChange={handleTabChange} />
            </View>
        </ConfigProvider>
    );
};

Settings.propTypes = {
    id: string.isRequired
};

export default Settings;