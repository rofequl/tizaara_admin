import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.module';
import general from './general.module';
import user from './user.module';

Vue.use(Vuex)

const state = {
    dialog: false,
    sidebarShow: 'responsive',
    sidebarMinimize: false
}

const getters = {
    dialog: state => state.dialog,
}

const mutations = {
    toggleSidebarDesktop(state) {
        const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile(state) {
        const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    set(state, [variable, value]) {
        state[variable] = value
    },
    modalStatus: (state, dialog) => state.dialog = dialog,
}

const actions = {
    setModalStatus: ({commit}, dialog) => commit('modalStatus', dialog),
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules: {
        auth,
        general,
        user
    }
})
