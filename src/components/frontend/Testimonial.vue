<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Frontend Settings
        </span>
        <h3 class="page-title">Testimonial</h3>
      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <CButton block color="info" @click="openModal">Add New Testimonial</CButton>
        </div>
      </div>
    </div>
    <!-- End Page Header -->
    <hr>
    <div class="row">

      <div class="col-md-6 col-xs-12" v-for="(testimonial, k) in getTestimonial" :key="k">
        <div class="card card-body">
          <div class="row">
            <div class="col-6">
              <b-badge variant="primary" @click="statusUpdate(testimonial.id, 0)" v-if="testimonial.status == 1"
                       style="cursor: pointer">
                Active
              </b-badge>
              <b-badge variant="secondary" @click="statusUpdate(testimonial.id, 1)" v-if="testimonial.status == 0"
                       style="cursor: pointer">Inactive
              </b-badge>
            </div>
            <div class="col-6">
              <b-dropdown right class="float-right" variant="link" toggle-class="text-decoration-none" no-caret>
                <template #button-content>
                  <font-awesome-icon icon="bars"/>
                </template>
                <b-dropdown-item>
                  <font-awesome-icon icon="edit"/>
                  Edit
                </b-dropdown-item>
                <b-dropdown-item @click="deleteItem(testimonial.id)">
                  <font-awesome-icon icon="trash-alt"/>
                  Delete
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="x_content">
            <div class="p-2">
              <video-embed ref="youtube" :src="testimonial.video"></video-embed>
            </div>
            <p class="text-justify">{{ testimonial.message }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal -->
    <b-modal id="brandModal" :title="editMode ? 'Testimonial Information Edit': 'New Testimonial Add'" hide-footer>
      <b-form @submit.prevent="editMode ? update(): create()" @keydown="form.onKeydown($event)">

        <CInput label="Name :" v-model="$v.form.name.$model"
                horizontal placeholder="Enter Name"
                :invalidFeedback="!$v.form.name.required?'Name required.': $v.form.name.maxLength?'':'Name not more than 100 character.' "
                :isValid="validateState('name')"/>

        <CInput label="Profession :" v-model="$v.form.profession.$model"
                horizontal placeholder="Enter Profession"
                :invalidFeedback="!$v.form.profession.required?'Profession required.': $v.form.profession.maxLength?'':'Profession not more than 100 character.' "
                :isValid="validateState('profession')"/>

        <CTextarea label="Message :" v-model="$v.form.message.$model"
                   horizontal placeholder="Enter Message"
                   :invalidFeedback="!$v.form.message.required?'Message required.': '' "
                   :isValid="validateState('message')"/>

        <CInput type="url" label="Video URL :" v-model="$v.form.video.$model"
                :invalidFeedback="!$v.form.video.required?'Video URL required.': $v.form.video.maxLength?'':'Video URL not more than 100 character.' "
                horizontal placeholder="Enter Video URL" :isValid="validateState('video')"/>


        <CRow class="justify-content-end">
          <CCol col="4" sm="4" md="3" class="mb-3 mb-xl-0">
            <CButton block color="info" type="submit" :disabled="form.busy">
              <span v-if="form.busy" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
              <span v-if="form.busy" class="sr-only">Loading...</span>
              {{ editMode ? 'Update' : 'Submit' }}
            </CButton>
          </CCol>
          <CCol col="4" sm="4" md="3" class="mb-3 mb-xl-0">
            <CButton block color="dark" @click="$bvModal.hide('brandModal')">Close</CButton>
          </CCol>
        </CRow>
      </b-form>
    </b-modal>
    <!-- End Modal -->

  </div>
</template>

<script>
import {validationMixin} from "vuelidate";
import {maxLength, required} from "vuelidate/lib/validators";
import {mapGetters} from "vuex";
import {
  TESTIMONIAL_ADD,
  TESTIMONIAL_LIST,
  TESTIMONIAL_REMOVE,
  TESTIMONIAL_STATUS_UPDATE
} from "@/core/services/store/module/testimonial";
import ApiService from "@/core/services/api.service";

export default {
  mixins: [validationMixin],
  name: "Testimonial",
  data() {
    return {
      editMode: false,
      form: new Form({
        name: '',
        profession: '',
        message: '',
        video: '',
      }),
    }
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      profession: {
        required,
        maxLength: maxLength(100)
      },
      message: {
        required,
      },
      video: {
        required,
        maxLength: maxLength(100)
      },
    }
  },
  methods: {
    validateState(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    openModal() {
      this.$v.$reset();
      this.form.reset();
      this.form.clear();
      this.editMode = false;
      this.$bvModal.show('brandModal');
    },
    create() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.post('testimonial')
          .then(({data}) => {
            this.$store.commit(TESTIMONIAL_ADD, data);
            this.form.reset();
            this.$bvModal.hide('brandModal');
            toast.fire({
              icon: 'success',
              title: 'Testimonial Add successfully'
            });
          })
    },
    deleteItem(id) {
      let that = this;
      swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.form.delete('testimonial/' + id)
              .then((data) => {
                if (data.data.result === 'Error') {
                  swal.fire("Failed!", data.data.message, 'warning')
                } else {
                  swal.fire(
                      'Deleted!',
                      'Testimonial has been deleted.',
                      'success'
                  )
                  this.$store.commit(TESTIMONIAL_REMOVE, id);
                }

              })
              .catch(() => {
                swal.fire("Failed!", 'There was something wrong.', 'warning')
              });
        }
      })
    },
    statusUpdate(id, status) {
      ApiService.post('testimonial-status', {id, status})
          .then(({data}) => {
            this.$store.commit(TESTIMONIAL_STATUS_UPDATE, data);
          })
    }
  },
  created() {
    this.getTestimonial.length < 1 ? this.$store.dispatch(TESTIMONIAL_LIST) : '';
  },
  computed: {
    ...mapGetters(["getTestimonial"])
  },
}
</script>

<style scoped>

</style>