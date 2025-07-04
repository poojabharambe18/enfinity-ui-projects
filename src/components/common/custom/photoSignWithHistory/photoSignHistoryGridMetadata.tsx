import { GridMetaDataType } from "@acuteinfo/common-base";
export const PhotoSignHistoryMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: {
      width: 100,
      maxWidth: 100,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 35],
    defaultPageSize: 15,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "SR_NO",
      isAutoSequence: true,
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 120,
    },
    {
      accessor: "CUST_PHOTO",
      columnName: "PhotoImage",
      sequence: 2,
      alignment: "center",
      componentType: "icondefault",
      width: 120,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "CUST_SIGN",
      columnName: "SignImage",
      sequence: 3,
      alignment: "center",
      componentType: "icondefault",
      width: 120,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ACT_FLAG",
      columnName: "Active Status",
      sequence: 4,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 110,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CONF_DISP",
      columnName: "ConfStatus",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 120,
      maxWidth: 300,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "Entered Branch",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "Scan By",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      showTooltip: true,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Scan Date",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 140,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      accessor: "MACHINE_NM",
      columnName: "Scan From Machine",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 160,
      minWidth: 80,
      maxWidth: 250,
      showTooltip: true,
    },
  ],
};
