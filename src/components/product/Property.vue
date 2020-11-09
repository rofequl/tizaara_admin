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
          <router-link to="/product/properties-create" class="btn btn-primary" color="info">Add New Property
          </router-link>
        </div>
      </div>
    </div>
    <!-- End Page Header -->

    <!-- Datatable -->
    <div id="people" class="dataTables_wrapper no-footer my-5">
      <v-client-table :data="Object.values(propertyList)" :columns="columns" class="text-center" :options="options">
        <div slot="serial" slot-scope="props">
          {{ props.index }}
        </div>
        <div slot="name" slot-scope="props" v-html="getPropertyList(props.row.name)"></div>
        <div slot="category" slot-scope="props">
          {{ getLastCatChild(props.row.position, props.row.cat_id) }}
        </div>
        <div slot="action" slot-scope="props">
          <CButton color="secondary" @click="deleteProperties(props.row.id)">
            <font-awesome-icon icon="trash-alt"/>
          </CButton>
        </div>
      </v-client-table>
    </div>
    <!-- End Datatable -->


  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {PROPERTY_LIST, PROPERTY_REMOVE} from "@/core/services/store/module/property";
import {CATEGORY_LIST} from "@/core/services/store/module/category";
import {SUBCATEGORY_LIST} from "@/core/services/store/module/subcategory";
import {SUBSUBCATEGORY_LIST} from "@/core/services/store/module/subsubcategory";
import ApiService from "@/core/services/api.service";

export default {
  name: "Property",
  data() {
    return {
      columns: ['serial', 'name', 'category', 'action'],
      options: {
        headings: {
          serial: '#',
          name: 'Property List',
          category: 'Child Category'
        }
      }
    }
  },
  methods: {
    getPropertyList(e) {
      let data = '';
      let property = JSON.parse(e);
      for (let i = 0; i < property.length; i++) {
        data += property[i].name + '<br>';
      }
      return data;
    },

    getLastCatChild(position, id) {
      return position === 1 ? this.getCategoryById(id).name : position === 2 ? this.getSubcategoryNameById(id).name : this.getSubsubcategoryNameById(id).name;
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
          ApiService.delete('property/' + id)
              .then((data) => {
                toast.fire({
                  icon: 'success',
                  title: 'Property deleted successfully'
                });
                this.$store.commit(PROPERTY_REMOVE, id);
              })
              .catch(() => {
                swal("Failed!", 'There was something wrong.', 'warning')
              });
        }
      })
    },
  },
  created() {
    this.$store.dispatch(CATEGORY_LIST)
    this.$store.dispatch(SUBCATEGORY_LIST)
    this.$store.dispatch(SUBSUBCATEGORY_LIST)
    this.$store.dispatch(PROPERTY_LIST)
  },
  computed: {
    ...mapGetters(["propertyList", "getCategoryById", "getSubcategoryNameById", "getSubsubcategoryNameById"])
  },
}
</script>

<style scoped>

</style>
