<template>
  <div>
    <h1>Sorry</h1>
    <p v-show="msg">{{ msg }}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: "Sorry, an error occurred......",
    },
  },
};
</script>
