import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useMutation } from "react-query";
import * as API from "../api";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { FDContext } from "../context/fdContext";
import { FDDetailForm } from "./fdDetailForm";
import { TransferAcctDetailForm } from "./trnsAcctDtlForm";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import {
  ColorlibConnector,
  ColorlibStepIconRoot,
  GradientButton,
  usePopupContext,
  utilFunction,
  SubmitFnType,
  lessThanDate,
} from "@acuteinfo/common-base";
import { format } from "date-fns";
import CommonSvgIcons from "assets/icons/commonSvg/commonSvgIcons";
import { getdocCD } from "components/utilFunction/function";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  formHeaderTitle: {
    margin: "0",
    fontWeight: "500",
    fontSize: "1.25rem",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
    color: "var(--theme-color2)",
  },
}));

type FixDepositFormProps = {
  defaultView?: string;
  handleDialogClose?: any;
  isDataChangedRef?: any;
  openNewFdForScheme?: boolean;
};

export const FixDepositForm: React.FC<FixDepositFormProps> = ({
  defaultView,
  handleDialogClose,
  isDataChangedRef,
  openNewFdForScheme,
}) => {
  const { t } = useTranslation();
  const {
    FDState,
    setActiveStep,
    updateSourceAcctFormData,
    setIsBackButton,
    updateFDDetailArrayFGridData,
  } = useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  let currentPath = useLocation().pathname;
  const [steps, setSteps] = useState([
    t("FixedDepositDetails"),
    t("SourceACDetails"),
  ]);
  const fdDetailsformRef = useRef<any>(null);
  const sourceAcctformRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const headerClasses = useTypeStyles();
  const docCD = getdocCD(currentPath, authState?.menulistdata);
  const fdDetailArrayFGridDataRef = useRef<any>([]);
  const [isMultipleFD, setIsMultipleFD] = useState<boolean>(false);

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    // Object mapping step numbers to corresponding icons
    const icons: { [index: string]: React.ReactElement } = {
      1: <CommonSvgIcons iconName={"LIEN"} />,
      2: <CommonSvgIcons iconName={"ACHOW"} />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  //Mutation for Save new FD details
  const saveFDDetailsMutation = useMutation(API.saveFDDetails, {
    onError: async (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        messageTitle: "Error",
        message: errorMsg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      for (const response of data ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
            icon: "CONFIRM",
          });
          if (buttonName === "No") {
            break;
          }
        } else if (response?.O_STATUS === "0") {
          isDataChangedRef.current = true;
          CloseMessageBox();
          handleDialogClose();
        }
      }
    },
  });

  //Mutation for Validate new FD details
  const validateFDDetailsMutation = useMutation(API.validateFDDetails, {
    onError: async (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        messageTitle: "Error",
        message: errorMsg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      for (const response of data ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
            icon: "CONFIRM",
          });
          if (buttonName === "No") {
            break;
          }
        } else if (response?.O_STATUS === "0") {
          setActiveStep(FDState.activeStep + 1);
        }
      }
    },
  });
  // Detail form validate handler for new entry
  const detailsFormSubmitHandlerArrayField = async () => {
    if (isMultipleFD) {
      const newData = fdDetailArrayFGridDataRef?.current?.map((obj) => ({
        ...obj,
        TRAN_DT: obj.TRAN_DT
          ? format(new Date(obj.TRAN_DT), "dd/MMM/yyyy")
          : "",
        MATURITY_DT: obj.MATURITY_DT
          ? format(new Date(obj.MATURITY_DT), "dd/MMM/yyyy")
          : "",
      }));

      const totalAmount = newData.reduce((accum, obj) => {
        const cashAmt = Number(obj?.CASH_AMT ?? 0);
        const trsfAmt = Number(obj?.TRSF_AMT ?? 0);
        return accum + cashAmt + trsfAmt;
      }, 0);

      if (Boolean(newData?.length)) {
        updateFDDetailArrayFGridData(newData);
        updateSourceAcctFormData([
          {
            ACCT_NAME: "",
          },
        ]);
        const dataArray = Array.isArray(fdDetailArrayFGridDataRef?.current)
          ? fdDetailArrayFGridDataRef?.current
          : [];
        if (dataArray?.length > 0) {
          if (!Boolean(totalAmount) || parseFloat(totalAmount ?? 0) <= 0) {
            MessageBox({
              messageTitle: t("ValidationFailed"),
              message: "TotalAmountCantbeZeroNegative",
              icon: "ERROR",
            });
          } else {
            await validateFDDetailsMutation.mutate({
              FD_DETAIL_DATA: [...newData],
              SCREEN_REF: docCD ?? "",
            });
          }
        }
      } else {
        MessageBox({
          messageTitle: "ValidationFailed",
          message: "AtLeastOneRowRequired",
          icon: "ERROR",
        });
      }
    } else {
      const formData = await fdDetailsformRef?.current?.getFieldData();
      if (formData) {
        const requiredFields = [
          { field: "BRANCH_CD" },
          { field: "ACCT_TYPE" },
          { field: "ACCT_CD" },
          { field: "TRAN_DT" },
          { field: "PERIOD_CD" },
          { field: "PERIOD_NO" },
          { field: "INT_RATE" },
          { field: "TERM_CD" },
          { field: "MATURITY_AMT" },
        ];

        // Check for missing or empty required fields
        for (const { field } of requiredFields) {
          const value = formData?.[field];
          if (value === undefined || value === null || value === "") {
            return;
          }
        }
        if (
          lessThanDate(
            new Date(authState?.workingDate),
            new Date(formData?.TRAN_DT),
            {
              ignoreTime: true,
            }
          ) ||
          Number(formData.MATURITY_AMT?.trim()) <= 0
        ) {
          return;
        }

        // Array of keys to remove
        const keysToRemove = ["CANCEL", "UPDATE", "ADDNEWROW"];
        keysToRemove.forEach((key) => {
          delete formData[key];
        });

        const finalData = [
          {
            ...formData,
            TRAN_DT: formData.TRAN_DT
              ? format(new Date(formData.TRAN_DT), "dd/MMM/yyyy")
              : "",
            MATURITY_DT: formData.MATURITY_DT
              ? format(new Date(formData.MATURITY_DT), "dd/MMM/yyyy")
              : "",
          },
        ];

        updateFDDetailArrayFGridData(finalData);
        await validateFDDetailsMutation.mutate({
          FD_DETAIL_DATA: finalData,
          SCREEN_REF: docCD ?? "",
        });
      }
    }
  };

  const handleComplete = (e) => {
    if (FDState.activeStep === 0) {
      detailsFormSubmitHandlerArrayField();
    } else if (FDState.activeStep === 1) {
      sourceAcctformRef.current?.handleSubmit(e);
    }
  };

  const finalOnSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);

    let newData = data?.TRNDTLS?.map((obj) => ({
      ...obj,
      CHEQUE_DT: obj.CHEQUE_DATE
        ? format(new Date(obj.CHEQUE_DATE), "dd/MMM/yyyy")
        : "",
    }));

    newData = newData.map((obj) => {
      delete obj.CHEQUE_DATE;
      return obj;
    });

    if (parseFloat(data?.TOTAL_DR_AMOUNT) <= 0) {
      MessageBox({
        messageTitle: "ValidationFailed",
        message: "TotalDebitAmountCantBeZeroNegative",
        icon: "ERROR",
      });
    } else if (
      parseFloat(data?.TOTAL_DR_AMOUNT) !== parseFloat(data?.TOTAL_FD_AMOUNT)
    ) {
      MessageBox({
        messageTitle: "ValidationFailed",
        message: "TotalDebitAmountShouldBeEqualToTotalFDAmount",
        icon: "ERROR",
      });
    } else if (parseFloat(data?.DIFF_AMOUNT) === 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: "Proceed?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        loadingBtnName: ["Yes"],
        icon: "CONFIRM",
      });

      const fdDetailData = FDState?.fdDetailArrayFGridData || [];
      const reorderedData = [...fdDetailData].sort((a, b) => {
        if (a.cd && !b.cd) return 1;
        if (!a.cd && b.cd) return -1;
        return 0;
      });

      if (buttonName === "Yes") {
        saveFDDetailsMutation.mutate({
          TRANSACTION_DTL: [...newData],
          FD_DETAIL_DATA: reorderedData,
          SCREEN_REF: docCD ?? "",
        });
      }
    }
  };
  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "hidden",
            position: "relative",
            padding: "0 10px 10px 10px",
            height: "auto",
            maxHeight: "100%",
          },
        }}
        maxWidth="xl"
        onKeyUp={(event) => {
          if (event.key === "Escape") {
            handleDialogClose();
          }
        }}
        className="fdCommDlg"
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            minHeight: "118px",
            zIndex: 1,
            overflow: "hidden",
            borderBottom: "2px solid var(--theme-color4)",
            paddingBottom: "6px",
          }}
        >
          <AppBar
            className="form__header"
            style={{ marginBottom: "22px", position: "relative" }}
          >
            <Toolbar variant="dense" className={headerClasses.root}>
              <Typography
                component="span"
                variant="h5"
                className={headerClasses.title}
              >
                {`${utilFunction.getDynamicLabel(
                  currentPath,
                  authState?.menulistdata,
                  true
                )} of A/c No.: ${
                  FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
                }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
                  FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
                } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`}
              </Typography>
              <GradientButton onClick={handleDialogClose}>
                {t("Close")}
              </GradientButton>
            </Toolbar>
          </AppBar>
          <Stack sx={{ width: "100%", position: "relative" }} spacing={4} />
          <Stepper
            alternativeLabel
            activeStep={FDState.activeStep}
            connector={<ColorlibConnector />}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  StepIconComponent={ColorlibStepIcon}
                  componentsProps={{
                    label: {
                      style: { marginTop: "2px", color: "var(--theme-color1)" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <div
          style={{
            marginTop: "0px",
            overflowY: "auto",
            maxHeight: "calc(90vh - 150px)",
            borderBottom: "2px solid var(--theme-color4)",
            overflow: "hidden",
          }}
        >
          {FDState.activeStep === 0 ? (
            <FDDetailForm
              ref={fdDetailsformRef}
              defaultView={defaultView}
              openNewFdForScheme={openNewFdForScheme}
              fdDetailArrayFGridDataRef={fdDetailArrayFGridDataRef}
              setIsMultipleFD={setIsMultipleFD}
              isMultipleFD={isMultipleFD}
            />
          ) : FDState.activeStep === 1 ? (
            <TransferAcctDetailForm
              onSubmitHandler={finalOnSubmitHandler}
              ref={sourceAcctformRef}
            />
          ) : (
            <></>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            margin: "0px !important",
            paddingTop: "10px",
          }}
        >
          {FDState?.activeStep !== steps.length && (
            <>
              {FDState?.activeStep !== steps.length - 1 ? (
                <GradientButton
                  onClick={handleComplete}
                  endIcon={
                    validateFDDetailsMutation?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  disabled={validateFDDetailsMutation?.isLoading}
                  color={"primary"}
                >
                  {t("Next")}
                </GradientButton>
              ) : (
                <GradientButton onClick={handleComplete}>
                  {t("Finish")}
                </GradientButton>
              )}
            </>
          )}
          {FDState?.activeStep === 0 ? null : (
            <GradientButton
              onClick={() => {
                setIsBackButton(true);
                setActiveStep(FDState?.activeStep - 1);
              }}
            >
              {t("Back")}
            </GradientButton>
          )}
        </Box>
      </Dialog>
    </>
  );
};
