import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
import { GradientButton, lessThanDate } from "@acuteinfo/common-base";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment, useState, useRef, useContext } from "react";
import { KeyboardDatePicker } from "@acuteinfo/common-base";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { theme2 } from "app/audit/theme";
import { greaterThanInclusiveDate, utilFunction } from "@acuteinfo/common-base";
import { format } from "date-fns/esm";
import { TextField } from "@acuteinfo/common-base";
import { isValid } from "date-fns";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
const themeObj = unstable_createMuiStrictModeTheme(theme2);
export const DateRetrievalDialog = ({
  classes,
  open,
  handleClose,
  loginState,
  retrievalParaValues,
  defaultData,
}) => {
  const { authState } = useContext(AuthContext);
  const inputButtonRef = useRef<any>(null);
  const [selectedFromDate, setFromDate] = useState(
    defaultData?.A_FROM_DT ? new Date(defaultData?.A_FROM_DT) : new Date() // Default to today's date if undefined
  );
  const [selectedToDate, setToDate] = useState(
    defaultData?.A_TO_DT ? new Date(defaultData?.A_TO_DT) : new Date() // Default to today's date if undefined
  );
  const [error, SetError] = useState({ isError: false, error: "" });
  const [fromerror, SetFromError] = useState({ isError: false, error: "" });
  const onFromDateChange = (date) => {
    if (lessThanDate(date, new Date(authState?.minDate))) {
      SetFromError({
        isError: true,
        error: t("DateOutOfPeriod"),
      });
      return;
    }
    if (utilFunction.isValidDate(date)) {
      date = new Date(format(date, "yyyy/MM/dd"));
      setFromDate(date);
      if (!greaterThanInclusiveDate(selectedToDate, date)) {
        SetFromError({
          isError: true,
          error: "From Date should be less than or equal to To Date.",
        });
      } else {
        SetFromError({
          isError: false,
          error: "",
        });
        SetError({
          isError: false,
          error: "",
        });
      }
    } else if (!date) {
      SetFromError({
        isError: true,
        error: "This Field is Required",
      });
      return;
    } else if (!isValid(date)) {
      SetFromError({
        isError: true,
        error: "Must be a valid date",
      });
      return;
    }
  };

  const onToDateChange = (date) => {
    if (lessThanDate(date, new Date(authState?.minDate))) {
      SetError({
        isError: true,
        error: t("DateOutOfPeriod"),
      });
      return;
    }
    if (utilFunction.isValidDate(date)) {
      date = new Date(format(date, "yyyy/MM/dd"));
      setToDate(date);
      if (!greaterThanInclusiveDate(date, selectedFromDate)) {
        SetError({
          isError: true,
          error: "To Date should be greater than or equal to From Date.",
        });
      } else {
        SetError({
          isError: false,
          error: "",
        });
        SetFromError({
          isError: false,
          error: "",
        });
      }
    } else if (!date) {
      SetError({
        isError: true,
        error: "This Field is Required",
      });
      return;
    } else if (!isValid(date)) {
      SetError({
        isError: true,
        error: "Must be a valid date",
      });
      return;
    }
  };
  const onFocusSelectDate = (date) => {
    date.target.select();
  };

  return (
    <Fragment>
      <Dialog open={open} maxWidth="xs" sx={{ marginBottom: "12rem" }}>
        <DialogTitle>Enter Retrieval Parameters</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Please Verify OTP</DialogContentText> */}
          <div
            className={classes.divflex}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                inputButtonRef?.current?.click?.();
              }
            }}
          >
            <ThemeProvider theme={themeObj}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={{ display: "flex", gap: "1.25rem" }}>
                  <KeyboardDatePicker
                    format="dd/MM/yyyy"
                    label="From Date"
                    onChange={onFromDateChange}
                    value={selectedFromDate}
                    disableFuture
                    slots={{
                      textField: TextField,
                    }}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        placeholder: "DD/MM/YYYY",
                        error: fromerror.isError,
                        helperText: fromerror.error,
                        onFocus: onFocusSelectDate,
                        InputLabelProps: { shrink: true },
                        autoComplete: "off",
                        "aria-label": "Select Date",
                      },
                      actionBar: {
                        actions: ["today", "accept", "cancel"],
                      },
                    }}
                  />

                  <KeyboardDatePicker
                    format="dd/MM/yyyy"
                    label="To Date"
                    onChange={onToDateChange}
                    minDate={selectedFromDate}
                    value={selectedToDate}
                    slots={{
                      textField: TextField,
                    }}
                    slotProps={{
                      textField: {
                        onFocus: onFocusSelectDate,
                        variant: "standard",
                        error: error.isError,
                        helperText: error.error,
                        placeholder: "DD/MM/YYYY",
                        InputLabelProps: { shrink: true },
                        autoComplete: "off",
                        "aria-label": "Select Date",
                      },
                      actionBar: {
                        actions: ["today", "accept", "cancel"],
                      },
                    }}
                  />
                </div>
              </LocalizationProvider>
            </ThemeProvider>
          </div>
        </DialogContent>
        <Grid item container justifyContent="center" alignItems="center">
          <DialogActions className={classes.verifybutton}>
            <GradientButton
              disabled={
                loginState.loading || fromerror.isError || error.isError
              }
              endIcon={
                loginState.loading ? <CircularProgress size={20} /> : null
              }
              onClick={() => {
                if (
                  !greaterThanInclusiveDate(selectedToDate, selectedFromDate)
                ) {
                  SetError({
                    isError: true,
                    error: "To date should be greater than From date.",
                  });
                } else {
                  let retrievalValues = [
                    {
                      id: "A_FROM_DT",
                      value: {
                        condition: "equal",
                        value: format(
                          new Date(
                            selectedFromDate.toISOString() ?? new Date()
                          ),
                          "dd-MMM-yyyy"
                        ),
                        columnName: "From Date",
                      },
                    },
                    {
                      id: "A_TO_DT",
                      value: {
                        condition: "equal",
                        value: format(
                          new Date(selectedToDate.toISOString() ?? new Date()),
                          "dd-MMM-yyyy"
                        ),
                        columnName: "To Date",
                      },
                    },
                  ];
                  retrievalParaValues(retrievalValues, {
                    A_FROM_DT: selectedFromDate,
                    A_TO_DT: selectedToDate,
                  });
                }
              }}
              ref={inputButtonRef}
              style={{ marginTop: "15px" }}
            >
              Ok
            </GradientButton>
            <GradientButton
              disabled={loginState.loading}
              onClick={handleClose}
              style={{ marginTop: "15px" }}
            >
              Cancel
            </GradientButton>
          </DialogActions>
        </Grid>
      </Dialog>
    </Fragment>
  );
};
