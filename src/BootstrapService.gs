function getBootstrapData() {
  const config = getAppConfig_();
  const staff = getCurrentStaffUser_();
  return {
    app: {
      name: config.appName,
      environment: config.environment,
      currentYear: Number(Utilities.formatDate(new Date(), 'Asia/Manila', 'yyyy'))
    },
    currentStaff: staff ? {
      email: staff.user_email,
      full_name: staff.full_name,
      role: staff.role,
      province_code: staff.province_code || '',
      lgu_code: staff.lgu_code || ''
    } : null,
    locations: getLocationReferenceData_(),
    references: {
      commodities: getReferenceRows_('Ref_Commodities'),
      varieties: getReferenceRows_('Ref_Varieties'),
      topographies: getReferenceRows_('Ref_Topographies'),
      interventionTypes: getReferenceRows_('Ref_Intervention_Types'),
      productionUnits: getReferenceRows_('Ref_Production_Units'),
      waterSources: getReferenceRows_('Ref_Water_Sources'),
      tenure: getReferenceRows_('Ref_Tenure'),
      maritalStatuses: getReferenceRows_('Ref_Marital_Status'),
      sex: [
        { code: 'MALE', label: 'Male' },
        { code: 'FEMALE', label: 'Female' }
      ],
      utilizationStatuses: [
        { code: 'FULLY_UTILIZED', label: 'Fully Utilized' },
        { code: 'PARTIALLY_UTILIZED', label: 'Partially Utilized' },
        { code: 'NOT_UTILIZED', label: 'Not Utilized' }
      ],
      interventionPriorities: [
        { code: 'LOW', label: 'Low' },
        { code: 'MEDIUM', label: 'Medium' },
        { code: 'HIGH', label: 'High' }
      ]
    }
  };
}
