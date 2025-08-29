<template>
  <button type="button" class="btn btn-secondary" v-on:click="onClickOrdersButton()">取消</button>
</template>
<script>
export default {
  methods: {
    onClickOrdersButton: async function () {
      window.location.reload(true);
    },
  },
};
</script>
