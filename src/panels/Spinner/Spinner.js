import React from 'react';
import { string } from 'prop-types';

import './Spinner.css';

import { Panel, Spinner as SpinnerComponent } from '@vkontakte/vkui';

const Spinner = ({ id }) => {
    return (
        <Panel id={id} className="Spinner">
            <SpinnerComponent className="Spinner__SpinnerComponent" size="medium" />
        </Panel>
    );
};

Spinner.propTypes = {
    id: string.isRequired, // идентификатор View
};

export default Spinner;