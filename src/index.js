import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';

import connect from '@vkontakte/vk-connect';

import '@vkontakte/vkui/dist/vkui.css';

import * as Sentry from '@sentry/browser';

import Echo from 'laravel-echo';
import io from 'socket.io-client';
import { parseQueryString } from 'helpers/location';
import { getTimezoneOffset } from 'helpers/dates';

import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import { INITIAL_STATE } from 'constants/store';

import App from './App';
// import registerServiceWorker from './sw';

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DNS });
}

// Init VK  Mini App
connect.send('VKWebAppInit');

window.io = io;
window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: process.env.REACT_APP_API_URL,
    path: '/socket.io/',
    auth: {
        headers: {
            'Vk-Params': window.btoa(JSON.stringify({
                ...parseQueryString(window.location.search),
                auth_type: 'front',
                utc_offset: getTimezoneOffset()
            })),
        }
    }
});

// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
// registerServiceWorker();

ReactDOM.render(
    <Provider store={configureStore(INITIAL_STATE)}>
        <App />
    </Provider>,
    document.getElementById('root')
);
