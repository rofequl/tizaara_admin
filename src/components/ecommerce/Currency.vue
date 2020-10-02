<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">E-commerce Setup
        </span>
        <h3 class="page-title">Currency</h3>
      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <CButton block color="info" @click="openModal">Add New Currency</CButton>
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
            <td>{{ project.symbol }}</td>
            <td>{{ project.code }}</td>
            <td>
              <CSwitch
                  class="mr-1"
                  color="danger"
                  :checked="project.status === 0? false:true"
                  shape="pill"
                  @update:checked="(state)=>{currencyChecked(state,project.id)}"
              />
            </td>
            <td>{{ project.exchange_rate }}</td>
            <td>
              <CButtonGroup size="sm" class="mx-1">
                <CButton color="secondary" @click="openModalEdit(project)">
                  <font-awesome-icon icon="edit"/>
                </CButton>
                <CButton color="secondary" @click="deleteCurrency(project.id)">
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
    <b-modal id="adminModal" :title="editMode ? 'Currency Information Edit': 'New Currency Add'"
             hide-footer centered>
      <b-form @submit.prevent="editMode ? updateCurrency(): createCurrency()" @keydown="form.onKeydown($event)">
        <CInput label="Currency Name :" v-model="$v.form.name.$model"
                horizontal placeholder="Enter Currency Name"
                :invalidFeedback="!$v.form.name.required?'Currency name required.': $v.form.name.maxLength?'':'Currency name not more than 255 character.' "
                :isValid="validateState('name')"/>

        <CInput label="Currency Symbol:" v-model="$v.form.symbol.$model"
                horizontal placeholder="Enter Currency Symbol"
                :invalidFeedback="!$v.form.symbol.required?'Currency Symbol required.': $v.form.symbol.maxLength?'':'Currency Symbol not more than 255 character.' "
                :isValid="validateState('symbol')"/>

        <CInput label="Currency Code :" v-model="$v.form.code.$model"
                horizontal placeholder="Enter Currency Code"
                :invalidFeedback="$v.form.code.maxLength?'':'Currency code not more than 20 character.' "
                :isValid="validateState('code')"/>

        <CInput label="Exchange Rate :" v-model="$v.form.exchange_rate.$model"
                horizontal placeholder="Enter Exchange Rate" type="number" step="0.01" min="0"
                :invalidFeedback="$v.form.exchange_rate.maxLength?'':'Exchange Rate not more than 10 character.' "
                :isValid="validateState('exchange_rate')"/>

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
    </b-modal>
    <!-- End Modal -->

  </div>
</template>

<script>
import {validationMixin} from "vuelidate";
import ApiService from "@/core/services/api.service";
import Datatable from "../helper/Datatable";
import {maxLength, required} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "Currency",
  data() {
    let sortOrders = {};

    let columns = [
      {label: '#', name: '#'},
      {label: 'Name', name: 'name'},
      {label: 'Symbol', name: 'symbol'},
      {label: 'Code', name: 'code'},
      {label: 'Status'},
      {label: 'Exchange Rate', name: 'exchange_rate'},
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
        symbol: '',
        exchange_rate: '',
        code: '',
      }),
      loadActive: false,
      projects: {},
      columns: columns,
      columns_exist: ['name', 'symbol', 'code', 'exchange_rate'],
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
        maxLength: maxLength(255)
      },
      symbol: {
        required,
        maxLength: maxLength(255)
      },
      code: {
        maxLength: maxLength(20)
      },
      exchange_rate: {
        maxLength: maxLength(10)
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
      this.form.reset();
      this.$v.$reset();
      this.form.clear();
      this.form.fill(data);
      this.editMode = true;
      this.$bvModal.show('adminModal');
    },
    loadData(page = 1) {
      this.loadActive = true;
      this.projects = {};
      let url = 'currency?page=' + page;
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
    createCurrency() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.post('currency')
          .then((e) => {
            this.loadData();
            this.form.reset();
            this.$bvModal.hide('adminModal');
            toast.fire({
              icon: 'success',
              title: 'Currency Add successfully'
            });
          })
          .catch((e) => {
            swal("Failed!", 'There was something wrong.', 'warning')
          })
    },
    updateCurrency() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.form.put('currency/' + this.form.id)
          .then(() => {
            this.loadData();
            this.form.reset();
            this.$bvModal.hide('adminModal');
            toast.fire({
              icon: 'success',
              title: 'Currency Update successfully'
            });
          })
          .catch((e) => {
            swal("Failed!", 'There was something wrong.', 'warning')
          })
    },
    deleteCurrency(id) {
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
                  title: 'Currency deleted successfully'
                });
              })
              .catch(() => {
                swal("Failed!", 'There was something wrong.', 'warning')
              });
        }
      })
    },
    currencyChecked(e, f) {
      e = e ? 1 : 0;
      this.form.get('currency/' + f + '/' + e)
          .catch((e) => {
            swal("Failed!", 'There was something wrong.', 'warning')
          })
    }
  },
  created() {
    this.loadData();
  }
}
</script>

<style scoped>

</style>
