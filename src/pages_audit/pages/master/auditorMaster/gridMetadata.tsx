import { GridMetaDataType } from "@acuteinfo/common-base";

export const AuditorMstGridMetaData: GridMetaDataType = {
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
    pageSizes: [20, 40, 60],
    defaultPageSize: 20,
    containerHeight: {
      min: "72vh",
      max: "72vh",
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
      width: 90,
      minWidth: 70,
      maxWidth: 110,
      isAutoSequence: true,
    },
    {
      accessor: "AI_NM",
      columnName: "AuditorName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 260,
      minWidth: 240,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "ADD1",
      columnName: "Address1",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 260,
      minWidth: 240,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "ADD2",
      columnName: "Address2",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 260,
      minWidth: 240,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "CONTACT1",
      columnName: "PhoneNo",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      accessor: "CONTACT2",
      columnName: "MobileNo",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 160,
      maxWidth: 200,
    },
    {
      accessor: "DESG_NM",
      columnName: "Designation",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 160,
      maxWidth: 200,
    },
  ],
};
