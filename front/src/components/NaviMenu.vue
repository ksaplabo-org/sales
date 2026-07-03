<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-white static-top shadow-sm">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item px-3">
          <BDropdown variant="link" strategy="fixed" no-caret>
            <template #button-content>
              <i class="fas fa-user-circle text-black fs-5"></i>
            </template>

            <BDropdownHeader>{{ Auth.currentUserInfo().userId }} さん</BDropdownHeader>
            <BDropdownDivider />
            <BDropdownItem @click="handleSelect('edit')">編集</BDropdownItem>
            <BDropdownItem @click="handleSelect('logout')">ログアウト</BDropdownItem>
          </BDropdown>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import * as Auth from "@/utils/auth.js";

const router = useRouter();

async function handleSelect(action) {
  switch (action) {
    case "edit":
      console.log("編集処理");
      break;
    case "logout":
      await Auth.logout();
      router.push({ name: "login" });
      break;
  }
}
</script>
