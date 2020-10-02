<template>
  <CHeader fixed with-subheader light>
    <CToggler
        in-header
        class="ml-3 d-lg-none"
        @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
        in-header
        class="ml-3 d-md-down-none"
        @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <CIcon name="logo" height="48" alt="Logo"/>
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">

    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CDropdown
          inNav
          class="c-header-nav-items"
          placement="bottom-end"
          add-menu-classes="pt-0"
      >
        <template #toggler>
          <CHeaderNavLink>
            <div class="c-avatar">
              <img src="@/assets/image/avatars/6.jpg"
                  class="c-avatar-img "
              /> <span class="mx-3">Admin</span>
            </div>
          </CHeaderNavLink>
        </template>
        <CDropdownItem>
          <CIcon name="cil-user"/>
          Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-settings"/>
          Settings
        </CDropdownItem>
        <CDropdownDivider/>
        <CDropdownItem @click="onLogout">
          <CIcon name="cil-lock-locked"/>
          Logout
        </CDropdownItem>
      </CDropdown>
    </CHeaderNav>
  </CHeader>
</template>

<script>
import { LOGOUT } from "@/core/services/store/auth.module";
export default {
  name: 'Header',
  components: {},
  methods: {
    onLogout() {
      this.$store
          .dispatch(LOGOUT)
          .then(() => this.$router.push({ name: "login" }));
    }
  },
}
</script>
