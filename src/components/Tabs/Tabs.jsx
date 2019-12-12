import React, { useCallback } from 'react';
import { string, arrayOf, shape, func } from 'prop-types';
import classNames from 'classnames';

import './Tabs.css';

import TabItem from 'components/TabItem';

const Tabs = ({ className, items, activeItem, onClick }) => {
    const renderItem = useCallback((item, index) =>
        <TabItem
            key={index}
            className="Tabs__TabItem"
            {...item}
            active={activeItem === item.index}
            onClick={onClick} />,
        [activeItem, onClick]);

    return <div className={classNames(className, 'Tabs')} children={items.map(renderItem)} />;
};

Tabs.propTypes = {
    className: string,
    items: arrayOf(shape({
        index: string,
        title: string
    })).isRequired,
    activeItem: string.isRequired,
    onClick: func
};

export default Tabs;