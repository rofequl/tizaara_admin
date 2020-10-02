import ApiService from "@/core/services/api.service";

// action types
export const USER_LIST = "user/list";
export const USER_VERIFY = "user/verify";

// mutation types
export const SET_ERROR = "setError";
export const USER_MODIFY = "setModify";
export const SET_USER_LIST = "setUserList";
export const USER_SET_LOADING = "userSetLoading";

const state = {
    errors: null,
    loading: false,
    user: {},
};

const getters = {
    userList: (state) => state.user,
    userIsLoaded(state) {
        return !state.loading;
    }
};

const mutations = {
    [SET_ERROR](state, error) {
        state.errors = error;
        state.loading = false;
    },
    [SET_USER_LIST](state, brands) {
        state.user = brands;
    },
    [USER_SET_LOADING](state, loading = true) {
        state.loading = loading;
    },
    [USER_MODIFY](state, brand) {
        state.user = brand;
    }
}

const actions = {
    [USER_LIST]({commit, dispatch}) {
        commit(USER_SET_LOADING)
        ApiService.setHeader();
        ApiService.get("admin/user-list")
            .then(({data}) => {
                commit(SET_USER_LIST, data);
            })
            .catch(({response}) => {
                commit(SET_ERROR, response.data.errors);
            });
    },

    [USER_VERIFY]({commit, dispatch}, id) {
        commit(USER_SET_LOADING)
        ApiService.post('admin/user-verify/' + id)
            .then(({data}) => {
                commit(USER_MODIFY, data);
                commit(SET_ERROR, null);
            })
            .catch(({response}) => {
                commit(SET_ERROR, response.data.errors);
            });
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};
