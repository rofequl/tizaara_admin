<template>
  <div>
    <!-- Page Header -->
    <div class="row mb-3">
      <div class="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">User
        </span>
        <h3 class="page-title">User List</h3>
      </div>
    </div>
    <!-- End Page Header -->
    <hr>
    <CRow>
      <CCol sm="6" lg="4" v-for="(users, index) in userList" :key="index">
        <section class="card">
          <div class="corner-ribon black-ribon">
            <span class="badge badge-pill m-1 float-right" style="font-size: 12px">
              {{ users.account_type == 0 ? 'Both' : users.account_type == 1 ? 'Supplier' : 'Buyer' }}
            </span>
          </div>
          <div class="twt-feed bg-secondary"
               :class="users.account_type == 0?'bg-info':users.account_type == 1?'bg-success':'bg-warning'">
            <div class="media">
              <a href="#">
                <img class="align-self-center rounded-circle mr-3" style="width:85px; height:85px;" alt=""
                     v-lazy="users.photo_type == 0? showImage(users.photo):users.photo">
              </a>
              <div class="media-body">
                <h3 class="text-white text-ellipsis display-6">{{ users.first_name + ' ' + users.last_name }}</h3>
                <p v-c-tooltip.hover.click="users.email" class="text-light text-ellipsis mb-0"
                   style="width: 95%!important;">
                  <font-awesome-icon icon="mail-bulk"/>
                  {{ users.email }}
                </p>
                <p class="text-light text-ellipsis">
                  <font-awesome-icon class="mr-1" icon="phone"/>
                  {{ users.mobile }}
                </p>
              </div>
            </div>
          </div>
          <div class="weather-category twt-category">
            <ul class="mb-0">
              <li>
                <h5>0</h5>
                Product
              </li>
              <li>
                <h5>0</h5>
                Purchase
              </li>
              <li>
                <h5>0</h5>
                Sells
              </li>
            </ul>
          </div>
          <hr>
          <div v-if="users.status == 1" class="row m-1" style="font-size: 14px">
            <div class="col-md-5">
              Verify Supplier:
            </div>
            <div class="col-md-7">
              <button @click="verifyUser(users.id)" class="btn btn-sm btn-primary">Verify</button>
            </div>
          </div>
          <div v-if="users.status == 2" class="row m-1" style="font-size: 14px">
            <div class="col-md-5">
              Block:
            </div>
            <div class="col-md-7">
              <b-form-checkbox name="check-button" switch></b>
              </b-form-checkbox>
            </div>
          </div>

          <footer class="twt-footer">

          </footer>
        </section>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {USER_LIST, USER_VERIFY} from "@/core/services/store/user.module";
import {api_base_url} from "@/core/config/app";
import {mapGetters} from "vuex";

export default {
  name: "UserList",

  methods: {
    showImage(e) {
      return api_base_url + e;
    },
    verifyUser(id) {
      this.$store.dispatch(USER_VERIFY, id)
          .then(() => {
            toast.fire({
              icon: 'success',
              title: 'User verify successfully'
            });
          }).catch(() => {
        swal.fire("Failed!", 'There was something wrong.', 'warning')
      })
    }
  },
  created() {
    this.$store.dispatch(USER_LIST)
  },
  computed: {
    ...mapGetters(["userIsLoaded", "userList"])
  },
}
</script>

<style lang="scss" scoped>
section.card {
  margin-bottom: 1.875em;
  border-radius: 5px;
  padding: 0;
  border: 0 solid transparent;
  -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);

  /* Ribons */
  .corner-ribon {
    text-align: center;
    width: 87px;
    height: 34px;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    z-index: 1;
  }

  .corner-ribon i {
    padding: 10px 0 0 35px;
    color: #fff;
  }

  .twt-feed .wtt-mark {
    color: rgba(255, 255, 255, 0.15);
    font-size: 160px;
    position: absolute;
    top: 10px;
    left: 40%;
  }

  .twt-feed {
    -webkit-border-radius: 4px 4px 0 0;
    color: #FFFFFF;
    padding: 40px 10px 10px;
    position: relative;
    min-height: 150px;
  }

  .weather-category {
    padding: 15px 0 0;
    color: #74829C;
  }

  .weather-category ul li {
    width: 32%;
    text-align: center;
    border-right: 1px solid #e6e6e6;
    display: inline-block;
  }

  .twt-feed.blue-bg {
    background: #58C9F3;
  }

  .twt-category {
    display: inline-block;
    margin-bottom: 0;
    margin-top: 10px;
    width: 100%;
  }

  .twt-category ul li {
    color: #bdbdbd;
    font-size: 13px;
  }

  .twt-footer {
    padding: 12px 15px;
  }

  .twt-footer, .twt-footer a {
    color: #d2d2d2;
  }
}

@media (max-width: 1368px) {
  .twt-feed {
    max-height: 155px;
  }
  .twt-category {
    margin-bottom: 0;
  }

}
</style>
