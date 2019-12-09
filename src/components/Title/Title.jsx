import React from 'react';
import { string, oneOf } from 'prop-types';
import classNames from 'classnames';

import './Title.css';

const Title = ({ className, type, children, ...restProps }) =>
    <h1
        className={classNames(className, 'Title', {
            [`Title--${type}`]: type
        })}
        children={children}
        {...restProps} />;

Title.propTypes = {
    className: string,
    type: oneOf(['success', 'error'])
};

export default Title;