import { USER_STATE } from 'constants/store';
import * as types from 'constants/types';

function updateCashiers(group) {
    if (group.id === this.groupId) {
        return {
            ...group,
            cashiers: this.cashiers
        };
    }

    return group;
}

function updateAddress(address) {
    if (address.id === this.id) {
        return {
            ...address,
            ...this
        };
    }

    return address;
}

export function userReducer(state = USER_STATE, action) {
    switch (action.type) {
        case types.SET_USER_ERROR:
            return {
                ...state,
                error: action.error
            };

        case types.CLEAR_USER_ERROR:
            return {
                ...state,
                error: false
            };

        case types.FETCH_GROUPS_LOAD: case types.FETCH_CASHIERS_LOAD: case types.FETCH_ADDRESSES_LOAD:
            return {
                ...state,
                loading: true
            };

        case types.FETCH_GROUPS_SUCCESS:
            const ownedGroups = action.ownedGroups.map((group) => ({
                ...group,
                owned: true,
                cashiers: null,
                addresses: null,
                albums: null,
                groupPaymentParams: null
            }));

            return {
                ...state,
                loading: false,
                ownedGroups,
                cashiedGroups: action.cashiedGroups.map((group) => ({ ...group, owned: false })),
                selectedGroup: (action.ownedGroups.length > 0)
                    ? ownedGroups[0]
                    : (action.cashiedGroups.length > 0)
                        ? { ...action.cashiedGroups[0], owned: false }
                        : null
            };

        case types.FETCH_GROUPS_ERROR: case types.FETCH_CASHIERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        case types.ATTACH_OWNED_GROUP:
            const newOwnedGroups = {
                ...action.entities,
                owned: true,
                cashiers: null,
                groupPaymentParams: null
            };

            return {
                ...state,
                ownedGroups: state.ownedGroups.concat(newOwnedGroups),
                selectedGroup: newOwnedGroups
            };

        case types.SET_SELECTED_GROUP:            
            return {
                ...state,
                selectedGroup: action.entities
            };

        case types.FETCH_CASHIERS_SUCCESS:
            return {
                ...state,
                loading: false,
                ownedGroups: (state.selectedGroup)
                    ? state.ownedGroups.map(updateCashiers, { groupId: state.selectedGroup.id, cashiers: action.cashiers })
                    : state.ownedGroups,
                selectedGroup: {
                    ...state.selectedGroup,
                    cashiers: action.cashiers
                }
            };

        case types.ATTACH_CASHIERS:            
            const attachedCashiers = state.selectedGroup.cashiers.concat(action.cashiers);

            return {
                ...state,
                ownedGroups: state.ownedGroups.map(updateCashiers, { groupId: action.groupId, cashiers: attachedCashiers }),
                selectedGroup: {
                    ...state.selectedGroup,
                    cashiers: attachedCashiers
                }
            };

        case types.DETACH_CASHIER:            
            const cashiers = state.selectedGroup.cashiers
                .filter((cashier) => cashier.id !== action.cashierId);

            return {
                ...state,
                ownedGroups: state.ownedGroups.map(updateCashiers, { groupId: action.groupId, cashiers }),
                selectedGroup: {
                    ...state.selectedGroup,
                    cashiers
                }
            };

        case types.FETCH_ADDRESSES_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedGroup: {
                    ...state.selectedGroup,
                    addresses: action.addresses,
                    albums: action.albums
                }
            };

        case types.UPDATE_ADDRESS:
            return {
                ...state,
                selectedGroup: {
                    ...state.selectedGroup,
                    addresses: state.selectedGroup.addresses.map(updateAddress, action.address)
                }
            };

        case types.SET_GROUP_PAYMENT_PARAMS:
            return {
                ...state,
                ownedGroups: state.ownedGroups.map((group) => {
                    if (group.id === action.groupId) {
                        return {
                            ...group,
                            groupPaymentParams: action.groupPaymentParams
                        };
                    }

                    return group;
                }),
                selectedGroup: {
                    ...state.selectedGroup,
                    groupPaymentParams: action.groupPaymentParams
                }
            };

        case types.SET_GROUP_PAYMENT_METHOD:
            return {
                ...state,
                ownedGroups: state.ownedGroups.map((group) => {
                    if (group.id === action.groupId) {
                        return {
                            ...group,
                            payment_method: action.paymentMethod
                        };
                    }

                    return group;
                }),
                selectedGroup: {
                    ...state.selectedGroup,
                    payment_method: action.paymentMethod
                }
            };

        default:
            return state;
    }
}

export const getUserState = (state) => state.user;
export const getUserLoading = (state) => state.user.loading;
export const getUserError = (state) => state.user.error;

export const getUserGroups = (state) => {
    const { ownedGroups, cashiedGroups } = state.user;

    if (Array.isArray(ownedGroups) && Array.isArray(cashiedGroups)) {
        return ownedGroups.concat(cashiedGroups);
    }

    return null;
}

export const getUserSelectedGroup = (state) => state.user.selectedGroup;
export const getCashiers = (state) => {
    const selectedGroups = getUserSelectedGroup(state);

    if (selectedGroups) {
        return [getUserLoading(state), selectedGroups.cashiers];
    }

    return [false, []];
};
export const getAddresses = (state) => {
    const selectedGroups = getUserSelectedGroup(state);
    
    if (selectedGroups) {
        return [getUserLoading(state), selectedGroups.addresses];
    }

    return [false, null];
};

export const getAlbums = (state) => {
    const selectedGroups = getUserSelectedGroup(state);

    if (selectedGroups) {
        return [getUserLoading(state), selectedGroups.albums];
    }

    return [false, null];
}