import React from 'react';
import { string, oneOf } from 'prop-types';
import classNames from 'classnames';

import './Message.css';

const Message = React.memo(({ className, theme, size, children, ...restProps }) => {
    let element = 'p';

    if (size === 'small') {
        element = 'small';
    }

    return React.createElement(
        element,
        {
            className: classNames(className, 'Message', {
                [`Message--${theme}`]: theme,
                [`Message--${size}`]: size,
            }),
            ...restProps
        },
        children
    );
});

Message.propTypes = {
    className: string,
    theme: oneOf(['default', 'gray']),
    size: oneOf(['default', 'small'])
};

Message.defaultProps = {
    theme: 'default',
    size: 'default'
};

export default Message;