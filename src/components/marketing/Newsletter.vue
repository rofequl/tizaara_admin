<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Marketing
        </span>
        <h3 class="page-title">Send Newsletter</h3>
      </div>
    </div>
    <!-- End Page Header -->

    <CRow class="justify-content-center my-4">
      <CCol md="10">
        <CCardGroup>
          <CCard class="p-4">
            <CForm @submit.prevent="send()" @keydown="form.onKeydown($event)">
              <c-row class="">
                <CCol md="3" class="mb-3">
                  Emails :
                </CCol>
                <CCol md="9" class="mb-3">
                  <vue-multi-select
                      v-model="form.email"
                      search
                      :filters="filters"
                      :options="options"
                      :btnLabel="btnLabel"
                      :selectOptions="getNewsletter"/>
                </CCol>
              </c-row>
              <c-row class="">
                <CCol md="3" class="mb-3">
                  Newsletter subject :
                </CCol>
                <CCol md="9" class="mb-3">
                  <CInput v-model="form.subject" required
                          placeholder="Enter Newsletter subject"/>
                </CCol>
              </c-row>
              <c-row class="">
                <CCol md="3" class="mb-3">
                  Newsletter content :
                </CCol>
                <CCol md="9" class="mb-3">
                  <vue-editor v-model="form.message"/>
                </CCol>
              </c-row>
              <div class="form-group form-actions my-4">
                <CButton :disabled="form.busy" type="submit" color="primary" class="float-right">
                  <span v-if="form.busy" class="spinner-border spinner-border-sm" role="status"
                        aria-hidden="true"></span>
                  Send
                </CButton>
              </div>
            </CForm>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>

  </div>
</template>

<script>
import vueMultiSelect from 'vue-multi-select';
import 'vue-multi-select/dist/lib/vue-multi-select.css';
import {mapGetters} from "vuex";
import {NEWSLETTER_LIST} from "@/core/services/store/module/newsletter";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {FLASH_DEALS_ADD} from "@/core/services/store/module/flash_deals";

export default {
  name: "Newsletter",
  data() {
    return {
      form: new Form({
        email: [],
        subject: '',
        message: '',
      }),
      values: [],
      filters: [{
        nameAll: 'Select all',
        nameNotAll: 'Deselect all',
        func() {
          return true;
        },
      }],
      options: {
        multi: true,
        groups: true,
        labelList: 'elements',
        groupName: 'title',
      },
      btnLabel: values => `${values.length} email selected`,
      editor: ClassicEditor,
      editorConfig: {},
    }
  },
  methods: {
    send() {
      this.form.post('newsletter-post')
          .then(({data}) => {
            this.form.reset();
            toast.fire({
              icon: 'success',
              title: 'Send mail successfully'
            });
          })
    }
  },
  created() {
    this.$store.dispatch(NEWSLETTER_LIST);
  },
  computed: {
    ...mapGetters(["getNewsletter"])
  },
  components: {
    vueMultiSelect,
  },
}
</script>

<style scoped>

</style>