<template>
  <button type="button" class="btn btn-secondary btn-lg btn-block" v-on:click="onClickCancelButton()">取消</button>
</template>
<script>
export default {
  methods: {
    onClickCancelButton: function () {
      const cancelConfirm = window.confirm("入力内容を取り消しますか？");
      if (cancelConfirm) {
        window.location.reload();
      }
    },
  },
};
</script>
