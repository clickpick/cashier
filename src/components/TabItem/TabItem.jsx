import React from 'react';
import { string, bool, func } from 'prop-types';
import classNames from 'classnames';

import './TabItem.css';

import Button from 'components/Button';

const TabItem = ({ className, index, title, active, onClick }) =>
    <Button
        className={classNames(className, 'TabItem')}
        theme={(active) ? 'secondary' : undefined}
        aria-pressed={active}
        children={title}
        data-index={index}
        onClick={onClick} />;

TabItem.propTypes = {
    className: string,
    index: string.isRequired,
    title: string.isRequired,
    active: bool,
    onClick: func
};

export default TabItem;