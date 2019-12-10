import React from 'react';
import { string, oneOf } from 'prop-types';
import classNames from 'classnames';

import './Title.css';

const Title = ({ className, type, children, hint, ...restProps }) =>
    <h1
        className={classNames(className, 'Title', {
            [`Title--${type}`]: type
        })}
        {...restProps}>
        {children}
        {(hint) && <small className="Title__hint" children={hint} />}
    </h1>;

Title.propTypes = {
    className: string,
    type: oneOf(['success', 'error'])
};

export default Title;