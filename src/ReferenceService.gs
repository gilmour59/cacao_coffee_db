function getReferenceRows_(sheetName) {
  return getRowsAsObjects_(sheetName).filter(function(row) {
    const value = String(row.is_active || '').trim().toUpperCase();
    return value === '' || value === 'TRUE' || value === 'YES' || value === '1';
  });
}

function getLocationReferenceData_() {
  return {
    provinces: getReferenceRows_('Ref_Provinces'),
    lgus: getReferenceRows_('Ref_LGUs'),
    barangays: getReferenceRows_('Ref_Barangays')
  };
}
