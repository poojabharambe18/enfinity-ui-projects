import { GridMetaDataType } from "@acuteinfo/common-base";

export const ABPSAcctRegGridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 50, 100],
    defaultPageSize: 20,
    containerHeight: {
      min: "70vh",
      max: "70vh",
    },
    isCusrsorFocused: true,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 150,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_DT",
      columnName: "RegisterDate",
      sequence: 2,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "MASKED_UNIQUE_ID",
      columnName: "AadhaarNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "BranchCode",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccType",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AccountNum",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "REG_FLAG_DISP",
      columnName: "ACHolder",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "CUSTOMER_ID",
      columnName: "customerId",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "FRESH_REG_DISP",
      columnName: "FreshRegistration",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "UPLOAD_DISP",
      columnName: "UploadInNPCI",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 70,
      maxWidth: 200,
    },
    {
      accessor: "ACTIVE_DISP",
      columnName: "Status",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "RegisterFromBranch",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "TRAN_CD",
      columnName: "TranCD",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
      isVisible: false,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "EnteredBy",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
  ],
};

export const APBSUIDResponseGridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "UID Response",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 350,
      minWidth: 300,
      maxWidth: 400,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: true,
    disableGroupBy: true,
    enablePagination: false,
    containerHeight: {
      min: "35vh",
      max: "35vh",
    },
    isCusrsorFocused: true,
    disableGlobalFilter: true,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 150,
      isAutoSequence: true,
    },
    {
      accessor: "FILE_NM",
      columnName: "ResponseFileName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 250,
      maxWidth: 500,
      showTooltip: true,
    },
    {
      accessor: "MAPPED_IIN",
      columnName: "MappedIIN",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "SCHEME",
      columnName: "Scheme",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 50,
      maxWidth: 200,
    },
    {
      accessor: "MANDATE_CUST_DATE",
      columnName: "MandateDate",
      sequence: 5,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 110,
      minWidth: 70,
      maxWidth: 150,
    },
    {
      accessor: "MAPPING_STATUS",
      columnName: "MappingStatus",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 170,
    },
    {
      accessor: "UID_RESULT",
      columnName: "UID Result",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 400,
      showTooltip: true,
    },
  ],
};
