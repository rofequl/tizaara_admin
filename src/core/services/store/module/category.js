import ApiService from "@/core/services/api.service";

// action types
export const CATEGORY_LIST = "category/list";

// mutation types
export const SET_CATEGORY_LIST = "setCategoryList";
export const CATEGORY_ADD = "addNewCategory";
export const CATEGORY_MODIFY = "modifyCategory";
export const CATEGORY_REMOVE = "deleteCategory";
export const SET_ERROR = "setError";
export const CATEGORY_SET_LOADING = "categorySetLoading";

const state = {
    errors: null,
    loading: false,
    category: [],
};

const getters = {
    categoryList: state => state.category,

    categoryErrors(state) {
        return state.errors;
    },
    categoryIsLoaded(state) {
        return !state.loading;
    },
    getCategoryById: state => id => state.category.find(value => value.id === id),
};

const mutations = {
    [SET_ERROR](state, error) {
        state.errors = error;
        state.loading = false;
    },
    [SET_CATEGORY_LIST](state, category) {
        state.category = category;
    },
    [CATEGORY_REMOVE](state, categoryId) {
        let index = state.category.findIndex(value => value.id === categoryId);
        state.category.splice(index, 1);
        state.loading = false;
    },
    [CATEGORY_MODIFY](state, categories) {
        let index = state.category.findIndex(value => value.id === categories.id)
        state.category[index] = categories;
        state.loading = false;
    },
    [CATEGORY_ADD](state, category) {
        state.category.unshift(category);
    },
    [CATEGORY_SET_LOADING](state, loading = true) {
        state.loading = loading;
    }
};

const actions = {
    [CATEGORY_LIST]({commit}) {
        commit(CATEGORY_SET_LOADING)
        ApiService.get("category")
            .then(({data}) => {
                commit(SET_CATEGORY_LIST, data);
            })
            .catch(({response}) => {
                commit(SET_ERROR, response.data.errors);
            });
    }
};


export default {
    state,
    actions,
    mutations,
    getters
};
