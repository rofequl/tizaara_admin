<template>
  <div>
    <!-- Page Header -->
    <div class="row">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Frontend Settings
        </span>
        <h3 class="page-title">Home Settings</h3>
      </div>
    </div>
    <!-- End Page Header -->

    <CRow class="justify-content-center my-4">
      <CCol sm="12">
        <b-card no-body>
          <b-tabs pills card>
            <b-tab title="Listing" active>
              <Listing/>
            </b-tab>
            <b-tab title="Home Slider">
              <b-card-text>
                <Slider/>
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import Listing from "@/components/frontend/Home/Listing";
import Slider from "@/components/frontend/Home/Slider";
import {HOMEBANNER_LIST} from "@/core/services/store/module/homeslider";
import {HOME_CATEGORY_PRODUCT} from "@/core/services/store/module/category";

export default {
  name: "Home",
  components: {Listing, Slider},
  created() {
    this.$store.dispatch(HOMEBANNER_LIST)
    this.$store.dispatch(HOME_CATEGORY_PRODUCT)
  },
}
</script>

<style scoped>

</style>