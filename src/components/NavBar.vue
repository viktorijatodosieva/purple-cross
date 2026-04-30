<script setup>
import Avatar from 'primevue/avatar'
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <span class="navbar-brand">Purple Cross</span>
    </div>
    <div class="navbar-right">
      <Avatar icon="pi pi-user" shape="circle" style="background-color: #ede9fe; color: #7c3aed;" />
      <span class="navbar-user">Admin</span>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  color: #1e1e2e;
  padding: 1rem 2rem;
  border-bottom: 2px solid #7c3aed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.navbar-brand {
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: #7c3aed;
}

.navbar-user {
  color: #555;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-user {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
