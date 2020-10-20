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




  </div>
</template>

<script>
import {validationMixin} from "vuelidate";



export default {
  mixins: [validationMixin],
  name: "Property",
  data() {
    return {}
  },
  methods: {
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

  },
  computed: {

  },
}
</script>

<style scoped>

</style>
