<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Product
        </span>
        <h3 class="page-title">In House Products</h3>
      </div>
      <div class="col-12 col-sm-6 d-flex align-items-center">
        <div class="mx-auto ml-sm-auto mr-sm-0">
          <router-link class="btn btn-primary" to="/product/product-admin-create" color="info">
            <font-awesome-icon icon="plus" class="mr-2"/>
            Add New Product
          </router-link>
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
          <td>
            <b-media>
              <template v-slot:aside>
                <b-img :src="getProfilePhoto(project.thumbnail_img)" v-if="project.thumbnail_img" class="border"
                       width="80px"></b-img>
              </template>
              <p>{{ project.name }}</p>
            </b-media>
          </td>
          <td>{{ project.num_of_sale }}</td>
          <td>{{ project.stockManagement == 1 ? totalQty(project) : 'Null' }}</td>
          <td>{{ project.priceType == 1 ? totalPrice(project.product_stock) : project.unit_price }}</td>
          <td>
            <CButtonGroup size="sm" class="mx-1">
              <CButton color="secondary">
                <font-awesome-icon icon="edit"/>
              </CButton>
              <CButton color="secondary">
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
import ApiService from "@/core/services/api.service";
import Datatable from "../helper/Datatable";
import {api_base_url} from "@/core/config/app";

export default {
  name: "Product",
  components: {
    datatable: Datatable
  },
  data() {
    let sortOrders = {};

    let columns = [
      {label: '#', name: '#'},
      {label: 'Name', name: 'name'},
      {label: 'Num of Sale'},
      {label: 'Total Stock'},
      {label: 'Base Price'},
      {label: 'Action'}
    ];

    columns.forEach((column) => {
      sortOrders[column.name] = -1;
    });
    return {
      loadActive: false,
      projects: {},
      category: [],
      subcategory: [],
      columns: columns,
      columns_exist: ['name', 'num_of_sale'],
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
  methods: {
    getProfilePhoto(e) {
      return api_base_url + e;
    },
    loadData(page = 1) {
      this.loadActive = true;
      this.projects = {};
      let url = 'product?page=' + page;
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
    totalQty: function (e) {
      if (e.priceType == 1) {

        let total = [];
        Object.entries(e).forEach(([key, val]) => {
          total.push(val.qty)
        });
        return total.reduce(function (total, num) {
          return total + num
        }, 0);
      } else {
        return e.quantity > 0? e.quantity: 0;
      }
    },
    totalPrice: function (e) {
      if (e.length == 0) return;
      console.log('ase');

      let max = e.reduce((a, b) => Number(a.price) > Number(b.price) ? a : b)
      let min = e.reduce((a, b) => Number(a.price) < Number(b.price) ? a : b)
      return max === min ? max.price : min.price + ' - ' + max.price;

    }
  },
  created() {
    this.loadData();
  }
}
</script>

<style scoped>

</style>
