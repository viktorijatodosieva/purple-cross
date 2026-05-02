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
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const router = useRouter();
const store = useEmployeeStore();
const confirm = useConfirm();
const toast = useToast();
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

function escapeCSVField(value) {
  const str = value == null ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

function exportCSV() {
  const headers = ['code', 'fullName', 'occupation', 'department', 'dateOfEmployment', 'terminationDate']
  const rows = store.employees.map(emp =>
    headers.map(h => escapeCSVField(emp[h])).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'employees.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const fileInput = ref(null)
const REQUIRED_IMPORT_FIELDS = ['code', 'fullName', 'occupation', 'department']

function triggerImport() {
  fileInput.value.click()
}

function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const lines = e.target.result.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      toast.add({ severity: 'warn', summary: 'Empty file', detail: 'The CSV file contains no employee rows.', life: 4000 })
      return
    }

    const headers = parseCSVLine(lines[0]).map(h => h.trim())

    const missingHeaders = REQUIRED_IMPORT_FIELDS.filter(f => !headers.includes(f))
    if (missingHeaders.length) {
      toast.add({ severity: 'error', summary: 'Invalid file', detail: `Missing columns: ${missingHeaders.join(', ')}`, life: 5000 })
      return
    }

    let added = 0
    let skipped = 0

    lines.slice(1).forEach(line => {
      const values = parseCSVLine(line)
      const employee = {}
      headers.forEach((h, i) => {
        const val = values[i]?.trim() || null
        employee[h] = val
      })

      const missingRequired = REQUIRED_IMPORT_FIELDS.filter(f => !employee[f])
      if (missingRequired.length) {
        skipped++
        return
      }

      if (store.employees.some(e => e.code === employee.code)) {
        skipped++
        return
      }

      store.addEmployee(employee)
      added++
    })

    if (added > 0) {
      toast.add({
        severity: 'success',
        summary: 'Import successful',
        detail: `${added} employee(s) imported${skipped ? `, ${skipped} skipped (duplicates or missing required fields)` : ''}.`,
        life: 5000
      })
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Nothing imported',
        detail: `All ${skipped} row(s) were skipped — they may be duplicates or missing required fields.`,
        life: 5000
      })
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}
</script>

<template>
  <div class="page-content">

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
        <div class="table-header-actions">
          <Button label="Import" icon="pi pi-download" outlined style="min-width: 7rem" @click="triggerImport" />
          <Button label="Export" icon="pi pi-upload" outlined style="min-width: 7rem" @click="exportCSV" />
          <input ref="fileInput" type="file" accept=".csv" style="display: none;" @change="handleImport" />
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </IconField>
        </div>
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
  <Toast />
  </div>
</template>

<style scoped>
:deep(.p-datatable-tbody > tr > td),
:deep(.p-datatable-thead > tr > th) {
  font-size: 0.95rem;
}

.page-content {
  padding: 2rem;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.table-header h2 {
  margin: 0;
  color: #7c3aed;
}

.table-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.table-header-actions :deep(.p-inputtext) {
  border-color: rgb(233, 213, 255);
}

.table-header-actions :deep(.p-inputtext:hover) {
  border-color: rgb(233, 213, 255);
}

@media (max-width: 640px) {
  .page-content {
    padding: 1rem;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-header-actions {
    width: 100%;
  }

  .table-header-actions :deep(.p-iconfield) {
    flex: 1;
    min-width: 0;
  }

  .table-header-actions :deep(.p-inputtext) {
    width: 100%;
  }
}
</style>
