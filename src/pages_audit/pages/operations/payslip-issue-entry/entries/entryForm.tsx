import {
  Alert,
  ClearCacheProvider,
  extractGridMetaData,
  extractMetaData,
  FormWrapper,
  GradientButton,
  LoadingTextAnimation,
  MetaDataType,
  queryClient,
  RemarksAPIWrapper,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import {
  AppBar,
  CircularProgress,
  Dialog,
  Paper,
  Toolbar,
  Typography,
  Theme,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ddTransactionFormMetaData } from "./metaData";
import { useLocation } from "react-router-dom";
import { commonDataRetrive, getVoucherList, headerDataRetrive } from "../api";
import { Mutation, useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import i18n from "components/multiLanguage/languagesConfiguration";
import { PayslipAndDDForm } from "../../recurringPaymentEntry/payslipAndNEFT/payslipAndDDForm";
import { DraftdetailsFormMetaData } from "../paySlipMetadata";
import { revalidateDDform } from "./generateDDFormmetaData";
import { makeStyles } from "@mui/styles";

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

const EntryFormView = ({
  onClose,
  currentIndex,
  handlePrev,
  handleNext,
  rowsData,
  headerLabel,
  screenFlag,
  trans_type,
  apiReqFlag,
  totalData,
  defaultView,
}) => {
  const [formMode, setFormMode] = useState(defaultView);
  const [openNewDDForm, setopenNewDDForm] = useState(false);
  const [isDeleteRemark, SetDeleteRemark] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const formRef = useRef<any>(null);
  const ddformRef = useRef<any>(null);
  const draftReqPara = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: rowsData?.TRAN_CD,
    SR_CD: rowsData?.SR_CD,
  };
  useEffect(() => {
    if (screenFlag === "CANCELCONFRM") {
      setFormMode("edit");
    } else if (
      rowsData?.RETRIVE_ENTRY_MODE === "E" ||
      rowsData?.RETRIVE_ENTRY_MODE === "D" ||
      rowsData?.RETRIVE_ENTRY_MODE === "S"
    ) {
      setFormMode("new");
    }
  }, [screenFlag]);
  const {
    data: acctDtlData,
    isLoading: isAcctDtlLoading,
    error: AcctDtlError,
    isError: IsAcctDtlError,
  } = useQuery(["headerData", requestData], () =>
    headerDataRetrive(requestData)
  );

  const {
    data: reasonData,
    isLoading: isReasonDataLoading,
    error: DraftDtlError,
    isError: IsDraftDtlError,
  } = useQuery(["getReasonData", requestData], () =>
    API.getReasonData(requestData)
  );

  const {
    data: draftDtlData,
    isLoading: isdraftDtlLoading,
    error: DraftDtlDataError,
    isError: IsDraftDtlDataError,
  } = useQuery(["draftdata", requestData], () =>
    API.getRealizedHeaderData(requestData)
  );

  const {
    data: stopPaymentHistory,
    isLoading: stopPaymentLoading,
    error: StopPaymentHistoryError,
    isError: IsStopPaymentHistoryError,
  } = useQuery(
    ["getPayslipStopPaymentHistory", {}],
    () =>
      API.getPayslipStopPaymentHistory({
        ENTERED_COMP_CD: draftDtlData[0]?.ENTERED_COMP_CD,
        ENTERED_BRANCH_CD: draftDtlData[0]?.ENTERED_BRANCH_CD,
        TRAN_CD: rowsData.TRAN_CD,
      }),
    {
      enabled: !isdraftDtlLoading,
    }
  );

  ddTransactionFormMetaData.form.label = headerLabel;
  const voucherMutation = useMutation(getVoucherList, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        message: error?.error_detail,
        messageTitle: "error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      isErrorFuncRef.current?.endSubmit(false);
    },
    onSuccess: async (data: any) => {
      if (data[0]?.VOUCHER_MSG === "") {
        return;
      } else {
        const btnName = await MessageBox({
          message: data[0]?.VOUCHER_MSG,
          icon: "INFO",
          messageTitle: "Vouchers Confirmation",
          buttonNames: ["Ok"],
        });
      }
      CloseMessageBox();
    },
  });
  revalidateDDform.form.label = "Payslip & Demand Draft";
  const {
    data: cancelChargeData,
    isLoading: IScanclChrgDtlLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getPayslipCancelCharge"],
    () =>
      API.getPayslipCancelCharge({
        A_COMP_CD: authState?.companyID ?? "",
        A_BRANCH_CD: authState?.user?.branchCode ?? "",
        A_ACCT_TYPE: acctDtlData[0]?.ACCT_TYPE ?? "",
        A_ACCT_CD: acctDtlData[0]?.ACCT_CD ?? "",
        A_AMOUNT: rowsData?.AMOUNT ?? "",
        A_ENT_BRANCH: rowsData?.ENTERED_BRANCH_CD ?? "",
        A_BASE_BRANCH_CD: authState?.user?.baseBranchCode ?? "",
        A_TRAN_TYPE: trans_type ?? "",
        A_GD_DATE: authState?.workingDate ?? "",
        A_USER: authState?.user?.id ?? "",
        A_USER_LEVEL: authState?.role ?? "",
        A_SCREEN_REF: apiReqFlag ?? "",
        A_LANG: i18n.resolvedLanguage ?? "",
      }),
    {
      enabled: !isAcctDtlLoading,
    }
  );

  const mutation = useMutation(API.payslipRealizeEntrySave, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      const btnName = await MessageBox({
        message: `${errorMsg}`,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      if (btnName === "Ok") {
        onClose();
      }

      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("insertSuccessfully"), {
        variant: "success",
      });
      if (data[0]?.TRAN_CD) {
        voucherMutation.mutate({
          A_ENT_COMP_CD: authState?.companyID,
          A_ENT_BRANCH_CD: authState?.user?.branchCode,
          A_TRAN_DT: format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
          A_TRAN_CD: rowsData?.TRAN_CD,
          A_TRN_FLAG: "Y",
          A_SDC: "PSLP",
          A_SR_CD: rowsData?.SR_CD,
        });
      }
      CloseMessageBox();
      onClose();
    },
  });
  const confirmMutation = useMutation(API.DoddTransactionConfirmation, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_detail ?? errorMsg;
      }
      const btnName = await MessageBox({
        message: `${errorMsg}`,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      if (btnName === "Ok") {
        onClose();
      }

      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar("success", {
        variant: "success",
      });
      CloseMessageBox();
      onClose();
    },
  });

  const rejectMutaion = useMutation(
    "rejectMutaion",
    API.DoddTransactionConfirmation,
    {
      onSuccess: async (data) => {
        const responses = data || [];
        SetDeleteRemark(false);
        CloseMessageBox();

        for (const response of responses) {
          const status = response.O_STATUS;
          const message = response.O_MESSAGE;
          const title = response.O_MSG_TITLE;

          if (status === "999") {
            await MessageBox({
              messageTitle: title || "Validation Failed",
              message: message,
              icon: "ERROR",
            });

            break;
          } else if (status === "9") {
            await MessageBox({
              messageTitle: title || "Alert",
              message: message,
              icon: "WARNING",
            });
          } else if (status === "99") {
            const buttonName = await MessageBox({
              messageTitle: "Confirmation",
              message: message,
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
              icon: "CONFIRM",
            });
            if (buttonName === "No") {
              break;
            }
          } else if (status === "0") {
            enqueueSnackbar(message, {
              variant: "success",
            });
            onClose();
          }
        }
      },

      onError: async (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        const btnName = await MessageBox({
          message: `${errorMsg}`,
          messageTitle: "Error",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
        if (btnName === "Ok") {
          onClose();
        }

        CloseMessageBox();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    ddformRef.current = data;
    endSubmit(true);
    let buttonName = await MessageBox({
      messageTitle: t("Confirmatiopn"),
      message: t("AreYouSureToProceed"),
      icon: "CONFIRM",
      buttonNames: ["Yes", "No"],
      defFocusBtnName: "Yes",
      loadingBtnName: ["Yes"],
    });

    if (buttonName === "Yes") {
      if (
        trans_type === "TE" &&
        rowsData?.RETRIVE_ENTRY_MODE === "D" &&
        rowsData?.PARA_812 === "Y"
      ) {
        setopenNewDDForm(true);
        CloseMessageBox();
      } else {
        if (screenFlag === "REALIZEENTRY") {
          const newTransferAccountData = {
            TRF_COMP_CD: data?.TRF_COMP_CD_DISP,
            TRF_BRANCH_CD: data?.TRF_BRANCH_CD,
            TRF_ACCT_TYPE: data?.TRF_ACCT_TYPE,
            TRF_ACCT_CD: data?.TRF_ACCT_CD,
            // TRF_NAME: data?.TRF_NAME,
          };
          let newData = {
            COLLECT_COMISSION: data?.COLLECT_COMISSION,
            REALIZE_AMT: data?.REALIZE_AMT,
            C_C_T_SP_C: data?.C_C_T_SP_C,
            REALIZE_BRANCH_CD: authState?.user?.branchCode,
            REALIZE_COMP_CD: authState?.companyID,
            REALIZE_BY: authState?.user?.id,
            REALIZE_DATE:
              format(new Date(data?.REALIZE_DATE_DISP), "dd/MMM/yyyy") ?? "",
            PENDING_FLAG: "Y",
            ...(data?.C_C_T_SP_C !== "G" ? { CHEQUE_NO: data?.TOKEN_NO } : {}),
            ...(data?.C_C_T_SP_C === "T" ? newTransferAccountData : {}),
            ...(data.C_C_T_SP_C === "C" ? { PENDING_FLAG: "Y" } : {}),
            ...(rowsData?.PARA_243 === "Y"
              ? {
                  REALIZE_FLAG: "Y",
                }
              : {}),
          };

          const oldTransferAccountData = {
            TRF_COMP_CD: draftDtlData[0]?.TRF_COMP_CD,
            TRF_BRANCH_CD: draftDtlData[0]?.TRF_BRANCH_CD,
            TRF_ACCT_TYPE: draftDtlData[0]?.TRF_ACCT_TYPE,
            TRF_ACCT_CD: draftDtlData[0]?.TRF_ACCT_CD,
            // TRF_NAME: draftDtlData[0]?.TRF_NAME,
          };

          const oldData = {
            COLLECT_COMISSION: draftDtlData[0]?.COLLECT_COMISSION,
            REALIZE_AMT: draftDtlData[0]?.REALIZE_AMT,
            C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
            ...(draftDtlData?.C_C_T_SP_C !== "G"
              ? { CHEQUE_NO: draftDtlData[0]?.CHEQUE_NO }
              : {}),
            REALIZE_BY: draftDtlData[0]?.REALIZE_BY,
            // REALIZE_DATE_DISP: authState?.workingDate,
            REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
            REALIZE_BRANCH_CD: draftDtlData[0]?.REALIZE_BRANCH_CD,
            REALIZE_COMP_CD: draftDtlData[0]?.REALIZE_COMP_CD,
            PENDING_FLAG: draftDtlData[0]?.PENDING_FLAG,
            ...(data?.C_C_T_SP_C === "T" ? oldTransferAccountData : {}),
            ...(rowsData?.PARA_243 === "Y"
              ? {
                  REALIZE_FLAG: rowsData.REALIZE_FLAG,
                }
              : {}),
          };

          let upd = utilFunction.transformDetailsData(newData, oldData);
          isErrorFuncRef.current = {
            data: {
              ...newData,
              ...upd,
              ENTERED_COMP_CD: authState?.companyID,
              ENTERED_BRANCH_CD: authState?.user?.branchCode,
              TRAN_CD: rowsData?.TRAN_CD,
              SR_CD: rowsData?.SR_CD,
              TRAN_TYPE: trans_type,
              COL_SER_CHARGE: data.COL_SER_CHARGE,
            },
            displayData,
            endSubmit,
            setFieldError,
          };

          mutation.mutate({
            ...isErrorFuncRef.current?.data,
          });
        } else if (screenFlag === "CANCELENTRY") {
          const newTransferAccountData = {
            TRF_COMP_CD: data?.TRF_COMP_CD_DISP,
            TRF_BRANCH_CD: data?.TRF_BRANCH_CD,
            TRF_ACCT_TYPE: data?.TRF_ACCT_TYPE,
            TRF_ACCT_CD: data?.TRF_ACCT_CD,
          };
          const revalidatedDDObj = {
            ACCT_TYPE: acctDtlData[0]?.ACCT_TYPE,
            ACCT_CD: acctDtlData[0]?.ACCT_CD,
            COMM_TYPE_CD: draftDtlData[0]?.COMM_TYPE_CD,
            TOT_DD_NEFT_AMT: data?.TOTAL_AMOUNT,
            DD_NEFT_PAY_AMT: data?.PAYMENT_AMOUNT,
          };
          let newData = {
            COLLECT_COMISSION: data?.COLLECT_COMISSION,
            REALIZE_AMT: data?.REALIZE_AMT,
            C_C_T_SP_C: data?.C_C_T_SP_C,
            REALIZE_BRANCH_CD: authState?.user?.branchCode,
            REALIZE_COMP_CD: authState?.companyID,
            REALIZE_BY: authState?.user?.id,
            REALIZE_DATE:
              format(new Date(data?.REALIZE_DATE_DISP), "dd/MMM/yyyy") ?? "",
            PENDING_FLAG: "Y",
            ...(data?.C_C_T_SP_C !== "G" ? { CHEQUE_NO: data?.TOKEN_NO } : {}),
            ...(data?.C_C_T_SP_C === "T" ? newTransferAccountData : {}),
            ...(data.C_C_T_SP_C === "C" ? { PENDING_FLAG: "Y" } : {}),

            ...(rowsData?.PARA_243 === "Y"
              ? {
                  REALIZE_FLAG: "Y",
                }
              : {}),
          };

          const oldTransferAccountData = {
            TRF_COMP_CD: draftDtlData[0]?.TRF_COMP_CD,
            TRF_BRANCH_CD: draftDtlData[0]?.TRF_BRANCH_CD,
            TRF_ACCT_TYPE: draftDtlData[0]?.TRF_ACCT_TYPE,
            TRF_ACCT_CD: draftDtlData[0]?.TRF_ACCT_CD,
            // TRF_NAME: draftDtlData[0]?.TRF_NAME,
          };

          const oldData = {
            COLLECT_COMISSION: draftDtlData[0]?.COLLECT_COMISSION,
            REALIZE_AMT: draftDtlData[0]?.REALIZE_AMT,
            C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
            ...(draftDtlData?.C_C_T_SP_C !== "G"
              ? { CHEQUE_NO: draftDtlData[0]?.CHEQUE_NO }
              : {}),
            REALIZE_BY: draftDtlData[0]?.REALIZE_BY,
            // REALIZE_DATE_DISP: authState?.workingDate,
            REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
            REALIZE_BRANCH_CD: draftDtlData[0]?.REALIZE_BRANCH_CD,
            REALIZE_COMP_CD: draftDtlData[0]?.REALIZE_COMP_CD,
            PENDING_FLAG: draftDtlData[0]?.PENDING_FLAG,
            ...(data?.C_C_T_SP_C === "T" ? oldTransferAccountData : {}),
            ...(rowsData?.PARA_243 === "Y"
              ? {
                  REALIZE_FLAG: rowsData.REALIZE_FLAG,
                }
              : {}),
          };

          let upd = utilFunction.transformDetailsData(newData, oldData);

          isErrorFuncRef.current = {
            data: {
              ...newData,
              ...upd,
              ENTERED_COMP_CD: authState?.companyID,
              ENTERED_BRANCH_CD: authState?.user?.branchCode,
              TRAN_CD: rowsData?.TRAN_CD,
              PARA_812: rowsData?.PARA_812,
              PARA_243: rowsData?.PARA_243,
              TRAN_TYPE: trans_type,
              SR_CD: rowsData?.SR_CD,
              A_ENTRY_MODE: rowsData?.RETRIVE_ENTRY_MODE,
              COL_SER_CHARGE: data.COL_SER_CHARGE,
              PAY_SLIP_NEFT_DTL: [draftReqPara.current],
              DETAILS_DATA: {
                isNewRow: data.length > 0 ? data.CANCEL_REASON : [],
              },
              PAY_FOR: "",
              SDC: "",
              SCROLL1: "",
              THROUGH_CHANNEL: "",
              REQUEST_CD: "0",
              REMARKS: "",
              DD_NEFT: "DD",
              SCREEN_REF: apiReqFlag,
            },
            displayData,
            endSubmit,
            setFieldError,
          };

          mutation.mutate({
            ...isErrorFuncRef.current?.data,
          });
        } else if (screenFlag === "STOPPAYMENT") {
          let newData = {
            C_C_T_SP_C: data?.C_C_T_SP_C,
            STOP_PAY_DATE:
              format(new Date(data?.STOP_PAY_DATE), "dd/MMM/yyyy") ?? "",
            STOP_REMARKS: data?.STOP_REMARKS,
          };

          const oldData = {
            C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
            STOP_PAY_DATE: draftDtlData[0]?.STOP_PAY_DATE,
            STOP_REMARKS: draftDtlData[0]?.STOP_REMARKS,
          };

          let upd = utilFunction.transformDetailsData(newData, oldData);

          isErrorFuncRef.current = {
            data: {
              ...newData,
              ...upd,
              ENTERED_COMP_CD: authState?.companyID,
              ENTERED_BRANCH_CD: authState?.user?.branchCode,
              TRAN_TYPE: trans_type,

              TRAN_CD: rowsData?.TRAN_CD,
              SR_CD: rowsData?.SR_CD,
              STOP_PAY_DATE:
                format(new Date(data?.STOP_PAY_DATE), "dd/MMM/yyyy") ?? "",
              STOP_REMARKS: data?.STOP_REMARKS,
              DETAILS_DATA: {
                isNewRow: data.length > 0 ? data.CANCEL_REASON : [],
              },
            },
            displayData,
            endSubmit,
            setFieldError,
          };

          mutation.mutate({
            ...isErrorFuncRef.current?.data,
          });
        }
      }
    }
  };

  const errors: any = [
    // Queries
    { error: AcctDtlError, isError: IsAcctDtlError },
    { error: DraftDtlError, isError: IsDraftDtlError },
    { error: DraftDtlDataError, isError: IsDraftDtlDataError },
    { error: StopPaymentHistoryError, isError: IsStopPaymentHistoryError },
    { error: voucherMutation?.error, isError: voucherMutation?.isError },
    { error: rejectMutaion?.error, isError: rejectMutaion?.isError },
    { error: mutation?.error, isError: mutation?.isError },
    { error: confirmMutation?.error, isError: confirmMutation?.isError },
    { error: confirmMutation?.error, isError: confirmMutation?.isError },
  ];

  return (
    <>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            height: "auto",
            width: "100%",
          },
        }}
        maxWidth="xl"
      >
        {errors.map(
          ({ error, isError }, index) =>
            isError && (
              <Alert
                key={index}
                severity="error"
                errorMsg={error?.error_msg || t("Somethingwenttowrong")}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            )
        )}
        {!isAcctDtlLoading &&
        !isdraftDtlLoading &&
        !stopPaymentLoading &&
        !isReasonDataLoading &&
        !IScanclChrgDtlLoading ? (
          <>
            <FormWrapper
              key={"ddtransactionentrygrid" + formMode}
              metaData={
                extractMetaData(
                  ddTransactionFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={onSubmitHandler}
              formState={{
                MessageBox: MessageBox,
                Mode: formMode,
                docCd: "RPT/014",
                refID: formRef,
              }}
              initialValues={{
                SCREENFLAG: screenFlag,
                SCREEN_CODE: apiReqFlag,
                TRAN_TYPE: trans_type,
                CCTFLAG: draftDtlData?.length > 0 ? draftDtlData[0]?.C_C_T : "",
                REALIZE_AMT:
                  draftDtlData?.length > 0 ? draftDtlData[0]?.AMOUNT : "",
                REALIZE_DATE_DISP: authState?.workingDate,
                TOKEN_NO:
                  draftDtlData?.length > 0 ? draftDtlData[0]?.CHEQUE_NO : "",
                TRF_COMP_CD_DISP: authState?.companyID,
                CHEQUE_NO_DISP:
                  acctDtlData?.length > 0 ? acctDtlData[0]?.CHEQUE_NO : "",
                ...((acctDtlData?.length > 0 ? acctDtlData[0] : {}) || {}),
                ...((draftDtlData?.length > 0 ? draftDtlData[0] : {}) || {}),
                COLLECT_COMISSION_CHARGE:
                  cancelChargeData[0]?.COLLECT_COMISSION,
                COLLECT_COMISSION_FLAGE: cancelChargeData[0]?.FLAG_DISABLE,
                COL_SER_CANCEL_CHARGE: cancelChargeData[0]?.COL_SER_CHARGE,
                //@ts-ignore
                CANCEL_REASON:
                  rowsData?.RETRIVE_ENTRY_MODE === "R"
                    ? [...stopPaymentHistory]
                    : [...reasonData],

                PAYSLIP_MST_DTL: acctDtlData,
                STOP_PAY_DATE: authState?.workingDate,
              }}
              formStyle={{
                background: "white",
              }}
              ref={formRef}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={(e) => {
                      if (currentIndex && currentIndex > 0) {
                        handlePrev();
                      }
                    }}
                    disabled={isdraftDtlLoading}
                  >
                    {t("Previous")}
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      if (currentIndex && currentIndex !== totalData) {
                        handleNext();
                      }
                    }}
                    disabled={isdraftDtlLoading}
                  >
                    {t("MoveForward")}
                  </GradientButton>
                  {rowsData?.RETRIVE_ENTRY_MODE === "E" ||
                  rowsData?.RETRIVE_ENTRY_MODE === "D" ||
                  rowsData?.RETRIVE_ENTRY_MODE === "S" ? (
                    <>
                      <GradientButton
                        disabled={isSubmitting}
                        endIcon={
                          mutation?.isLoading ? (
                            <CircularProgress size={20} />
                          ) : null
                        }
                        onClick={() => {
                          let event: any = { preventDefault: () => {} };
                          handleSubmit(event, "SAVE");
                        }}
                      >
                        {t("save")}
                      </GradientButton>
                    </>
                  ) : (
                    ""
                  )}
                  {screenFlag === "CANCELCONFIRM" ||
                  screenFlag === "REALIZECONFIRM" ? (
                    <>
                      <GradientButton
                        onClick={async () => {
                          if (
                            trans_type === "TC" &&
                            rowsData?.PARA_812 === "N" &&
                            rowsData?.RETRIVE_ENTRY_MODE === "D"
                          ) {
                            if (
                              draftDtlData[0]?.ENTERED_BY ===
                              draftDtlData[0]?.REVALID_BY
                            ) {
                              await MessageBox({
                                messageTitle: t("ValidationFailed"),
                                message: t("ConfirmRestrictMsg"),
                                icon: "CONFIRM",
                                buttonNames: ["Ok"],
                              });
                            } else {
                              if (
                                draftDtlData[0]?.ENTERED_BY ===
                                draftDtlData[0]?.REALIZE_BY
                              ) {
                                await MessageBox({
                                  messageTitle: t("ValidationFailed"),
                                  message: t("ConfirmRestrictMsg"),
                                  buttonNames: ["Ok"],
                                });
                              }
                            }
                          } else if (authState?.role === "1") {
                            const buttonName = await MessageBox({
                              messageTitle: t("ValidationFailed"),
                              message: t("authoeizationFailed"),
                              buttonNames: ["Yes", "No"],
                              loadingBtnName: ["Yes"],
                            });
                          } else if (rowsData?.REALIZE_FLAG === "Y") {
                            const buttonName = await MessageBox({
                              messageTitle: t("ValidationFailed"),
                              message: t("payslipAlreadyConfirmed"),
                              buttonNames: ["Ok"],
                            });
                          } else {
                            const buttonName = await MessageBox({
                              messageTitle: t("Confirmation"),
                              message: `${t(
                                "payslipRealizeconfirmRestrictNSG"
                              )}PAYSLIP No. ${rowsData?.PAYSLIP_NO}`,
                              buttonNames: ["Yes", "No"],
                              icon: "CONFIRM",
                              loadingBtnName: ["Yes"],
                            });
                            if (buttonName === "Yes") {
                              confirmMutation.mutate({
                                _isConfirmed: true,
                                TRAN_TYPE: trans_type,
                                ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                                PARA_243: rowsData?.PARA_243,
                                ENETERED_COMP_CD: rowsData?.ENETERED_COMP_CD,
                                ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                                TRAN_CD: rowsData?.TRAN_CD,
                                SR_CD: rowsData?.SR_CD,
                                PARA_812: rowsData?.PARA_812,
                                A_ENTRY_MODE: rowsData?.RETRIVE_ENTRY_MODE,
                              });
                            }
                          }
                        }}
                      >
                        {t("Confirm")}
                      </GradientButton>
                      <GradientButton
                        onClick={() => {
                          SetDeleteRemark(true);
                        }}
                      >
                        {t("Reject")}
                      </GradientButton>
                    </>
                  ) : (
                    ""
                  )}
                  {rowsData?.RETRIVE_ENTRY_MODE === "R" ? (
                    <GradientButton
                      onClick={() => {
                        SetDeleteRemark(true);
                      }}
                    >
                      {t("Realease")}
                    </GradientButton>
                  ) : (
                    ""
                  )}
                  <GradientButton onClick={() => onClose()} color={"primary"}>
                    {t("close")}
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          </>
        ) : (
          <Paper sx={{ display: "flex", p: 2, justifyContent: "center" }}>
            <LoadingTextAnimation />
          </Paper>
        )}
      </Dialog>
      {openNewDDForm ? (
        <Dialog
          open={openNewDDForm}
          PaperProps={{
            style: {
              height: "auto",
              width: "100%",
            },
          }}
          maxWidth="lg"
        >
          {mutation.isError && (
            <Alert
              severity="error"
              errorMsg={mutation?.error?.error_msg || t("Somethingwenttowrong")}
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          )}
          <FormWrapper
            key={`draftmstdetails${formMode}${currentIndex}`}
            metaData={
              extractMetaData(revalidateDDform, formMode) as MetaDataType
            }
            // controlsAtBottom={true}
            displayMode={"view"}
            onSubmitHandler={(
              data: any,
              displayData,
              endSubmit,
              setFieldError
            ) => {
              const cancleDraftData = ddformRef.current;

              if (screenFlag === "CANCELENTRY") {
                const newTransferAccountData = {
                  TRF_COMP_CD: cancleDraftData?.TRF_COMP_CD_DISP,
                  TRF_BRANCH_CD: cancleDraftData?.TRF_BRANCH_CD,
                  TRF_ACCT_TYPE: cancleDraftData?.TRF_ACCT_TYPE,
                  TRF_ACCT_CD: cancleDraftData?.TRF_ACCT_CD,
                };
                const revalidatedDDObj = {
                  ACCT_TYPE: acctDtlData[0]?.ACCT_TYPE,
                  ACCT_CD: acctDtlData[0]?.ACCT_CD,
                  COMM_TYPE_CD: draftDtlData[0]?.COMM_TYPE_CD,
                  TOT_DD_NEFT_AMT: data?.TOTAL_AMOUNT,
                  DD_NEFT_PAY_AMT: data?.PAYMENT_AMOUNT,
                };
                let newdraftData = {
                  COLLECT_COMISSION: cancleDraftData?.COLLECT_COMISSION,
                  REALIZE_AMT: cancleDraftData?.REALIZE_AMT,
                  C_C_T_SP_C: cancleDraftData?.C_C_T_SP_C,
                  REALIZE_BRANCH_CD: authState?.user?.branchCode,
                  REALIZE_COMP_CD: authState?.companyID,
                  REALIZE_BY: authState?.user?.id,
                  REALIZE_DATE:
                    format(
                      new Date(cancleDraftData?.REALIZE_DATE_DISP),
                      "dd/MMM/yyyy"
                    ) ?? "",
                  PENDING_FLAG: "Y",
                  ...(data?.C_C_T_SP_C !== "G"
                    ? { CHEQUE_NO: cancleDraftData?.TOKEN_NO }
                    : {}),
                  ...(cancleDraftData?.C_C_T_SP_C === "T"
                    ? newTransferAccountData
                    : {}),
                  ...(cancleDraftData.C_C_T_SP_C === "C"
                    ? { PENDING_FLAG: "Y" }
                    : {}),

                  ...(rowsData?.PARA_243 === "Y"
                    ? {
                        REALIZE_FLAG: "Y",
                      }
                    : {}),
                };

                const oldTransferAccountData = {
                  TRF_COMP_CD: draftDtlData[0]?.TRF_COMP_CD,
                  TRF_BRANCH_CD: draftDtlData[0]?.TRF_BRANCH_CD,
                  TRF_ACCT_TYPE: draftDtlData[0]?.TRF_ACCT_TYPE,
                  TRF_ACCT_CD: draftDtlData[0]?.TRF_ACCT_CD,
                  // TRF_NAME: draftDtlData[0]?.TRF_NAME,
                };

                const oldData = {
                  COLLECT_COMISSION: draftDtlData[0]?.COLLECT_COMISSION,
                  REALIZE_AMT: draftDtlData[0]?.REALIZE_AMT,
                  C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
                  ...(draftDtlData?.C_C_T_SP_C !== "G"
                    ? { CHEQUE_NO: draftDtlData[0]?.CHEQUE_NO }
                    : {}),
                  REALIZE_BY: draftDtlData[0]?.REALIZE_BY,
                  // REALIZE_DATE_DISP: authState?.workingDate,
                  REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
                  REALIZE_BRANCH_CD: draftDtlData[0]?.REALIZE_BRANCH_CD,
                  REALIZE_COMP_CD: draftDtlData[0]?.REALIZE_COMP_CD,
                  PENDING_FLAG: draftDtlData[0]?.PENDING_FLAG,
                  ...(data?.C_C_T_SP_C === "T" ? oldTransferAccountData : {}),
                  ...(rowsData?.PARA_243 === "Y"
                    ? {
                        REALIZE_FLAG: rowsData.REALIZE_FLAG,
                      }
                    : {}),
                };

                let upd = utilFunction.transformDetailsData(
                  newdraftData,
                  oldData
                );
                delete data.SIGNATURE1_NM;
                delete data.SIGNATURE2_NM;
                delete data.REGION_NM;
                isErrorFuncRef.current = {
                  data: {
                    ...newdraftData,
                    ...upd,
                    ENTERED_COMP_CD: authState?.companyID,
                    ENTERED_BRANCH_CD: authState?.user?.branchCode,
                    TRAN_CD: rowsData?.TRAN_CD,
                    PARA_812: rowsData?.PARA_812,
                    PARA_243: rowsData?.PARA_243,
                    TRAN_TYPE: trans_type,
                    SR_CD: draftDtlData[0]?.SR_CD,
                    A_ENTRY_MODE: rowsData?.RETRIVE_ENTRY_MODE,
                    COL_SER_CHARGE: cancleDraftData.COL_SER_CHARGE,
                    PAY_SLIP_NEFT_DTL: [
                      {
                        ...data,
                        COMM_TYPE_CD: draftDtlData[0]?.COMM_TYPE_CD,
                        FROM_CERTI_NO: "",
                        FROM_ACCT_CD: draftDtlData[0]?.ACCT_CD,
                        FROM_COMP_CD: draftDtlData[0]?.COMP_CD,
                        FROM_BRANCH_CD: draftDtlData[0]?.BRANCH_CD,
                        FROM_ACCT_TYPE: draftDtlData[0]?.ACCT_TYPE,
                        BRANCH_NM: draftDtlData[0]?.BRANCH_NM,
                      },
                    ],
                    ...revalidatedDDObj,
                    DETAILS_DATA: {
                      isNewRow:
                        cancleDraftData &&
                        cancleDraftData?.CANCEL_REASON?.length >= 0
                          ? cancleDraftData.CANCEL_REASON
                          : [],
                    },
                    PAY_FOR: "",
                    SDC: "",
                    SCROLL1: "",
                    THROUGH_CHANNEL: "",
                    REQUEST_CD: "0",
                    REMARKS: "",
                    DD_NEFT: "DD",
                    SCREEN_REF: apiReqFlag,
                  },
                  displayData,
                  endSubmit,
                  setFieldError,
                };

                mutation.mutate({
                  ...isErrorFuncRef.current?.data,
                });
              }
            }}
            initialValues={{
              ...draftDtlData[0],
              INSTRUCTION_REMARKS: "Payslip Revalidated",
            }}
            formStyle={{
              background: "white",
              height: "auto",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={() => {
                    let event: any = { preventDefault: () => {} };
                    handleSubmit(event, "SAVE");
                  }}
                >
                  {t("Ok")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    setopenNewDDForm(false);
                  }}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </Dialog>
      ) : (
        ""
      )}
      {isDeleteRemark ? (
        <RemarksAPIWrapper
          TitleText={
            "Enter Removal Remarks For PAYSLP REALIZE CONFIRMATION RPT/18"
          }
          onActionNo={() => {
            SetDeleteRemark(false);
          }}
          onActionYes={async (val, rows) => {
            const buttonName = await MessageBox({
              messageTitle: t("Confirmation"),
              message: t("DoYouWantDeleteRow"),
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
              defFocusBtnName: "Yes",
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {
              rejectMutaion.mutate({
                _isConfirmed: false,
                COMP_CD: authState?.companyID,
                ENTERED_BRANCH_CD: authState?.user?.branchCode,
                ENTERED_COMP_CD: authState?.companyID,
                TRAN_CD: rowsData?.TRAN_CD,
                SR_CD: rowsData?.SR_CD,
                PAYSLIP_NO: rowsData?.PAYSLIP_NO,
                TRAN_TYPE: trans_type,
                A_ENTRY_MODE: rowsData?.RETRIVE_ENTRY_MODE,
                REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
                REVALID_DT: rowsData?.REVALID_DT,
                TRAN_DT: authState?.workingDate,
                REALIZE_FLAG: rowsData?.REALIZE_FLAG,
                PENDING_FLAG: rowsData?.PENDING_FLAG,
                STOP_REMARKS: "",
                PARA_243: rowsData?.PARA_243,
                PARA_812: rowsData?.PARA_812,
                A_REJECT_FLAG: "Y",
                BRANCH_CD: acctDtlData[0]?.BRANCH_CD,
                ACCT_TYPE: acctDtlData[0]?.ACCT_TYPE,
                ACCT_CD: acctDtlData[0]?.ACCT_CD,
                AMOUNT: rowsData?.TOTAL_AMT,
                USER_DEF_REMARKS: val,
                SCREEN_REF: apiReqFlag,
              });
            }
          }}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isDeleteRemark}
          defaultValue={
            "WRONG ENTRY FROM PAYSLIP REALIZE CONFIRMATION (RPT/18)"
          }
          rows={rowsData}
        />
      ) : (
        ""
      )}
    </>
  );
};

export const EntryForm = ({
  onClose,
  currentIndexRef,
  handleNext,
  handlePrev,
  headerLabel,
  screenFlag,
  trans_type,
  apiReqFlag,
  totalData,
  defaultView,
}) => {
  const { state: rows } = useLocation();
  currentIndexRef.current = rows?.index;

  return (
    <>
      <ClearCacheProvider>
        <EntryFormView
          onClose={onClose}
          rowsData={rows?.gridData}
          currentIndex={rows.index}
          handleNext={handleNext}
          handlePrev={handlePrev}
          headerLabel={headerLabel}
          screenFlag={screenFlag}
          trans_type={trans_type}
          apiReqFlag={apiReqFlag}
          totalData={totalData}
          defaultView={defaultView}
        />
      </ClearCacheProvider>
    </>
  );
};
