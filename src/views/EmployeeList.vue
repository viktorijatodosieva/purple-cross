<script setup>
import {useEmployeeStore} from "@/stores/employeeStore.js";
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import InputText from 'primevue/inputtext';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const store = useEmployeeStore();
const confirm = useConfirm();
const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

function getEmploymentsStatus(dateOfEmployment){
  if(dateOfEmployment > new Date().toISOString().split('T')[0]){
    return 'Employed soon'
  }else if(dateOfEmployment < new Date().toISOString().split('T')[0]){
    return 'Currently employed'
  }
}

function getTerminationStatus(terminationDate){
  if(!terminationDate) return ''
  else if(terminationDate > new Date().toISOString().split('T')[0]){
    return 'To be terminated'
  }else if(terminationDate < new Date().toISOString().split('T')[0]){
    return 'Terminated'
  }
}

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
  <div style="padding: 1rem;">

  <DataTable :value="store.employees" v-model:filters="filters" filterDisplay="row" tableStyle="min-width: 50rem">
    <template #header>
      <InputText v-model="filters['global'].value" placeholder="Search..." />
    </template>
    <Column sortable field="fullName" header="Full Name" />
    <Column sortable field="occupation" header="Occupation" />
    <Column sortable field="department" header="Department" />
    <Column header="Date of Employment">
      <template #body="{data}">
        {{getEmploymentsStatus(data.dateOfEmployment)}}
      </template>
    </Column>
    <Column header="Termination Date">
      <template #body="{data}">
        {{getTerminationStatus(data.terminationDate)}}
      </template>
    </Column>
    <Column header="Actions">
      <template #body="{data}">
        <div style="display: flex; gap: 1rem">
        <Button label="View" @click="router.push(`/employees/${data.code}`)" class="p-button-text" />
        <Button label="Edit" @click="router.push(`/employees/edit/${data.code}`)" class="p-button-text" />
        <Button label="Delete" @click="deleteEmployee(data.code)" class="p-button-text" />
        </div>
      </template>
    </Column>
  </DataTable>
  <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
    <Button label="Create Employee" @click="router.push('/employees/create')" />
  </div>
  <ConfirmDialog />
  </div>
</template>

<style scoped>

</style>