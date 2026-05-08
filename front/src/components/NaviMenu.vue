<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
      <router-link class="navbar-brand mr-1" :to="{ name: 'top' }">
        <img src="/src/image/logo.png" width="auto" height="20px" />
      </router-link>

      <button class="btn btn-link btn-sm text-white order-1 order-sm-0" id="sidebarToggle" href="#">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Navbar Search(なし) -->
      <form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0"></form>

      <!-- Navbar -->
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <BDropdown variant="link" strategy="fixed" no-caret>
            <!-- アイコン（クリックで開く） -->
            <template #button-content>
              <i class="fas fa-user-circle fa-fw"></i>
            </template>

            <!-- メニュー -->
            <BDropdownItem>
              <i class="bi bi-person me-2"></i>
              プロフィール
            </BDropdownItem>

            <BDropdownItem>
              <i class="bi bi-gear me-2"></i>
              設定
            </BDropdownItem>

            <BDropdownDivider />

            <BDropdownItem>
              <i class="bi bi-box-arrow-right me-2"></i>
              ログアウト
            </BDropdownItem>
          </BDropdown>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import * as Auth from "@/utils/auth.js";

async function logout() {
  try {
    await Auth.signOut();
    this.$router.push({ name: "signIn", params: { flashMsg: "サインアウトしました" } });
  } catch (e) {
    this.isLoading = false;
    this.msg = e.message;
    this.$router.push({ name: "signIn", params: { flashErrMsg: "サインアウト中にエラーが発生しました" } });
  }
}
</script>
