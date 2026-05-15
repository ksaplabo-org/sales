<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-white static-top shadow-sm">
      <button class="btn btn-link text-dark order-1 order-sm-0 px-4" id="sidebarToggle" href="#">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Navbar -->
      <ul class="navbar-nav ms-auto">
        <li class="nav-item px-3">
          <BDropdown variant="link" strategy="fixed" no-caret>
            <!-- アイコン（クリックで開く） -->
            <template #button-content>
              <i class="fas fa-user-circle text-black fs-5"></i>
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
