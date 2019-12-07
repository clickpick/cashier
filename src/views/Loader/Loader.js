import React from 'react';
import { string } from 'prop-types';

import { View } from '@vkontakte/vkui';

import Spinner from 'panels/Spinner';

const Loader = ({ id }) =>
    <View id={id} activePanel="spinner">
        <Spinner id="spinner" />
    </View>;

Loader.propTypes = {
    id: string.isRequired
};

export default Loader;