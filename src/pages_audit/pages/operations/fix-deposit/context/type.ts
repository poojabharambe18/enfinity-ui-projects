export interface FDStateType {
  activeStep: number;
  isBackButton: boolean;
  disableButton: boolean;
  fdDetailFormData: object;
  sourceAcctFormData: object;
  payslipAndDDData: object;
  beneficiaryAcctData: object;
  retrieveFormData: object;
  fdParaDetailData: object;
  acctNoData: object;
  viewDtlGridData: any;
  fdPaymentData: object;
  checkAllowFDPayApiData: object;
  prematureRateData: object;
  fdSavedPaymentData: object;
  renewTrnsFormData: object;
  renewDataForDeposit: object;
  validatePaymetEntryData: object;
  schemeSelecRowData: object;
  fdDetailArrayFGridData: any;
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface FDContextType {
  userState: FDStateType;
  setActiveStep: any;
}
