import { useCallback } from "react";
import {
  GridWrapper,
  ActionTypes,
  GridMetaDataType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { FDDetailForArrayFieldMetaData } from "./FDDetailGridForArrayFieldMetaData";

// Render actions
const actions: ActionTypes[] = [
  {
    actionName: "edit",
    actionLabel: "Edit",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const FDDetailGridForArrayField = ({
  gridData,
  setGridData,
  editingSRNORef,
  setFdDtlRefresh,
  iniDtlFormDataNewFDRef,
}) => {
  const { MessageBox } = usePopupContext();

  const setCurrentAction = useCallback(
    async (data) => {
      const { name, rows } = data;
      const rowData = rows[0]?.data;
      if (!rowData) return;

      if (name === "edit") {
        editingSRNORef.current = rowData;
        iniDtlFormDataNewFDRef.current = { ...rowData };
        setFdDtlRefresh((prev) => prev + 1);
      } else if (name === "delete") {
        const btnName = await MessageBox({
          message: "DeleteData",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          icon: "CONFIRM",
        });

        if (btnName === "Yes" && rowData?.SR_NO) {
          const updatedGridData = gridData?.filter(
            (row) => row?.SR_NO !== rowData?.SR_NO
          );

          const reindexedData = updatedGridData?.map((row, index) => ({
            ...row,
            SR_NO: index + 1,
          }));

          setGridData(reindexedData);
        }
      }
    },
    [gridData, editingSRNORef.current, setFdDtlRefresh, iniDtlFormDataNewFDRef]
  );

  return (
    <GridWrapper
      key={"FDDetailForArrayField" + gridData?.length}
      finalMetaData={FDDetailForArrayFieldMetaData as GridMetaDataType}
      data={gridData}
      setData={() => null}
      actions={actions}
      setAction={setCurrentAction}
      hideHeader={true}
    />
  );
};
