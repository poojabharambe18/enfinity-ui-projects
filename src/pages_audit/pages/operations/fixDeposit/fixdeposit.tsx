import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { Fragment, useContext, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { GradientButton } from "@acuteinfo/common-base";
import { DetailForm } from "./fdParameters";
import { FixDepositDetailForm } from "./fixDepositDetail";
import { TransferAcctDetailForm } from "./trnAccountDetail";
import { FixDepositContext } from "./fixDepositContext";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { cloneDeep } from "lodash";

import {
  usePopupContext,
  SubmitFnType,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 30,
  height: 30,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "var(--theme-color5)",
    // "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: "var(--theme-color5)",
    // "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
    left: "calc(-50% + 10px)",
    // right: "calc(-50% + 10px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "var(--theme-color5)",
      // "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "var(--theme-color5)",
      // "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

export const FixDepositForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    fdState,
    setActiveStep,
    updateFDAccountsFormData,
    updateFDParaDataOnChange,
    updateFDDetailsFormData,
    updateTransDetailsFormData,
    resetAllData,
    setIsBackButton,
  } = useContext(FixDepositContext);
  const submitEventRef = useRef(null);
  const { MessageBox } = usePopupContext();

  const [steps, setSteps] = useState([
    "FD Parameters",
    "Fixed Deposit Detail(s)",
    "Source A/C Detail(s)",
  ]);
  const fdParameterformRef: any = useRef(null);
  const fdDetailsformRef: any = useRef(null);
  const sourceAcctformRef: any = useRef(null);

  const validFDAccounts = useMutation(API.valiateFDAccounts, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: (data) => {
      if (data?.[0]?.RESTRICT === "Y") {
      } else {
        updateFDDetailsFormData({ FDDTL: data?.[0]?.FD_ACCOUNTS });
        setActiveStep(fdState.activeStep + 1);
      }
    },
  });

  const doFixDepositMutation = useMutation(API.doFixDepositCreation, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      MessageBox({ messageTitle: "Error", message: errorMsg, icon: "ERROR" });
    },
    onSuccess: (data) => {
      MessageBox({ messageTitle: "Success", message: data, icon: "SUCCESS" });
      resetAllData();
    },
  });

  const setDataOnFieldChange = (action, payload) => {
    updateFDParaDataOnChange({ [action]: payload });
    if (
      (action === "FD_TYPE" && payload === "E") ||
      (action === "TRAN_MODE" && fdState?.fdParaFormData?.FD_TYPE === "E")
    ) {
      if (action === "TRAN_MODE" && payload === "1") {
        setSteps(["FD Parameters", "Fixed Deposit Detail(s)"]);
      } else {
        setSteps([
          "FD Parameters",
          "Fixed Deposit Detail(s)",
          "Source A/C Detail(s)",
        ]);
      }
    }
  };

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    const fdType = fdState?.fdParaFormData?.FD_TYPE;
    // Object mapping step numbers to corresponding icons
    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: fdType === "F" ? <PersonAddIcon /> : <GroupAddIcon />,
      3: <VideoLabelIcon />,
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

  const paraOnSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    // Filter FDACCTS where FD amount is greater than zero
    let filteredFDACCTS = cloneDeep(data).FDACCTS.filter(
      (acct) =>
        Boolean(acct.ACCT_CD) &&
        parseFloat(acct.FD_AMOUNT) > 0 &&
        parseInt(acct.FD_UNIT) > 0
    );
    if (Array.isArray(filteredFDACCTS) && filteredFDACCTS?.length > 0) {
      updateFDAccountsFormData(data);
      filteredFDACCTS = filteredFDACCTS.map((obj) => {
        delete obj.ACCOUNT_LIST;
        return obj;
      });
      validFDAccounts.mutate({
        CUSTOMER_ID: fdState?.fdParaFormData?.CUSTOMER_ID ?? "",
        TRAN_MODE: fdState?.fdParaFormData?.TRAN_MODE ?? "",
        FD_ACCOUNTS: filteredFDACCTS,
      });
    } else {
      enqueueSnackbar(
        "At least one row is required with the Account Number and New FD Amount.",
        {
          variant: "error",
        }
      );
    }
  };

  const handleComplete = (e) => {
    submitEventRef.current = e;
    if (fdState.activeStep === 0) {
      fdParameterformRef.current?.handleSubmit(e);
    } else if (
      fdState.activeStep === 1 &&
      fdState?.fdParaFormData?.FD_TYPE === "E"
    ) {
      fdDetailsformRef.current?.handleSubmit(e);
    } else if (
      fdState.activeStep === 2 &&
      fdState?.fdParaFormData?.FD_TYPE === "E"
    ) {
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
    if (parseFloat(data?.TOTAL_AMOUNT) < 0) {
      MessageBox({
        messageTitle: "Validation Failed",
        message: "Total Debit amount can not be greater than Total FD Amount.",
        icon: "ERROR",
      });
    } else if (parseFloat(data?.TOTAL_AMOUNT) > 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message:
          "Debit Amount less than Total FD Amount.\nAre you sure to add new row?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
      });
      if (buttonName === "Yes") {
        // const lastRow = data?.TRNDTLS[data?.TRNDTLS?.length - 1];
        updateTransDetailsFormData([...data?.TRNDTLS, { ACCT_NAME: "" }]);
      }
    } else if (parseFloat(data?.TOTAL_AMOUNT) === 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: "Are you sure create FD?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
      });
      if (buttonName === "Yes") {
        doFixDepositMutation.mutate({
          ...fdState?.fdParaFormData,
          FD_ACCOUNTS: fdState?.fdDetailFormData?.FDDTL ?? [],
          DR_ACCOUNTS: data?.TRNDTLS ?? [],
        });
      }
    }
  };
  return (
    <Fragment>
      <AppBar position="relative" style={{ marginBottom: "5px" }}>
        <Toolbar
          variant="dense"
          style={{ background: "var(--theme-color5)", padding: "0px" }}
        >
          <Typography component="span" variant="h5" color="primary" px={2}>
            {"Fix Deposit Entry (EMST/401)"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={fdState.activeStep}
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
        <div style={{ marginTop: "0px" }}>
          {/* {RenderStepForm(fdState.activeStep)} */}
          {fdState.activeStep === 0 ? (
            <DetailForm
              onSubmitHandler={paraOnSubmitHandler}
              setDataOnFieldChange={(action, payload) =>
                setDataOnFieldChange(action, payload)
              }
              submitEventRef={submitEventRef}
              ref={fdParameterformRef}
            />
          ) : fdState.activeStep === 1 ? (
            <FixDepositDetailForm
              doFixDepositMutation={doFixDepositMutation}
              ref={fdDetailsformRef}
            />
          ) : fdState.activeStep === 2 ? (
            <TransferAcctDetailForm
              onSubmitHandler={finalOnSubmitHandler}
              setDataOnFieldChange={(action, payload) => {
                sourceAcctformRef.current?.handleSubmit({
                  preventDefault: () => {},
                });
              }}
              ref={sourceAcctformRef}
            />
          ) : (
            <></>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            marginTop: "0px !important",
            position: "relative",
          }}
        >
          {/* <Box sx={{ flex: "1 1 auto" }} /> */}
          <div style={{ position: "fixed", bottom: 0, right: "10px" }}>
            {fdState.activeStep === 0 ? null : (
              <GradientButton
                onClick={() => {
                  setIsBackButton(true);
                  setActiveStep(fdState.activeStep - 1);
                }}
              >
                Back
              </GradientButton>
            )}
            {
              fdState.activeStep !== steps.length && (
                <>
                  {fdState.activeStep !== steps.length - 1 ? (
                    <GradientButton
                      onClick={handleComplete}
                      endIcon={
                        validFDAccounts?.isLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                      disabled={validFDAccounts?.isLoading}
                    >
                      Next
                    </GradientButton>
                  ) : (
                    <GradientButton
                      onClick={handleComplete}
                      endIcon={
                        doFixDepositMutation?.isLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                      disabled={doFixDepositMutation?.isLoading}
                    >
                      Finish
                    </GradientButton>
                  )}
                </>
              )
              // ))
            }
          </div>
        </Box>
      </Stack>
    </Fragment>
  );
};
