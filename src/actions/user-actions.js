import * as types from 'constants/types';
import API from 'services/api';

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
        dispatch(fetchGroupsError('laod err'));
    }
};

const fetchAttachGroup = (groupId, accessToken) => async (dispatch) => {    
    try {
        const group = await API.attachGroup(groupId, accessToken);
        
        dispatch(attachGroup(group));

        return true;
    } catch (e) {
        return false;
    }
};

const selectGroup = (group) => (dispatch) => dispatch(setSelectedGroup(group));

const fetchCashiers = async (dispatch, getState) => {
    const { user: { selectedGroup } } = getState();

    if (!selectedGroup) {
        return;
    }

    dispatch(fetchCashiersLoad());

    try {
        const cashiers = await API.getCashiers(selectedGroup.id);

        setTimeout(() => dispatch(fetchCashiersSuccess(cashiers)), 5000)
        // dispatch(fetchCashiersSuccess(cashiers));
    } catch (e) {
        dispatch(fetchCashiersError('cashiers error'));
    }
};

export { fetchGroups, fetchAttachGroup, selectGroup, fetchCashiers };