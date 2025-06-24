import React, { useEffect } from "react";
import { CtsOutwardColumn } from "../ctsOutwardColumn";
import { inwardReturnColumn } from "../inwardReturnColumn";
import { displayNumber } from "@acuteinfo/common-base";

const useCtsOutward = ({
  gridApi,
  formState,
  authState,
  setOpenAddBankForm,
  setBankData,
  defaultView,
  data,
  getOutwardClearingData,
  setCurrentRowIndex,
  zoneTranType,
}) => {
  const updatePinnedBottomRow = async () => {
    if (!gridApi) return;
    const formdata = await formState.current?.getFieldData();
    let totalAmount = 0;
    let totalSlipAmount = parseFloat(formdata?.AMOUNT ?? 0);

    gridApi.current.forEachNode((node) => {
      totalAmount += parseFloat(node.data?.AMOUNT ?? 0);
    });

    const totalPendingAmount = totalSlipAmount - totalAmount;

    gridApi.current.setGridOption("pinnedBottomRowData", [
      {
        CHEQUE_NO: "Total",
        AMOUNT: displayNumber(totalAmount),
        CHEQUE_DATE: displayNumber(totalPendingAmount),
      },
    ]);
  };

  const agGridProps = {
    id: "lien-entry-table",
    columnDefs:
      zoneTranType === "S"
        ? CtsOutwardColumn.columns(
            formState,
            authState,
            setOpenAddBankForm,
            setBankData,
            setCurrentRowIndex,
            defaultView
          )
        : inwardReturnColumn.columns(
            formState,
            authState,
            setOpenAddBankForm,
            setBankData,
            setCurrentRowIndex,
            defaultView
          ),
    rowData:
      (defaultView === "new"
        ? data?.map((item) => ({
            ...item,
            TRAN_DT: data?.[0]?.TRAN_DATE ?? "",
            RANGE_DT: data?.[0]?.RANGE_FROM_DT ?? "",
            CHQ_MICR_VISIBLE: data?.[0]?.CHQ_MICR_VISIBLE ?? "",
            PAYEE_AC_MANDATORY: data?.[0]?.PAYEE_AC_MANDATORY ?? "",
            CHQ_MICR_CD: 10,
          }))
        : getOutwardClearingData.data?.[0]?.CHEQUE_DETAIL) ||
      getOutwardClearingData?.[0]?.CHEQUE_DETAIL ||
      "",
    // pinnedBottomRowData: [],
    onCellValueChanged: updatePinnedBottomRow,
  };

  const handleAddNewRow = () => {
    gridApi.current.applyTransaction({
      add: data?.map((item) => ({
        ...item,
        TRAN_DT: data?.[0]?.TRAN_DATE ?? "",
        RANGE_DT: data?.[0]?.RANGE_FROM_DT ?? "",
        CHQ_MICR_VISIBLE: data?.[0]?.CHQ_MICR_VISIBLE ?? "",
        PAYEE_AC_MANDATORY: data?.[0]?.PAYEE_AC_MANDATORY ?? "",
        CHQ_MICR_CD: 10,
      })),
    });
  };
  useEffect(() => {
    if (gridApi.current && formState.current) {
      updatePinnedBottomRow();
    }
  }, [gridApi, formState]);

  return {
    updatePinnedBottomRow,
    agGridProps,
    handleAddNewRow,
  };
};

export default useCtsOutward;
