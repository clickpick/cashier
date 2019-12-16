import * as types from 'constants/types';
import API from 'services/api';
import { PAYMENT_GROUP } from 'constants/payment-methods';

const setUserError = (error) => ({
    type: types.SET_USER_ERROR,
    error
});

const clearUserError = () => ({
    type: types.CLEAR_USER_ERROR
});

const fetchGroupsLoad = () => ({
    type: types.FETCH_GROUPS_LOAD
});

const fetchGroupsSuccess = (ownedGroups, cashiedGroups) => ({
    type: types.FETCH_GROUPS_SUCCESS,
    ownedGroups,
    cashiedGroups
});

const fetchGroupsError = (error) => ({
    type: types.FETCH_GROUPS_ERROR,
    error
});

const attachGroup = (entities) => ({
    type: types.ATTACH_OWNED_GROUP,
    entities
});

const setSelectedGroup = (entities) => ({
    type: types.SET_SELECTED_GROUP,
    entities
});

const fetchCashiersLoad = () => ({
    type: types.FETCH_CASHIERS_LOAD
});

const fetchCashiersSuccess = (cashiers) => ({
    type: types.FETCH_CASHIERS_SUCCESS,
    cashiers
});

const fetchCashiersError = (error) => ({
    type: types.FETCH_CASHIERS_ERROR,
    error
});

const attachCashiers = (groupId, cashiers) => ({
    type: types.ATTACH_CASHIERS,
    groupId,
    cashiers
});

const detachCashier = (groupId, cashierId) => ({
    type: types.DETACH_CASHIER,
    groupId,
    cashierId
});

const setGroupPaymentParams = (groupId, groupPaymentParams) => ({
    type: types.SET_GROUP_PAYMENT_PARAMS,
    groupId,
    groupPaymentParams
});

const setPaymentMethod = (groupId, paymentMethod) => ({
    type: types.SET_GROUP_PAYMENT_METHOD,
    groupId,
    paymentMethod
});

/**
 * Экшены для групп
 */
const fetchGroups = async (dispatch) => {
    dispatch(fetchGroupsLoad());

    try {
        const responses = await Promise.all([API.getOwnedGroups(), API.getCashiedGroups()]);
        
        for(let response of responses) {
            if (response.status !== 200) {
                throw new Error();
            }
        }

        const [{ data: { data: ownedGroups } }, { data: { data: cashiedGroups } }] = responses;
        
        dispatch(fetchGroupsSuccess(ownedGroups, cashiedGroups));
    } catch (e) {
        dispatch(fetchGroupsError('Ошибка получения подключенных групп.'));
    }
};

const fetchAttachGroup = (groupId, accessToken) => async (dispatch) => {
    try {
        const group = await API.attachGroup(groupId, accessToken);
        
        dispatch(attachGroup(group));

        return true;
    } catch (e) {
        dispatch(setUserError('У нас не получилось добавить Вашу группу.'));
        return false;
    }
};

const selectGroup = (group) => (dispatch) => dispatch(setSelectedGroup(group));

/**
 * Методы для кассиров
 */
const fetchCashiers = async (dispatch, getState) => {
    const { user: { selectedGroup } } = getState();

    if (!selectedGroup) {
        return;
    }

    dispatch(fetchCashiersLoad());

    try {
        const cashiers = await API.getCashiers(selectedGroup.id);

        dispatch(fetchCashiersSuccess(cashiers));
    } catch (e) {
        dispatch(fetchCashiersError('Произошла ошибка при попытке получить список сотрудников.'));
    }
};

const fetchAttachCashiers = (users) => async (dispatch, getState) => {
    const { user: { selectedGroup } } = getState();

    if (!selectedGroup) {
        return;
    }

    try {
        const cashiers = await Promise.all(users.map((user) => API.attachCashier(selectedGroup.id, user.id)));
        dispatch(attachCashiers(selectedGroup.id, cashiers));
    } catch(e) {
        dispatch(setUserError(`У нас не получилось добавить ${(users.length === 1) ? 'Вашего сотрудника' : 'Ваших сотрудников'}.`));
    }
};

const fetchDetachCashier = (cashierId) => async (dispatch, getState) => {
    const { user: { selectedGroup } } = getState();

    if (!selectedGroup) {
        return;
    }

    try {
        await API.detachCashiers(selectedGroup.id, cashierId);
        dispatch(detachCashier(selectedGroup.id, cashierId));
    } catch (e) {
        dispatch(setUserError('Произошла ошибка при попытке удаления сотрудника.'));
    }
};

/**
 * Методы для получения денег
 */
const fetchSetPaymentMethod = (groupId, paymentMethod) => async (dispatch) => {
    try {
        await API.setPaymentMethod(groupId, paymentMethod);
        dispatch(setPaymentMethod(groupId, paymentMethod));
    } catch (e) {
        dispatch(setUserError('Произошла ошибка при попытке поменять способ получения денег.'));
    }
};

const fetchGroupPaymentParams = () => async (dispatch, getState) => {
    const { user: { selectedGroup } } = getState();

    if (!selectedGroup) {
        return;
    }

    try {
        const params = await API.getGroupPaymentParams(selectedGroup.id);
        
        dispatch(setGroupPaymentParams(selectedGroup.id, params));

        if (params.is_ready && selectedGroup.payment_method !== PAYMENT_GROUP) {
            await dispatch(fetchSetPaymentMethod(selectedGroup.id, PAYMENT_GROUP));
        }
    } catch (e) {
        if (e.response.status === 404) {
            return dispatch(setGroupPaymentParams(selectedGroup.id, { is_ready: false }));
        }

        dispatch(setUserError('Произошла ошибка при попытки получить параметры оплаты для группы.'));
    }
};

const fetchGenerateGroupPaymentParams = () => async (dispatch, getState) => {
    const { user: { selectedGroup } } = getState();

    if (!selectedGroup) {
        return;
    }

    try {
        await API.generateGroupPaymentParams(selectedGroup.id);

        await dispatch(fetchSetPaymentMethod(selectedGroup.id, PAYMENT_GROUP));

        dispatch(setGroupPaymentParams(selectedGroup.id, { is_ready: true }));
    } catch (e) {
        dispatch(setGroupPaymentParams(selectedGroup.id, { is_ready: false }));
    }
};

export {
    clearUserError,
    fetchGroups, fetchAttachGroup, selectGroup,
    fetchCashiers, fetchAttachCashiers, fetchDetachCashier,
    fetchSetPaymentMethod, fetchGroupPaymentParams, fetchGenerateGroupPaymentParams
};