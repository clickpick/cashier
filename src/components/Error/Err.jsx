import React from 'react';
import { string, number } from 'prop-types';
import classNames from 'classnames';

import './Err.css';

const Err = ({ className, width, height, ...props }) =>
    <svg
        className={classNames(className, 'Error')}
        width={width}
        height={height}
        viewBox="0 0 52 52"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <g transform="translate(1, 1)" strokeWidth="2" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="25" cy="25" r="25" className="Error__circle" transform="rotate(-90 25 25)" />
            <path d="M32.5,17.5 L17.5,32.5" className="Error__path" />
            <path d="M17.5,17.5 L32.5,32.5" className="Error__path" />
        </g>
    </svg>;

Err.propTypes = {
    className: string,
    width: number,
    height: number
};

Err.defaultProps = {
    width: 88,
    height: 88
};

export default Err;