<template>
  <div id="loading">
    <div class="loadingMsg">
      <img :src="loading" />
    </div>
  </div>
</template>

<script setup>
import loading from "@/image/gif-load.gif";
</script>

<style scoped>
#loading {
  display: table;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(255, 255, 255);
  opacity: 0.5;
}

#loading .loadingMsg {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  padding-top: 140px;
}
</style>
