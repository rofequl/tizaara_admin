import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import {iconsSet as icons} from './assets/icons/icons.js'
import store from './core/services/store'
import ApiService from "./core/services/api.service";
import {VERIFY_AUTH} from "./core/services/store/auth.module";


window.$ = window.jQuery = require('jquery');

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

ApiService.init();

// Vue 3rd party plugins
import "./core/plugins/bootstrap-vue";

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    loading: 'https://i.ibb.co/jG5PXnD/spinner.gif',
    attempt: 1
})

/*============================================
// npm install vue2-perfect-scrollbar
============================================= */
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)

/*============================================
// npm install --save @ckeditor/ckeditor5-vue @ckeditor/ckeditor5-build-classic
============================================= */

import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use(CKEditor);

/*============================================
// npm i --save @fortawesome/fontawesome-svg-core
// npm i --save @fortawesome/free-solid-svg-icons
// npm i --save @fortawesome/vue-fontawesome
============================================= */

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

/*============================================
// npm i axios vform
============================================= */
import Embed from 'v-video-embed'

Vue.use(Embed);

/*============================================
// npm i axios vform
============================================= */
import {Form, HasError, AlertError} from 'vform';

Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
window.Form = Form;

/*============================================
// npm install sweetalert2
============================================= */
import swal from 'sweetalert2'

const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});
window.toast = toast;
window.swal = swal;

/*============================================
// npm i vue-element-loading
============================================= */
import VueElementLoading from 'vue-element-loading'

/*============================================
// npm install vue-form-wizard
============================================= */
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use(VueFormWizard)

/*============================================
// npm install @johmun/vue-tags-input
============================================= */
import VueTagsInput from '@johmun/vue-tags-input';

Vue.component('VueTagsInput', VueTagsInput);

/*============================================
// npm install vue select
============================================= */
import vSelect from 'vue-select'

Vue.component('v-select', vSelect);

/*============================================
// npm install laravel-vue-pagination
============================================= */
Vue.component('pagination', require('laravel-vue-pagination'));

Vue.component('vue-element-loading', VueElementLoading);

router.beforeEach((to, from, next) => {
    // const publicPages = ['/login'];
    // const authRequired = !publicPages.includes(to.path);
    // const loggedIn = store.state.auth.isAuthenticated;
    // if (authRequired && !loggedIn) {
    //     next('/login');
    // } else {
    //     next();
    // }
    Promise.all([store.dispatch(VERIFY_AUTH)]).then(next);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
    document.title = to.meta.title;
});

new Vue({
    router,
    store,
    icons,
    render: h => h(App)
}).$mount("#app");