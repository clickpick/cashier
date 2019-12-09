import axios from 'axios';
import { parseQueryString } from 'helpers/location';
import { getTimezoneOffset } from 'helpers/dates';

const ENDPOINT = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL: ENDPOINT,
    headers: {
        'Vk-Params': window.btoa(JSON.stringify({
            ...parseQueryString(window.location.search),
            auth_type: 'front',
            utc_offset: getTimezoneOffset()
        })),
        'Accept': 'application/json'
    },
});

const get = (urn) => instance.get(urn);
const post = (urn, body) => instance.post(urn, body);

class API {
    getOwnedGroups = async () => await get('/vk-user/owned-groups');
    getCashiedGroups = async () => await get('/vk-user/cashied-groups');
}

export default new API();