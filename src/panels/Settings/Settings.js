import React from 'react';
import { string, func } from 'prop-types';

import { Panel, PanelHeader } from '@vkontakte/vkui';

const Settings = ({ id, onTabChange }) => {

    return (
        <Panel id={id} className="Settings">
            <PanelHeader children="Settings" noShadow={true} />
        </Panel>
    );
};

Settings.propTypes = {
    id: string.isRequired,
    onTabChange: func.isRequired
};

export default Settings;