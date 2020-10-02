<template>
  <div class="c-app flex-row align-items-center" v-bind:style="{ backgroundImage: 'url(' + showImage($store.getters.generalList.admin_login_background) + ')' }">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <b-form class="form" @submit.stop.prevent="onSubmit">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <div role="alert"
                       v-bind:class="{ show: errors.length }"
                       class="alert fade alert-danger">
                    <div class="alert-text">
                      {{ errors }}
                    </div>
                  </div>
                  <b-form-group
                      id="example-input-group-1"
                      label=""
                      label-for="example-input-1"
                  >
                    <b-form-input
                        class="form-control form-control-solid h-auto"
                        id="example-input-1"
                        name="example-input-1"
                        placeholder="email or phone number"
                        v-model="$v.form.email.$model"
                        :state="validateState('email')"
                        aria-describedby="input-1-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback" v-if="!$v.form.email.email">
                      Enter valid email address.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback id="input-1-live-feedback" v-if="!$v.form.email.required">
                      Email address required.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group
                      id="example-input-group-2"
                      label=""
                      label-for="example-input-2"
                  >
                    <b-form-input
                        class="form-control form-control-solid h-auto"
                        type="password"
                        id="example-input-2"
                        v-model="$v.form.password.$model"
                        :state="validateState('password')"
                        placeholder="password"
                        name="example-input-2"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-2-live-feedback">
                      Password is required.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <button
                          ref="kt_login_signin_submit"
                          class="btn btn-primary font-weight-bold my-3 font-size-3">
                        Sign In
                      </button>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                </b-form>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {LOGIN, LOGOUT} from "@/core/services/store/auth.module";
import {validationMixin} from "vuelidate";
import {email, minLength, required} from "vuelidate/lib/validators";
import {api_base_url} from "@/core/config/app";

export default {
  mixins: [validationMixin],
  name: "login",
  data() {
    return {
      // Remove this dummy login info
      form: {
        email: "",
        password: ""
      }
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    showImage(e) {
      return api_base_url + e;
    },
    validateState(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null,
        password: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      const email = this.$v.form.email.$model;
      const password = this.$v.form.password.$model;

      this.$store.dispatch(LOGOUT);

      // set spinner to submit button
      const submitButton = this.$refs["kt_login_signin_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      this.$store
          .dispatch(LOGIN, {email, password})
          .then(() => this.$router.push({name: "dashboard"}))
          .catch((data) => console.log(data));

      submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
      );
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>

<style scoped>

</style>
