<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-white static-top shadow-sm">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item px-3">
          <BDropdown variant="link" strategy="fixed" no-caret>
            <template #button-content>
              <i class="fas fa-user-circle text-black fs-5"></i>
            </template>

            <BDropdownHeader>{{ loginInfo.userId }} さん</BDropdownHeader>
            <BDropdownDivider />
            <BDropdownItem @click="handleSelect('edit')"><i class="fas fa-user"></i> 編集</BDropdownItem>
            <BDropdownItem @click="handleSelect('logout')"
              ><i class="fas fa-sign-out-alt"></i> ログアウト</BDropdownItem
            >
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

const loginInfo = Auth.currentUserInfo();

async function handleSelect(action) {
  switch (action) {
    case "edit":
      router.push({ name: "userEdit", params: { id: loginInfo.userId }, query: { from: "profile" } });
      break;
    case "logout":
      await Auth.logout();
      router.push({ name: "login" });
      break;
  }
}
</script>
