<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Product
        </span>
        <h3 class="page-title">Property</h3>
      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <CButton @click="addProperties" color="info">Add New Property</CButton>
        </div>
      </div>
    </div>
    <!-- End Page Header -->

    <b-collapse id="collapse-1" v-model="visible" class="mt-2">
      <b-card>
        <b-form @submit.prevent="editMode ? updateProperties(): createProperties()" @keydown="form.onKeydown($event)">
          <CInput label="Properties Name :" v-model="$v.form.name.$model"
                  horizontal placeholder="Enter properties name"
                  :invalidFeedback="!$v.form.name.required?'Properties name required.': $v.form.name.maxLength?'':'Properties name not more than 200 character.' "
                  :isValid="validateState('name')"/>
          <CRow class="mt-3">
            <CCol col="6" sm="4" md="3" class="mb-3 mb-xl-0">
              Sub Subcategory
            </CCol>
            <CCol col="6" sm="4" md="9" class="mb-3 mb-xl-0">
              <v-select v-model="form.subcategory_id" :options="subcategory" label="name"
                        :reduce="name => name.id" placeholder="Select Sub Subcategory" multiple>
                <template #search="{attributes, events}">
                  <input
                      class="vs__search is-invalid"
                      v-bind="attributes"
                      :required="!form.subcategory_id"
                      v-on="events"
                  />
                </template>
                <template #option="{ name, icon }">
                  <em>{{ name }}</em>
                </template>
              </v-select>
            </CCol>
          </CRow>
          <CRow class="justify-content-end mt-5">
            <CCol col="4" sm="4" md="2" class="mb-3 mb-xl-0">
              <CButton block color="info" type="submit" :disabled="form.busy">
                {{ editMode ? 'Update' : 'Submit' }}
              </CButton>
            </CCol>
            <CCol col="4" sm="4" md="2" class="mb-3 mb-xl-0">
              <CButton block color="dark" @click="addProperties">Close</CButton>
            </CCol>
          </CRow>
        </b-form>
      </b-card>
    </b-collapse>

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
          <td>
            <b-badge variant="primary" class="m-1 p-1" v-for="subcategory in project.subsubcategory"
                     :key="subcategory.id">{{ subcategory.name }}
            </b-badge>
          </td>
          <td>
            <CButtonGroup size="sm" class="mx-1">
              <CButton color="secondary" @click="editProperties(project)">
                <font-awesome-icon icon="edit"/>
              </CButton>
              <CButton color="secondary" @click="deleteProperties(project.id)">
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

  </div>
</template>

<script>
import {maxLength, required} from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";
import ApiService from "@/core/services/api.service";
import Datatable from "../helper/Datatable";

export default {
  mixins: [validationMixin],
  name: "Property",
  data() {
    let sortOrders = {};

    let columns = [
      {label: '#', name: '#'},
      {label: 'Property Name', name: 'name'},
      {label: 'Sub Subcategory Name'},
      {label: 'Action'}
    ];

    columns.forEach((column) => {
      sortOrders[column.name] = -1;
    });
    return {
      editMode: false,
      form: new Form({
        id: '',
        name: '',
        subcategory_id: '',
      }),
      visible: false,
      subcategory: [],
      loadActive: false,
      projects: {},
      columns: columns,
      columns_exist: ['name'],
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
        maxLength: maxLength(200)
      },
    }
  },
  components: {
    datatable: Datatable
  },
  methods: {
    validateState(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    addProperties() {
      this.visible = !this.visible;
      this.form.reset();
      this.$v.$reset();
      this.form.clear();
      this.editMode = false;
    },
    editProperties(data) {
      this.visible = true;
      this.form.reset();
      this.$v.$reset();
      this.form.clear();
      let subsubcategory = [];
      data.subsubcategory.forEach((column) => {
        subsubcategory.push(column.id);
      });
      this.form.fill(data);
      this.form.subcategory_id = subsubcategory;
      this.editMode = true;
    },
    loadSubsubcategory() {
      let that = this;
      ApiService.get('subsubcategory')
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
      let url = 'property?page=' + page;
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
    createProperties() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.post('property')
          .then((e) => {
            this.addProperties();
            this.loadData();
            toast.fire({
              icon: 'success',
              title: 'Property Add successfully'
            });
          })
          .catch((e) => {

          })
    },
    updateProperties() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.put('property/' + this.form.id)
          .then((e) => {
            this.addProperties();
            this.loadData();
            toast.fire({
              icon: 'success',
              title: 'Property Update successfully'
            });
          })
          .catch((e) => {

          })
    },
    deleteProperties(id) {
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
          this.form.delete('attribute/' + id)
              .then((data) => {
                this.loadData();
                toast.fire({
                  icon: 'success',
                  title: 'Property deleted successfully'
                });
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
    this.loadSubsubcategory();
  }
}
</script>

<style scoped>

</style>
