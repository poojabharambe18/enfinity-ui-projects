import { GridMetaDataType } from "@acuteinfo/common-base";
export const EntryDescMasterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "SP_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    defaultPageSize: 15,
    pageSizes: [15, 30, 50],
    containerHeight: {
      min: "55vh",
      max: "55vh",
    },
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "Sr.No.",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "SP_CD",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 400,
    },
    {
      accessor: "DISPLAY",
      columnName: "ParentType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 200,
      maxWidth: 600,
    },
    {
      accessor: "SP_NM",
      columnName: "Description",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 300,
      maxWidth: 600,
      showTooltip: true,
    },
  ],
};
