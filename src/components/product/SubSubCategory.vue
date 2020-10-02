<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Product
        </span>
        <h3 class="page-title">Sub Subcategory Information</h3>
      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <CButton block color="info" @click="openModal">Add New Sub Subcategory</CButton>
        </div>
      </div>
    </div>
    <!-- End Page Header -->

    <!-- Datatable -->
    <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper no-footer my-5">
      <vue-element-loading :active="loadActive" background-color="white" spinner="bar-fade-scale"/>
      <div class="dataTables_length"><label>Show
        <select v-model="tableData.length" @change="loadData()">
          <option v-for="(records, index) in perPage" :key="index" :value="records">{{ records }}</option>
        </select>
        entries</label></div>
      <div class="dataTables_filter">
        <label>Search:
          <input type="search" v-model="tableData.search" @input="loadData()">
        </label>
      </div>
      <datatable :columns="columns" :sortKey="sortKey" :sortOrders="sortOrders" @sort="sortBy">
        <tbody>
        <tr role="row" class="odd" v-for="(project, i) in projects.data" :key="project.id">
          <td>{{ i + serial_no }}</td>
          <td>{{ project.name }}</td>
          <td>{{ project.subcategory.name }}</td>
          <td>{{ project.subcategory.category.name }}</td>
          <td>
            <CButtonGroup size="sm" class="mx-1">
              <CButton color="secondary" @click="openModalEdit(project)">
                <font-awesome-icon icon="edit"/>
              </CButton>
              <CButton color="secondary" @click="deleteSubcategory(project.id)">
                <font-awesome-icon icon="trash-alt"/>
              </CButton>
            </CButtonGroup>
          </td>
        </tr>
        </tbody>
      </datatable>
      <div class="dataTables_footer">
        <div class="dataTables_info">
          Showing {{ projects.from }} to {{ projects.to }} of {{ projects.total }} entries
        </div>
        <div class="dataTables_paginate paging_simple_numbers">
          <pagination :data="projects" :show-disabled="true" :align="align" :limit="2"
                      @pagination-change-page="loadData">
            <span slot="prev-nav">Previous</span>
            <span slot="next-nav">Next</span>
          </pagination>
        </div>
      </div>
    </div>
    <!-- End Datatable -->


    <!-- Modal -->
    <b-modal id="adminModal" :title="editMode ? 'Sub-Subcategory Information Edit': 'New Sub-Subcategory Add'"
             hide-footer>
      <b-form @submit.prevent="editMode ? updateSubcategory(): createSubcategory()" @keydown="form.onKeydown($event)">
        <b-form-group>
          <b-form-input
              class="form-control form-control-solid h-auto"
              :class="{ 'is-invalid': form.errors.has('name')}"
              id="BrandName-1"
              v-model="$v.form.name.$model"
              placeholder="Sub-Subcategory Name"
              :state="validateState('name')"
              aria-describedby="BrandName"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.name.required">
            Subcategory name required.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.name.maxLength">
            Subcategory name maximum 50 character.
          </b-form-invalid-feedback>
          <has-error :form="form" field="name"></has-error>
        </b-form-group>
        <b-form-group>
          <v-select v-model="form.category_id" :options="category" label="name"
                    :reduce="name => name.id" @input="categorySelect"
                    placeholder="Select Category"
          >
            <template #search="{attributes, events}">
              <input
                  class="vs__search is-invalid"
                  v-bind="attributes"
                  :required="!form.category_id"
                  v-on="events"
              />
            </template>
            <template #option="{ name, icon }">
              <img :src="getProfilePhoto(icon)" class="mx-2" width="18px" height="18px">
              <em>{{ name }}</em>
            </template>
          </v-select>
        </b-form-group>
        <b-form-group>
          <v-select v-model="form.sub_category_id" :options="subcategory" label="name"
                    :reduce="name => name.id"
                    placeholder="Select Subcategory"
          >
            <template #search="{attributes, events}">
              <input
                  class="vs__search is-invalid"
                  v-bind="attributes"
                  :required="!form.sub_category_id"
                  v-on="events"
              />
            </template>
            <template #option="{ name, icon }">
              <em>{{ name }}</em>
            </template>
          </v-select>
        </b-form-group>
        <b-form-group>
          <b-form-input
              v-model="$v.form.meta_title.$model"
              :state="validateState('meta_title')"
              placeholder="Meta Title"
          ></b-form-input>
          <b-form-invalid-feedback>
            Meta title maximum 255 character.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
          <b-form-textarea
              id="textarea"
              v-model="form.meta_description"
              placeholder="Description"
              rows="3"
          ></b-form-textarea>
        </b-form-group>
        <CRow class="justify-content-end">
          <CCol col="4" sm="4" md="3" class="mb-3 mb-xl-0">
            <CButton block color="info" type="submit" :disabled="form.busy">
              {{ editMode ? 'Update' : 'Submit' }}
            </CButton>
          </CCol>
          <CCol col="4" sm="4" md="3" class="mb-3 mb-xl-0">
            <CButton block color="dark" @click="$bvModal.hide('adminModal')">Close</CButton>
          </CCol>
        </CRow>
      </b-form>
    </b-modal>
    <!-- End Modal -->
  </div>
</template>

<script>
import {validationMixin} from "vuelidate";
import {required, maxLength} from "vuelidate/lib/validators";
import ApiService from "@/core/services/api.service";
import Datatable from "../helper/Datatable";
import {api_base_url} from "@/core/config/app";

export default {
  mixins: [validationMixin],
  name: "SubSubCategory",
  data() {
    let sortOrders = {};

    let columns = [
      {label: '#', name: '#'},
      {label: 'Sub Subcategory Name', name: 'name'},
      {label: 'Sub Category Name', name: 'category_id'},
      {label: 'Category Name', name: 'sub_category_id'},
      {label: 'Action', name: false}
    ];

    columns.forEach((column) => {
      sortOrders[column.name] = -1;
    });
    return {
      validation: true,
      validation2: true,
      editMode: false,
      form: new Form({
        id: '',
        name: '',
        category_id: '',
        sub_category_id: '',
        meta_title: '',
        slug: '',
        meta_description: ''
      }),
      loadActive: false,
      projects: {},
      category: [],
      subcategory: [],
      columns: columns,
      columns_exist: ['name', 'category_id', 'sub_category_id'],
      sortKey: 'deadline',
      sortOrders: sortOrders,
      perPage: ['10', '20', '50'],
      align: 'right',
      tableData: {
        draw: 0,
        length: 10,
        search: '',
        column: 0,
        dir: 'desc',
      }
    }
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(50)
      },
      meta_title: {
        maxLength: maxLength(255)
      },
      category_id: {
        required
      }
    }
  },
  components: {
    datatable: Datatable
  },
  methods: {
    getProfilePhoto(e) {
      return api_base_url + e;
    },
    validateState(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    openModal() {
      $('.modal-content').removeAttr('tabindex');
      this.validation = true;
      this.$v.$reset();
      this.form.reset();
      this.form.clear();
      this.editMode = false;
      this.$bvModal.show('adminModal');
    },
    openModalEdit(data) {
      this.validation = true;
      this.form.reset();
      this.$v.$reset();
      this.form.clear();
      this.form.fill(data);
      this.form.category_id = data.subcategory.category.id;
      this.categorySelect(this.form.category_id);
      this.editMode = true;
      this.$bvModal.show('adminModal');
    },
    loadCategory() {
      var that = this;
      ApiService.get('category')
          .then(function (data) {
            that.category = data.data;
          })
          .catch(({response}) => {
            console.log(response);
          });
    },
    categorySelect(e) {
      var that = this;
      ApiService.get('subcategory/', e)
          .then(function (data) {
            that.subcategory = data.data;
          })
          .catch(({response}) => {
            console.log(response);
          });
    },
    loadData(page = 1) {
      this.loadActive = true;
      this.projects = {};
      let url = 'subsubcategory?page=' + page;
      this.tableData.draw++;
      ApiService.get(url, '', {params: this.tableData})
          .then(({data}) => {
            this.loadActive = false;
            let response = data.data;
            if (this.tableData.draw == data.draw) {
              this.projects = response;
              this.serial_no = response.from;
            }
          })
          .catch(({response}) => {

          });
    },
    sortBy(key) {
      if (this.columns_exist.indexOf(key) === -1)
        return true;
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
      this.tableData.column = this.getIndex(this.columns, 'name', key);
      this.tableData.dir = this.sortOrders[key] === 1 ? 'asc' : 'desc';
      this.loadData();
    },
    getIndex(array, key, value) {
      return array.findIndex(i => i[key] == value)
    },
    createSubcategory() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.post('subsubcategory')
          .then((e) => {
            this.loadData();
            this.form.reset();
            this.validation = true;
            this.$bvModal.hide('adminModal');
            toast.fire({
              icon: 'success',
              title: 'Sub Subcategory Add successfully'
            });
          })
          .catch((e) => {

          })
    },
    updateSubcategory() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.put('subsubcategory/' + this.form.id)
          .then((e) => {
            this.loadData();
            this.form.reset();
            this.validation = true;
            this.$bvModal.hide('adminModal');
            toast.fire({
              icon: 'success',
              title: 'Sub Subcategory Update successfully'
            });
          })
          .catch((e) => {

          })
    },
    deleteSubcategory(id) {
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
          this.form.delete('subsubcategory/' + id)
              .then((data) => {
                this.loadData();
                setTimeout(() => {
                  swal.fire(
                      'Deleted!',
                      'Sub Subcategory has been deleted.',
                      'success'
                  )
                }, 1000);
              })
              .catch(() => {
                swal("Failed!", 'There was something wrong.', 'warning')
              });
        }
      })
    },

  },
  created() {
    this.loadData();
    this.loadCategory();
  }
}
</script>

<style scoped>
.select2-container--open {
  z-index: 9999999
}
</style>
