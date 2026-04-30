<script setup>
import {useEmployeeStore} from "@/stores/employeeStore.js";
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { getEmploymentStatus, getTerminationStatus } from '@/utils/dateUtils.js';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const store = useEmployeeStore();
const confirm = useConfirm();
const filters = ref({
  global: { value: null, matchMode: 'contains' },
});

function deleteEmployee(code){
  confirm.require({
    message: 'Are you sure you want to delete this employee?',
    header: 'Confirm Deletion',
    accept: () => {
      store.deleteEmployee(code)
    }
  })
}
</script>

<template>
  <div style="padding: 2rem;">

  <div class="table-wrapper">
  <DataTable :value="store.employeesWithStatus"
             v-model:filters="filters" filterDisplay="row"
             :globalFilterFields="['fullName', 'occupation', 'department', 'employmentStatus', 'terminationStatus']"
             tableStyle="min-width: 50rem"
             stripedRows
             size="small"
             paginator
             :rows="10"
             :rowsPerPageOptions="[10, 25, 50]">
    <template #header>
      <div class="table-header">
        <h2>Employees</h2>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Search employees..." />
        </IconField>
      </div>
    </template>
    <Column sortable field="fullName" header="Full Name" style="width: 15rem;" />
    <Column sortable field="occupation" header="Occupation" style="width: 12rem;" />
    <Column sortable field="department" header="Department" style="width: 10rem;" />
    <Column header="Date of Employment" sortable sort-field="dateOfEmployment" style="width: 12rem;">
      <template #body="{data}">
        {{getEmploymentStatus(data.dateOfEmployment)}}
      </template>
    </Column>
    <Column header="Termination Date" sortable sort-field="terminationDate" style="width: 12rem;">
      <template #body="{data}">
        {{getTerminationStatus(data.terminationDate)}}
      </template>
    </Column>
    <Column style="width: 8rem;">
      <template #body="{data}">
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
          <Button icon="pi pi-eye" @click="router.push(`/employees/${data.code}`)" text rounded aria-label="View" />
          <Button icon="pi pi-pencil" @click="router.push(`/employees/edit/${data.code}`)" text rounded aria-label="Edit" />
          <Button icon="pi pi-trash" @click="deleteEmployee(data.code)" text rounded severity="danger" aria-label="Delete" />
        </div>
      </template>
    </Column>
  </DataTable>
  </div>
  <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
    <Button label="Create Employee" @click="router.push('/employees/create')" />
  </div>
  <ConfirmDialog />
  </div>
</template>

<style scoped>
:deep(.p-datatable-tbody > tr > td),
:deep(.p-datatable-thead > tr > th) {
  font-size: 0.95rem;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.table-header h2 {
  margin: 0;
  color: #7c3aed;
}
</style>
