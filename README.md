# Purple Cross Ltd — Employee Management Dashboard

A centralized employee management dashboard built for Purple Cross Ltd as part of their onboarding into the Employee Management module.

## Tech Stack

- **Vue 3** (Composition API)
- **PrimeVue 4** — UI component library
- **Pinia** — state management
- **Vue Router** — client-side routing

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Features

### Core
- Employee table with sortable and filterable columns
- Employment and termination status labels (e.g. "Currently employed", "To be terminated")
- View, Edit, and Delete actions per row — delete requires confirmation
- Create Employee form with validation for all required fields
- Duplicate employee code detection
- Responsive layout for mobile and desktop

### Nice-to-Have
- Navigation bar with logged-in user badge
- Pagination (10 / 25 / 50 rows per page)
- Import employees from CSV
- Export employees to CSV
- Editable dropdowns for Occupation and Department, pre-populated with existing values or free text entry

### Validation
- Required fields: Code, Full Name, Occupation, Department
- Termination date cannot be set before the date of employment
- Invalid URLs redirect back to the employee list