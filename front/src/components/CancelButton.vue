<template>
  <div class="col-2">
    <button type="button" class="btn btn-secondary btn-lg btn-block" v-on:click="onClickCancelButton()">取消</button>
  </div>
</template>
<script>
export default {
  methods: {
    onClickCancelButton: async function () {
      var cancelConfirm = window.confirm("入力内容を取り消しますか？");
      if (cancelConfirm) {
        window.location.reload(true);
      }
    },
  },
};
</script>
