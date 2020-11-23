<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Marketing
        </span>
        <h3 class="page-title">Quotation List</h3>
      </div>
    </div>
    <!-- End Page Header -->

    <!-- Datatable -->
    <div id="people" class="dataTables_wrapper no-footer my-5">
      <v-client-table :data="Object.values(quotationList)" :columns="columns" class="text-center"
                      :options="options">
        <div slot="action" slot-scope="props">
          <CButtonGroup size="sm" class="mx-1">
            <CButton color="secondary" v-if="props.row.status === 0" @click="openQuotationEdit(props.row)">
              <font-awesome-icon icon="edit"/>
            </CButton>
            <CButton color="secondary" @click="deleteQuotation(props.row.id)">
              <font-awesome-icon icon="trash-alt"/>
            </CButton>
          </CButtonGroup>
        </div>
      </v-client-table>
    </div>
    <!-- End Datatable -->


    <!-- Modal -->
    <b-modal id="adminModal" title="Supplier assign"
             hide-footer>
      <b-form @submit.prevent="updateQuotation" @keydown="form.onKeydown($event)">
        <b-form-group label="Email  address :"
                      label-cols-sm="5"
                      label-cols-lg="4">
          <b-form-input
              v-model="form.email" readonly disabled
              placeholder="Quotation mail"
          ></b-form-input>
        </b-form-group>
        <CRow>
          <CCol col="6" sm="4" md="4" class="mb-3 mb-xl-5">
            Select Supplier:
          </CCol>
          <CCol col="6" sm="8" md="8" class="mb-3 mb-xl-0">
            <v-select label="first_name" :filterable="false" :options="supplier" @search="onSearch"
                      @input="addNewSupplier"
                      :reduce="name => name.id" placeholder="Search Supplier by name, phone number" multiple>
              <template slot="no-options">
                type to search supplier..
              </template>
              <template #option="{ first_name, last_name }">
                <div class="d-center">
                  {{ first_name + ' ' + last_name }}
                </div>
              </template>
              <template slot="selected-option" slot-scope="supplier">
                <div class="selected d-center">
                  {{ supplier.first_name + ' ' + supplier.last_name }}
                </div>
              </template>
            </v-select>
          </CCol>
        </CRow>
        <CRow class="justify-content-end">
          <CCol col="4" sm="4" md="3" class="mb-3 mb-xl-0">
            <CButton block color="info" type="submit" :disabled="form.busy">
              <span v-if="form.busy" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
              <span v-if="form.busy" class="sr-only">Loading...</span>
              Update
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
import _ from 'lodash';
import {mapGetters} from "vuex";
import {QUOTATION_LIST, QUOTATION_MODIFY, QUOTATION_REMOVE} from "@/core/services/store/module/quotation";
import ApiService from "@/core/services/api.service";

export default {
  name: "quotation",
  data() {
    return {
      form: new Form({
        id: '',
        email: '',
        user_id: '',
      }),
      supplier: [],
      columns: ['email', 'product', 'quantity', 'action'],
      options: {
        headings: {
          email: 'Email',
          product: 'Product / Service',
          quantity: 'Quantity',
        },
        sortable: [],
        filterable: ['email', 'product']
      }
    }
  },
  methods: {
    openQuotationEdit(data) {
      this.form.reset();
      this.form.clear();
      this.form.email = data.email;
      this.form.id = data.id;
      this.$bvModal.show('adminModal');
    },
    deleteQuotation(id) {
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
          this.form.delete('quotation/' + id)
              .then((data) => {
                if (data.data.result === 'Error') {
                  swal.fire("Failed!", data.data.message, 'warning')
                } else {
                  swal.fire(
                      'Deleted!',
                      'Quotation has been deleted.',
                      'success'
                  )
                  this.$store.commit(QUOTATION_REMOVE, id);
                }
              })
              .catch(() => {
                swal("Failed!", 'There was something wrong.', 'warning')
              });
        }
      })
    },
    onSearch(search, loading) {
      loading(true);
      this.search(loading, search, this);
    },
    search: _.debounce((loading, search, vm) => {
      let url = 'user/supplier-search?searchSupplier=' + search;
      ApiService.get(url)
          .then(res => {
            vm.supplier = res.data;
            loading(false);
          });
    }, 350),
    addNewSupplier(e) {
      this.form.user_id = e;
    },
    updateQuotation() {
      this.form.put('quotation/' + this.form.id)
          .then(() => {
            this.$bvModal.hide('adminModal');
            this.$store.commit(QUOTATION_MODIFY, this.form.id);
            toast.fire({
              icon: 'success',
              title: 'Supplier assign successfully'
            });
          })
          .catch((error) => {
            let data = error.response;
            if (data.status === 422) {
              let allData = '', mainData = '';
              $.each(data.data.errors, function (key, value) {
                if ($.isPlainObject(value)) {
                  $.each(value, function (key, value) {
                    allData += value + "<br/>";
                  });
                } else {
                  mainData += value + "<br/>";
                }
              });
              swal.fire({
                title: 'Warning',
                html: mainData,
                type: 'error'
              })
            } else {
              swal.fire("Failed!", 'There was something wrong.', 'warning')
            }
          })
    }
  },
  created() {
    this.$store.dispatch(QUOTATION_LIST)
  },
  computed: {
    ...mapGetters(["quotationList"])
  },
}
</script>

<style scoped>

</style>