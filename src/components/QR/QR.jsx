import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import './QR.css';

import vkQr from '@vkontakte/vk-qr';

const QR = ({ className, value }) => {
    const qrSvg = vkQr.createQR(value, {
        qrSize: 270,
        foregroundColor: '#007AFF'
    });

    return <div className={classNames(className, 'QR')} dangerouslySetInnerHTML={{ __html: qrSvg }} />;
};

QR.propTypes = {
    className: string,
    value: string
};

export default QR;