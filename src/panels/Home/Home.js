import React from 'react';
import { string } from 'prop-types';

import { Panel, PanelHeader } from '@vkontakte/vkui';

const Home = ({ id }) => {

    return (
        <Panel id={id} className="Home">
            <PanelHeader children="Home" />
        </Panel>
    );
};

Home.propTypes = {
    id: string.isRequired
};

export default Home;