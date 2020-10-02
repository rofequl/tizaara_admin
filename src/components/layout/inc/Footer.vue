<template>
  <CFooter :fixed="false">
    <div>
      <span class="ml-1">{{$store.getters.generalList.footer_text}}</span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1">Developed by</span>
      <a href="http://uniteditbd.com/" target="_blank">United IT</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
