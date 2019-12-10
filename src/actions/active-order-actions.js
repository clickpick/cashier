import * as types from 'constants/types';
import API from 'services/api';


const setActiveOrder = (entities) => ({
    type: types.SET_ACTIVE_ORDER,
    entities
});

const fetchMakeOrder = (groupId, value) => async (dispatch) => {
    try {
        const order = await API.makeOrder(groupId, value);

        dispatch(setActiveOrder(order));
        
        return true;
    } catch (e) {
        return false;
    }
};

export { fetchMakeOrder };