<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Region
        </span>
        <h3 class="page-title">Area</h3>
      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <CButton block color="info" @click="openModal">Add New Area</CButton>
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
          <td>{{ project.zip_code }}</td>
          <td>{{ project.city.name }}</td>
          <td>{{ project.city.division.country.name }}</td>
          <td>
            <CButtonGroup size="sm" class="mx-1">
              <CButton color="secondary" @click="openModalEdit(project)">
                <font-awesome-icon icon="edit"/>
              </CButton>
              <CButton color="secondary" @click="deleteArea(project.id)">
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
    <b-modal id="adminModal" :title="editMode ? 'Area Information Edit': 'New Area Add'"
             hide-footer centered>
        <b-form @submit.prevent="editMode ? updateArea(): createArea()" @keydown="form.onKeydown($event)">
          <CInput label="Area Name :" v-model="$v.form.name.$model"
                  horizontal placeholder="Enter Area Name"
                  :invalidFeedback="!$v.form.name.required?'Area name required.': $v.form.name.maxLength?'':'Area name not more than 100 character.' "
                  :isValid="validateState('name')"/>

          <CInput label="Zip Code :" v-model="$v.form.zip_code.$model"
                  horizontal placeholder="Enter Zip Code"
                  :invalidFeedback="!$v.form.zip_code.required?'Zip Code required.': $v.form.zip_code.maxLength?'':'Zip Code not more than 100 character.' "
                  :isValid="validateState('zip_code')"/>
          <CSelect
              label="Select Country :"
              horizontal
              :value.sync="$v.form.country_id.$model"
              :options="country"
              placeholder="Please select Country"
              @update:value="countrySelect"
              :invalidFeedback="$v.form.country_id.required?'':'Country name required.' "
              :isValid="validateState('country_id')"
          />
          <CSelect
              label="Select Division :"
              horizontal
              :value.sync="$v.form.division_id.$model"
              :options="division"
              placeholder="Please select Division"
              @update:value="divisionSelect"
              :invalidFeedback="$v.form.division_id.required?'':'Division name required.' "
              :isValid="validateState('division_id')"
          />
          <CSelect
              label="Select City :"
              horizontal
              :value.sync="$v.form.city_id.$model"
              :options="city"
              placeholder="Please select City"
              :invalidFeedback="$v.form.city_id.required?'':'City name required.' "
              :isValid="validateState('city_id')"
          />

          <CRow class="justify-content-end mt-5">
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
        <b-overlay :show="show" no-wrap>
        </b-overlay>
    </b-modal>
    <!-- End Modal -->
  </div>
</template>

<script>
import {validationMixin} from "vuelidate";
import ApiService from "@/core/services/api.service";
import Datatable from "../helper/Datatable";
import {maxLength, required} from "vuelidate/lib/validators";
import _ from 'lodash';

export default {
  mixins: [validationMixin],
  name: "Area",
  data() {
    let sortOrders = {};

    let columns = [
      {label: '#', name: '#'},
      {label: 'Area Name', name: 'name'},
      {label: 'Zip Code'},
      {label: 'Under City'},
      {label: 'Country'},
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
        zip_code: '',
        country_id: '',
        division_id: '',
        city_id: '',
      }),
      loadActive: false,
      projects: {},
      country: [],
      division: [],
      city: [],
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
      },
      show: false
    }
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      zip_code: {
        required,
        maxLength: maxLength(100)
      },
      country_id: {
        required,
      },
      division_id: {
        required,
      },
      city_id: {
        required,
      }
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
    openModal() {
      this.form.reset();
      this.$v.$reset();
      this.form.clear();
      this.editMode = false;
      this.$bvModal.show('adminModal');
    },
    openModalEdit(data) {
      this.show = true;
      this.form.reset();
      this.$v.$reset();
      this.form.clear();
      this.form.fill(data);
      this.form.country_id = data.city.division.country.id;
      this.countrySelect(this.form.country_id);
      this.form.division_id = data.city.division.id;
      this.divisionSelect(this.form.division_id);
      this.form.city_id = data.city.id;
      this.editMode = true;
      this.$bvModal.show('adminModal');
    },
    loadData(page = 1) {
      this.loadActive = true;
      this.projects = {};
      let url = 'area?page=' + page;
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
    loadCountry() {
      let that = this;
      ApiService.get('country')
          .then(function (data) {
            that.country = _.map(data.data, function (data) {
              var pick = _.pick(data, 'id', 'name');
              var object = {
                value: pick.id,
                label: pick.name
              };
              return object;
            })
          })
          .catch(({response}) => {
            console.log(response);
          });
    },
    countrySelect(e) {
      console.log(e)
      this.division = [];
      this.form.division_id = '';
      this.city = [];
      this.form.city_id = '';
      let that = this;
      ApiService.get('division/', e)
          .then(function (data) {
            that.division = _.map(data.data, function (data) {
              var pick = _.pick(data, 'id', 'name');
              var object = {
                value: pick.id,
                label: pick.name
              };
              return object;
            })
          })
          .catch(({response}) => {
            console.log(response);
          });
    },
    divisionSelect(e) {
      this.city = [];
      this.form.city_id = '';
      let that = this;
      ApiService.get('city/', e)
          .then(function (data) {
            that.city = _.map(data.data, function (data) {
              var pick = _.pick(data, 'id', 'name');
              var object = {
                value: pick.id,
                label: pick.name
              };
              return object;
            })
            that.show = false;
          })
          .catch(({response}) => {
            console.log(response);
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
    createArea() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.post('area')
          .then((e) => {
            this.loadData();
            this.form.reset();
            this.$bvModal.hide('adminModal');
            toast.fire({
              icon: 'success',
              title: 'Area Add successfully'
            });
          })
          .catch((e) => {

          })
    },
    updateArea() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.put('area/' + this.form.id)
          .then((e) => {
            this.loadData();
            this.form.reset();
            this.$bvModal.hide('adminModal');
            toast.fire({
              icon: 'success',
              title: 'Area Update successfully'
            });
          })
          .catch((e) => {

          })
    },
    deleteArea(id) {
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
          this.form.delete('area/' + id)
              .then((data) => {
                this.loadData();
                toast.fire({
                  icon: 'success',
                  title: 'Area deleted successfully'
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
    this.loadCountry();
  }
}
</script>

<style scoped>

</style>
