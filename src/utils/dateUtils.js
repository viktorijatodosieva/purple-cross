function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getEmploymentStatus(dateOfEmployment) {
  if (dateOfEmployment > getToday()) return 'Employed soon';
  if (dateOfEmployment < getToday()) return 'Currently employed';
}

export function getTerminationStatus(terminationDate) {
  if (!terminationDate) return '';
  if (terminationDate > getToday()) return 'To be terminated';
  if (terminationDate < getToday()) return 'Terminated';
}
