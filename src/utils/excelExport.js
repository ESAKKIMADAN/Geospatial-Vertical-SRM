import * as XLSX from 'xlsx';

/**
 * Exports event registrations directly into an authentic Microsoft Excel (.xlsx) spreadsheet
 * with pre-configured headers, auto column widths, and proper formatting.
 */
export const exportRegistrationsToExcel = (registrations, eventTitle = 'All_Events') => {
  if (!registrations || registrations.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const rows = registrations.map((reg, index) => ({
    'S.No': index + 1,
    'Registration ID': reg.id || `REG-${index + 1}`,
    'Event Title': reg.eventTitle || 'Geospatial Event',
    'Student Name': reg.name,
    'Register Number / ID': reg.registerNumber,
    'SRMIST Email': reg.email,
    'Department / Branch': reg.department || 'Not Specified',
    'Year of Study': reg.year || 'Not Specified',
    'Phone / WhatsApp': reg.phone || 'Not Provided',
    'Registered At': reg.registeredAt || new Date().toLocaleString('en-IN')
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set readable column widths for Excel
  worksheet['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 18 }, // Registration ID
    { wch: 34 }, // Event Title
    { wch: 24 }, // Student Name
    { wch: 22 }, // Register Number
    { wch: 28 }, // Email
    { wch: 26 }, // Department
    { wch: 14 }, // Year
    { wch: 18 }, // Phone
    { wch: 24 }  // Registered At
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Registrations');

  const safeTitle = eventTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `SRM_Geospatial_${safeTitle}_Registrations_${dateStamp}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
