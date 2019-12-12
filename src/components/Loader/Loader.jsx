import React from 'react';
import { string, bool } from 'prop-types';
import classNames from 'classnames';

import './Loader.css';

import { Spinner } from '@vkontakte/vkui';

const Loader = ({ className, center, absoluteCenter, ...restProps }) => {
    const props = {
        className: classNames(className, 'Loader', {
            'Loader--is-center': center,
            'Loader--is-absolute-center': absoluteCenter,
        }),
        ...restProps,
    };

    return <Spinner {...props} />;
};

Loader.propTypes = {
    className: string,
    center: bool,
    absoluteCenter: bool
};

export default Loader;