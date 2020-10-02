<template>
  <div class="c-app">
    <Sidebar/>
    <CWrapper>
      <Header/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <Footer/>
    </CWrapper>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Sidebar from './inc/Sidebar'
import Header from './inc/Header'
import Footer from './inc/Footer'
import {GENERAL_LIST} from "@/core/services/store/general.module";

export default {
  name: "Layout",
  components: {
    Sidebar,
    Header,
    Footer
  },
  created() {
    this.$store.dispatch(GENERAL_LIST)
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push({name: "login"});
    }
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
    ]),
  }
}
</script>

<style scoped>

</style>
