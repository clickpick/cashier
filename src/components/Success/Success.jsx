import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import './Success.css';

const Success = ({ className }) =>
    <div className={classNames(className, 'Success')}>
        <div className="Success__icon">
            <span className="Success__icon-line Success__icon-line--line-tip"></span>
            <span className="Success__icon-line Success__icon-line--line-long"></span>
            <div className="Success__icon-circle"></div>
            <div className="Success__icon-fix"></div>
        </div>
    </div>;

Success.propTypes = {
    className: string
};

export default Success;