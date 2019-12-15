import React from 'react';
import { string, oneOf } from 'prop-types';
import classNames from 'classnames';

import './Tag.css';

const Tag = React.memo(({ className, theme, ...restProps }) =>
    <span
        className={classNames(className, 'Tag', {
            [`Tag--theme`]: theme
        })}
        {...restProps} />);

Tag.propTypes = {
    className: string,
    theme: oneOf(['red', 'green', 'blue'])
};

export default Tag; 