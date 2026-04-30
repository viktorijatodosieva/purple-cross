<script setup>
import { useRoute, useRouter } from 'vue-router'
import {useEmployeeStore} from "@/stores/employeeStore.js";
import { getEmploymentStatus, getTerminationStatus } from '@/utils/dateUtils.js';
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const route = useRoute();
const router = useRouter();
const store = useEmployeeStore();
const confirm = useConfirm();

const employee = store.employees.find(emp => emp.code === route.params.id);

function deleteEmployee() {
  confirm.require({
    message: 'Are you sure you want to delete this employee?',
    header: 'Confirm Deletion',
    accept: () => {
      store.deleteEmployee(employee.code)
      router.push('/employees')
    }
  })
}

</script>

<template>
  <div class="page-wrapper">
    <div class="profile-card">

      <div class="profile-header">
        <div class="profile-avatar">
          <i class="pi pi-user" style="font-size: 2rem; color: #7c3aed;"></i>
        </div>
        <div>
          <h2 class="profile-name">{{ employee.fullName }}</h2>
          <span class="profile-occupation">{{ employee.occupation }}</span>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-row">
          <span class="detail-label">Code</span>
          <span class="detail-value">{{ employee.code }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Department</span>
          <span class="detail-value">{{ employee.department }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Employment Status</span>
          <span class="detail-value">{{ getEmploymentStatus(employee.dateOfEmployment) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Termination Status</span>
          <span class="detail-value">{{ getTerminationStatus(employee.terminationDate) || '—' }}</span>
        </div>
      </div>

      <div class="profile-actions">
        <Button label="Back" severity="secondary" @click="router.push('/employees')" />
        <Button label="Edit" icon="pi pi-pencil" @click="router.push(`/employees/edit/${employee.code}`)" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteEmployee" />
      </div>

    </div>
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.profile-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ede9fe;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  margin: 0;
  font-size: 1.4rem;
  color: #1e1e2e;
}

.profile-occupation {
  color: #7c3aed;
  font-size: 0.95rem;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.detail-label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.detail-value {
  color: #1e1e2e;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>