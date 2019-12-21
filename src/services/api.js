import axios from 'axios';
import { parseQueryString } from 'helpers/location';
import { getTimezoneOffset } from 'helpers/dates';

const ENDPOINT = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL: ENDPOINT,
    headers: {
        'Vk-Params': window.btoa(JSON.stringify({
            ...parseQueryString(window.location.search),
            auth_type: 'back',
            utc_offset: getTimezoneOffset()
        })),
        'Accept': 'application/json'
    },
});

const get = (urn) => instance.get(urn);
const post = (urn, body) => instance.post(urn, body);
const put = (urn, body) => instance.put(urn, body);

class API {
    getOwnedGroups = async () => await get('/vk-user/owned-groups');
    getCashiedGroups = async () => await get('/vk-user/cashied-groups');

    attachGroup = async (group_id, group_access_token) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        if (!group_access_token) {
            throw new Error('Bad group access token');
        }

        const { data: { data } } = await post('/vk-user/attach-group', { group_id, group_access_token });

        return data;
    }

    makeOrder = async (group_id, value) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        if (!value) {
            throw new Error('Bad value');
        }

        const { data: { data } } = await post('/vk-user/make-order', { group_id, value });

        return data;
    }

    async getOrder(orderId) {
        if (!orderId) {
            throw new Error('Bad order id');
        }

        const { data: { data } } = await get(`/vk-user/orders/${orderId}`);

        return data;
    }

    getCashiers = async (group_id) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        const { data: { data } } = await get(`/vk-user/groups/${group_id}/cashiers`);

        return data;
    }

    attachCashier = async (group_id, user_id) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        if (!user_id) {
            throw new Error('Bad user id');
        }

        const { data: { data } } = await post('/vk-user/attach-cashier', { group_id, user_id });

        return data;
    }

    detachCashiers = async (group_id, user_id) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        if (!user_id) {
            throw new Error('Bad user id');
        }

        return await post('/vk-user/detach-cashier', { group_id, user_id });
    }

    getGroupAddresses = async (groupId) => {
        if (!groupId) {
            throw new Error('Bad group id');
        }

        const { data: { data } } = await get(`vk-user/groups/${groupId}/addresses`);

        return data;
    }

    updateGroupAddress = async (addressId, album_id) => {
        if (!addressId) {
            throw new Error('Bad address id');
        }

        if (!album_id) {
            throw new Error('Bad album id');
        }

        return await put(`/vk-user/addresses/${addressId}`, { album_id });
    }

    setPaymentMethod = async (group_id, payment_method) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        if (!payment_method && payment_method !== null) {
            throw new Error('Bad payment method');
        }

        return await post(`/vk-user/groups/${group_id}/set-payment-method`, { payment_method });
    };

    getGroupPaymentParams = async (group_id) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        const { data: { data } } = await get(`/vk-user/groups/${group_id}/group-payment-params`);

        return data;
    }

    generateGroupPaymentParams = async (group_id) => {
        if (!group_id) {
            throw new Error('Bad group id');
        }

        return await post(`/vk-user/groups/${group_id}/generate-group-payment-params`);
    }

    async callAPI(method, params) {
        if (!method) {
            throw new Error('Bad method');
        }

        const response = await post('/vk-user/call-api', { method, params });

        return response.data;
    }
}

export default new API();