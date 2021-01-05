<template>
  <b-form @submit.prevent="submit()" @keydown="form.onKeydown($event)">
    <ckeditor :editor="editor" v-model="form.privacy" :config="editorConfig"></ckeditor>
    <CRow class="justify-content-end">
      <CCol col="4" sm="4" md="3" class="my-3">
        <CButton block color="info" type="submit" :disabled="form.busy">
              <span v-if="form.busy" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
          <span v-if="form.busy" class="sr-only">Loading...</span>
          Update
        </CButton>
      </CCol>
    </CRow>
  </b-form>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {PRIVACY_POLICY} from "@/core/services/store/module/page_manage";
import {mapGetters} from "vuex";

export default {
  name: "Privacy",
  data() {
    return {
      form: new Form({
        privacy: '',
      }),
      editor: ClassicEditor,
      editorConfig: {},
    }
  },
  methods: {
    submit() {
      this.form.post('privacy_policy')
          .then(({data}) => {
            toast.fire({
              icon: 'success',
              title: 'Privacy Policy update successfully'
            });
          })
    }
  },
  created() {
    this.$store.dispatch(PRIVACY_POLICY)
  },
  computed: {
    ...mapGetters(["getPrivacyPolicy"]),
  },
  watch: {
    getPrivacyPolicy(data) {
      this.form.privacy = data;
    }
  }
}
</script>

<style scoped>

</style>