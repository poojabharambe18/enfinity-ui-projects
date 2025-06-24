import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { dynamicRowHeight } from "../utils/helper";
import ErrorComponent from "./ErrorComponent";
import {
  formatCurrency,
  getCurrencySymbol,
  usePropertiesConfigContext,
} from "@acuteinfo/common-base";
import { CircularProgress } from "@mui/material";

const DisplayCurrencyCell = (params) => {
  const { dynamicAmountSymbol, decimalCount, currencyFormat } =
    usePropertiesConfigContext();

  const formatedValue = formatCurrency(
    isNaN(params.value) ? 0 : parseFloat(params.value || "0"),
    getCurrencySymbol(dynamicAmountSymbol),
    currencyFormat,
    decimalCount
  );
  const isEditable =
    typeof params.colDef.editable === "function"
      ? params.colDef.editable(params)
      : params.colDef.editable;

  useEffect(() => {
    if (params.eGridCell) {
      params.eGridCell.style.backgroundColor = isEditable
        ? "transparent"
        : "var(--theme-color7)";
    }
  }, [isEditable, params.eGridCell]);
  if (params.node?.rowPinned) return params.value ?? null;

  //* Extract errors for Cell
  const errors = params.node?.data?.errors || [];
  const fieldError = errors.find((err) => err.field === params.colDef.field);

  //* Extract loader state for cell
  const loaderArray = params.node.data?.loader || [];

  const loadingField = loaderArray?.find(
    (err) => err.field === params.colDef.field
  );

  //* dynamically Change row height based on errors
  if (errors) dynamicRowHeight(errors, params);

  //* Hide cell content
  const isCellVisible =
    typeof params?.colDef?.shouldExclude === "function"
      ? params?.colDef?.shouldExclude(params)
      : false;

  return !isCellVisible ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        {params.value || !isEmpty(fieldError?.message) ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              className="cell-value"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: params.colDef?.alignment || "center",
                height: "100%",
                width: "100%",
              }}
            >
              <div
                title={params.value ? formatedValue : ""}
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  flexGrow: 1,
                }}
              >
                {params.value ? formatedValue : ""}
              </div>{" "}
              {loadingField?.loader && params.value ? (
                <CircularProgress
                  size={20}
                  color="secondary"
                  style={{ marginLeft: 1, marginTop: 6 }}
                />
              ) : null}
            </div>
            {!isEmpty(fieldError?.message) && (
              <ErrorComponent fieldError={fieldError} value={params.value} />
            )}
          </div>
        ) : (
          <span className="cell-placeholder">₹0.00</span>
        )}
      </span>
    </div>
  ) : null;
};

export default DisplayCurrencyCell;
