import { GridMetaDataType } from "@acuteinfo/common-base";

export const AdvocateMstGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "CODE",
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
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "CODE",
      columnName: "Code",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "AdvocateName",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 260,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "CONTACT1",
      columnName: "MobileNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ADD1",
      columnName: "Address",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 260,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "EMAIL",
      columnName: "EmailID",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 280,
      minWidth: 260,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "STATUS",
      columnName: "Inactive",
      sequence: 7,
      alignment: "left",
      componentType: "editableCheckbox",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
      isReadOnly: true,
    },
    {
      accessor: "INACTIVE_DATE",
      columnName: "Inactive Date",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
