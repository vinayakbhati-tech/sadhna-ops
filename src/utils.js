export function getStaff() {
  const data = localStorage.getItem('sadhna_staff')
  if (data) {
    return JSON.parse(data)
  }
  const defaultStaff = [
    { name: "Ramesh Kumar", role: "Machine Operator" },
    { name: "Rohit Chaudhary", role: "Packing Staff" },
    { name: "Sahil Bhiwani", role: "Quality Check" },
  ]
  localStorage.setItem('sadhna_staff', JSON.stringify(defaultStaff))
  return defaultStaff
}

export function saveStaff(staffList) {
  localStorage.setItem('sadhna_staff', JSON.stringify(staffList))
}

export function getEntries() {
  const data = localStorage.getItem('sadhna_entries')
  if (data) {
    return JSON.parse(data)
  }
  return []
}

export function saveEntries(entries) {
  localStorage.setItem('sadhna_entries', JSON.stringify(entries))
}

export function exportEntriesToCSV(entries) {
  if (entries.length === 0) {
    alert('No entries to export')
    return
  }

  const headers = ['Staff Name', 'Task', 'Quantity', 'Date', 'Time']
  const rows = entries.map((entry) => [
    entry.staffName,
    entry.taskName,
    entry.quantity,
    entry.date,
    entry.time,
  ])

  let csvContent = headers.join(',') + '\n'
  rows.forEach((row) => {
    csvContent += row.join(',') + '\n'
  })

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'sadhna-ops-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function getRole() {
  return localStorage.getItem('sadhna_role')
}

export function setRole(role) {
  localStorage.setItem('sadhna_role', role)
}

export function logout() {
  localStorage.removeItem('sadhna_role')
}