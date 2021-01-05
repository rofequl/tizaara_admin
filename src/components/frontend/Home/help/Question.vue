<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">

      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <CButton block color="info" @click="openModal">Add New Question</CButton>
        </div>
      </div>
    </div>
    <!-- End Page Header -->

    <!-- Datatable -->
    <div id="people" class="dataTables_wrapper no-footer my-5">
      <v-client-table :data="Object.values(helpQuestionList)" :columns="columns" class="text-center" :options="options">
        <div slot="serial" slot-scope="props">
          {{ props.index }}
        </div>
        <div slot="top" slot-scope="props">
          <b-badge class="cursor-pointer" v-if="props.row.status" @click="topQuestion(props.row.id, 0)" variant="primary">Activate</b-badge>
          <b-badge class="cursor-pointer" v-if="!props.row.status" @click="topQuestion(props.row.id, 1)" variant="secondary">Deactivate
          </b-badge>
        </div>
        <div slot="action" slot-scope="props">
          <CButtonGroup size="sm" class="mx-1">
            <CButton color="secondary" @click="openModalEdit(props.row)">
              <font-awesome-icon icon="edit"/>
            </CButton>
            <CButton color="secondary" @click="deletes(props.row.id)">
              <font-awesome-icon icon="trash-alt"/>
            </CButton>
          </CButtonGroup>
        </div>
      </v-client-table>
    </div>
    <!-- End Datatable -->

    <!-- Modal -->
    <b-modal size="lg" id="adminModal3" :title="editMode ? 'Question Information Edit': 'New Question Add'"
             hide-footer>
      <b-form @submit.prevent="editMode ? update(): submit()" @keydown="form.onKeydown($event)">
        <b-row>
          <b-col>
            <b-form-group label="Select Category :">
              <b-form-select v-model="$v.form.category_id.$model" @input="categorySelect"
                             :options="Object.values(helpCategoryList)"
                             :state="validateState('category_id')" value-field="id"
                             text-field="name">
                <template v-slot:first>
                  <b-form-select-option value="" disabled>-- Please select Category --</b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.category_id.required">
                Category required.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Select Subcategory :">
              <b-form-select v-model="$v.form.subcategory_id.$model" :options="Object.values(subcategory)"
                             :state="validateState('subcategory_id')" value-field="id"
                             text-field="name">
                <template v-slot:first>
                  <b-form-select-option value="" disabled>-- Please select Subcategory --</b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.subcategory_id.required">
                Subcategory required.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Type your question? :">
          <b-form-input
              class="form-control form-control-solid h-auto"
              id="BrandName-1"
              v-model="$v.form.question.$model"
              placeholder="Question"
              :state="validateState('question')"
              aria-describedby="BrandName"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.question.required">
            Question required.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.question.maxLength">
            Question maximum 255 character.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Type your Answer :">
          <ckeditor :editor="editor" v-model="form.answer" :config="editorConfig"></ckeditor>
          <div class="error text-danger" style="font-size: 12px" v-if="!$v.form.answer.required">Please enter question
            answer
          </div>
        </b-form-group>
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
            <CButton block color="dark" @click="$bvModal.hide('adminModal3')">Close</CButton>
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
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  HELP_QUESTION,
  HELP_QUESTION_ADD,
  HELP_QUESTION_MODIFY, HELP_QUESTION_REMOVE, HELP_QUESTION_STATUS_MODIFY
} from "@/core/services/store/module/help";
import ApiService from "@/core/services/api.service";

export default {
  mixins: [validationMixin],
  name: "Question",
  data() {
    return {
      editMode: false,
      form: new Form({
        id: '',
        question: '',
        answer: '',
        category_id: '',
        subcategory_id: '',
        slug: '',
      }),
      subcategory: [],
      columns: ['serial', 'question', 'top', 'action'],
      options: {
        headings: {
          serial: '#',
          question: 'Help Question',
          top: 'Top Question',
        },
        filterable: ['question']
      },
      editor: ClassicEditor,
      editorConfig: {},
    }
  },
  validations: {
    form: {
      question: {
        required,
        maxLength: maxLength(255)
      },
      category_id: {
        required,
      },
      subcategory_id: {
        required,
      },
      answer: {
        required,
      }
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
      this.$bvModal.show('adminModal3');
    },
    openModalEdit(data) {
      this.$v.$reset();
      this.form.reset();
      this.form.clear();
      this.form.fill(data);
      this.categorySelect(this.form.category_id);
      this.form.subcategory_id = data.subcategory_id;
      this.editMode = true;
      this.$bvModal.show('adminModal3');
    },
    categorySelect(e) {
      this.form.subcategory_id = '';
      this.subcategory = this.getHelpSubcategoryById(e);
    },
    submit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.post('help-question')
          .then(({data}) => {
            this.$store.commit(HELP_QUESTION_ADD, data);
            this.form.reset();
            this.validation = true;
            this.$bvModal.hide('adminModal3');
            toast.fire({
              icon: 'success',
              title: 'Question Add successfully'
            });
          })
          .catch((e) => {

          })
    },
    update() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.put('help-question/' + this.form.id)
          .then(({data}) => {
            this.$store.commit(HELP_QUESTION_MODIFY, data);
            this.form.reset();
            this.$bvModal.hide('adminModal3');
            toast.fire({
              icon: 'success',
              title: 'Question Update successfully'
            });
          });
    },
    deletes(id) {
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
          this.form.delete('help-question/' + id)
              .then((data) => {
                if (data.data.result === 'Error') {
                  swal.fire("Failed!", data.data.message, 'warning')
                } else {
                  swal.fire(
                      'Deleted!',
                      'Question has been deleted.',
                      'success'
                  )
                  this.$store.commit(HELP_QUESTION_REMOVE, id);
                }
              })
              .catch(() => {
                swal.fire("Failed!", 'There was something wrong.', 'warning')
              });
        }
      })
    },
    topQuestion(id, type) {
      let data = {
        'id': id,
        'status': type
      };
      ApiService.post('help-question/' + id + '/status', data);
      this.$store.commit(HELP_QUESTION_STATUS_MODIFY, data);
    }
  },
  created() {
    this.$store.dispatch(HELP_QUESTION)
  },
  computed: {
    ...mapGetters(["helpSubcategoryList", "helpCategoryList", "getHelpSubcategoryById", "helpQuestionList"])
  },
}
</script>

<style scoped>
.cursor-pointer{
  cursor: pointer;
}
</style>