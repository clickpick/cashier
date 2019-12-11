import connect from '@vkontakte/vk-connect';

export const TAPTIC_SUCCESS = 'success';
export const TAPTIC_WARNING = 'warning';
export const TAPTIC_ERROR = 'error';

export function callTaptic(type) {
    if (connect.supports('VKWebAppTapticNotificationOccurred')) {
        connect.send('VKWebAppTapticNotificationOccurred', { type });
    }
}