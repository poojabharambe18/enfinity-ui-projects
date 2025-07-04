import { GridMetaDataType } from "@acuteinfo/common-base";
export const SecurityUserConfirmationGrid: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "USER_NAME",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: true,
    allowColumnHiding: false,
    isCusrsorFocused: false,
    allowRowSelection: false,
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr No",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      isAutoSequence: true,
      width: 80,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "USER_NAME",
      columnName: "User Id",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 110,
      maxWidth: 130,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "User Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 110,
      maxWidth: 150,
    },
    {
      accessor: "USER_LVL_DATA_DISP",
      columnName: "User Level",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Last Entered by",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 110,
      maxWidth: 150,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Last Modified date",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 110,
      maxWidth: 150,
    },
  ],
};
export const loginShift: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Login Shift",
    rowIdColumn: "SHIFT_TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 40, 60],
    defaultPageSize: 20,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowRowSelection: false,
    hiddenFlag: "_hidden",
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SR.No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Login Shift",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "START_TIME",
      columnName: "Start Time",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      dateFormat: "HH:mm:ss",
      width: 180,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "END_TIME",
      columnName: "End Time",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "ACTIVE",
      columnName: "Active",
      sequence: 3,
      alignment: "left",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 80,
      minWidth: 60,
      maxWidth: 120,
    },
  ],
};
export const biometric: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Biometric Login",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 40, 60],
    defaultPageSize: 20,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowRowSelection: false,
    hiddenFlag: "_hidden",
  },
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SR.No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "USER_NAME",
      columnName: "User Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "FINGER_NM",
      columnName: "Finger Name",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 150,
      maxWidth: 200,
    },
  ],
};
