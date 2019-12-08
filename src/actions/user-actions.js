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

const fetchGroups = async (dispatch) => {    
    dispatch(fetchGroupsLoad);

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

export { fetchGroups };