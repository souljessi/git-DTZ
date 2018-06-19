<template>
  <div></div>
</template>


<script>
export default {
  data() {
    return {};
  },
  computed: {
    notic() {
      return this.$store.getters.getSocketMsg;
    }
  },
  watch: {
    notic(val) {
      this.$notify({
        duration: 0,
        message: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

