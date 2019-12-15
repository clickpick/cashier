import React from 'react';
import { string, oneOfType, arrayOf, node } from 'prop-types';
import classNames from 'classnames';

import './ShopCard.css';

import { Avatar } from '@vkontakte/vkui';

const ShopCard = React.memo(({ className, name, activity, photo_200, afterContent }) =>
    <div className={classNames(className, 'ShopCard')}>
        {(photo_200) &&
            <Avatar
                className="ShopCard__Avatar"
                size={36}
                src={photo_200}
                alt={name} />}
        <div className="ShopCard__info">
            <h2 className="ShopCard__name" children={name} />
            <small
                className={classNames('ShopCard__activity', {
                    'ShopCard__activity--with-after': Boolean(afterContent)
                })}
                children={activity} />
            {afterContent}
        </div>
    </div>
);

ShopCard.propTypes = {
    className: string,
    name: string.isRequired,
    activity: string,
    photo_200: string,
    afterContent: oneOfType([node, arrayOf(node)])
};

export default ShopCard;