import { useContext, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Chip,
  CircularProgress,
  Dialog,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import {
  AccdetailsFormMetaData,
  DraftdetailsFormMetaData,
  PayslipdetailsFormMetaData,
  TotaldetailsFormMetaData,
  regionMasterMetaData,
} from "./paySlipMetadata";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import {
  commonDataRetrive,
  headerDataRetrive,
  getRegionDDData2,
  getSlipTransCd,
  getSlipNo,
  validatePayslipData,
  addRegionData,
  savePayslipEntry,
  getJointDetailsList,
  getVoucherList,
} from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingTextAnimation } from "components/common/loader";
import { enqueueSnackbar } from "notistack";
import JointDetails from "./JointDetails";
import { format } from "date-fns";
import { t } from "i18next";
import {
  ImageViewer,
  RemarksAPIWrapper,
  MasterDetailsForm,
  SubmitFnType,
  ClearCacheProvider,
  queryClient,
  usePopupContext,
  ActionTypes,
  FormWrapper,
  MetaDataType,
  utilFunction,
  extractMetaData,
  GradientButton,
  Alert,
} from "@acuteinfo/common-base";
import { getdocCD } from "components/utilFunction/function";
import { useDialogContext } from "./DialogContext"; // Import the custom hook

const useTypeStyles: any = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));
const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
  },
];
const PayslipIsuueEntryform = ({
  defaultView,
  closeDialog,
  slipdataRefetch,
}) => {
  let currentPath = useLocation().pathname;
  const { state: rows } = useLocation();
  const myChequeFormRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const formDataRef = useRef<any>(null);
  const billType = useRef<any>(null);
  const shrtctKeysRef = useRef<any>(null);
  const headerClasses = useTypeStyles();
  const [acctData, setAcctData] = useState({});
  const { authState } = useContext(AuthContext);
  const [formMode, setFormMode] = useState(defaultView);
  const [regionDialouge, setregionDialouge] = useState(false);
  const [jointDtl, setjointDtl] = useState(false);
  const [OpenSignature, setOpenSignature] = useState(false);
  const [jointDtlData, setjointDtlData] = useState([]);
  const [openForm, setopenForm] = useState(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  //@ts-ignore
  const { trackDialogClass } = useDialogContext();

  const [mstState, setMstState] = useState<any>({
    PAYSLIP_MST_DTL: [
      {
        CHEQUE_DATE: authState?.workingDate ?? "",
        PENDING_FLAG: "Y",
        COMP_CD: authState?.companyID,
      },
    ],
  });

  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [signBlob, setSignBlob] = useState<any>(null);
  const [openDltDialogue, setopenDltDialogue] = useState(false);
  const [refetchRegion, setregionRefetch] = useState(0);
  const [draftState, setDraftState] = useState<any>({
    PAYSLIP_DRAFT_DTL: [
      {
        PENDING_FLAG: "Y",
        ENTERED_COMP_CD: authState?.companyID,
        COMP_CD: authState?.companyID,
      },
    ],
  });

  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: rows?.[0]?.data.TRAN_CD,
  };
  const {
    data: slipnoData,
    isLoading: isslipnoDataLoading,
    isError: isSlipnoDataError,
    error: slipnoError,
  } = useQuery(
    ["getSlipNo", requestData],
    () =>
      getSlipNo({
        ENT_COMP_CD: authState?.companyID,
        ENT_BRANCH_CD: authState?.user?.branchCode,
        TRAN_DT: authState?.workingDate,
      }),
    {
      enabled: formMode == "new",
    }
  );

  const {
    data: acctDtlData,
    isLoading: isAcctDtlLoading,
    isError: isAcctDtlError,
    error: acctDtlError,
  } = useQuery(
    ["headerData", requestData],
    () => headerDataRetrive(requestData),
    {
      enabled: formMode !== "new",
    }
  );

  const {
    data: draftDtlData,
    isLoading: isdraftDtlLoading,
    isError: isdraftDtlError,
    error: draftDtlError,
  } = useQuery(
    ["draftdata", requestData],
    () => commonDataRetrive(requestData),
    {
      enabled: formMode !== "new",
    }
  );

  const {
    data: regionGridData,
    isLoading: isregionDataLoading,
    isError: isRegionDataError,
    error: regionDataError,
    refetch: regionRefetch,
  } = useQuery(
    ["regionData", requestData],
    () => getRegionDDData2(requestData),
    {
      enabled: formMode === "new",
    }
  );

  const {
    data: slipTransCd,
    isLoading: isSlipTranCdLoading,
    isError: isSlipTranCdError,
    error: slipTransCdError,
  } = useQuery(
    ["getpaySliptranscd"],
    () =>
      getSlipTransCd({
        ENT_COMP_CD: authState?.companyID,
        ENT_BRANCH_CD: authState?.user?.branchCode,
      }),
    {
      enabled: formMode == "new",
    }
  );

  const deleteMutation = useMutation(savePayslipEntry, {
    onError: async (error: any) => {
      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("RecordRemovedMsg"), {
        variant: "success",
      });
      slipdataRefetch();
      CloseMessageBox();
      closeDialog();
    },
  });
  const jointDetailMutation = useMutation(getJointDetailsList, {
    onError: async (error: any) => {
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      setjointDtlData(data);
    },
  });
  const voucherMutation = useMutation(getVoucherList, {
    onError: async (error: any) => {
      isErrorFuncRef.current?.endSubmit(false);
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      if (data[0]?.VOUCHER_MSG === "") {
        return;
      } else {
        const btnName = await MessageBox({
          message: data[0]?.VOUCHER_MSG,
          messageTitle: t("voucherConfirmationMSG"),
          icon: "INFO",
          buttonNames: ["Ok"],
        });
      }
      closeDialog();
      CloseMessageBox();
    },
  });
  const PayslipSaveMutation = useMutation(savePayslipEntry, {
    onError: async (error: any) => {
      isErrorFuncRef.current?.endSubmit(false);
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      isErrorFuncRef.current?.endSubmit(true);
      CloseMessageBox();
      if (data[0]?.TRAN_CD) {
        voucherMutation.mutate({
          A_ENT_COMP_CD: authState?.companyID ?? "",
          A_ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
          A_TRAN_DT:
            format(new Date(authState?.workingDate), "dd/MMM/yyyy") ?? "",
          A_TRAN_CD: data[0]?.TRAN_CD ?? "",
          A_TRN_FLAG: "N",
          A_SDC: "PSLP",
          A_SR_CD: "0",
        });
      }

      slipdataRefetch();
      enqueueSnackbar(t("success"), {
        variant: "success",
      });
      closeDialog();
      CloseMessageBox();
    },
  });
  const validDataNutation = useMutation(validatePayslipData, {
    onError: async (error: any) => {
      // closeDialog();
      isErrorFuncRef.current?.endSubmit(false);
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      if (data) {
        if (formDataRef.current) {
          formDataRef.current.data = {
            ...formDataRef.current.data,
            DRAFT_MST_DATA: [
              {
                COMP_CD: data[0]?.COMP_CD ?? "",
                BRANCH_CD: data[0]?.BRANCH_CD ?? "",
                ACCT_CD: data[0]?.ACCT_CD ?? "",
                ACCT_TYPE: data[0]?.ACCT_TYPE ?? "",
              },
            ],
          };
        }
      }

      let btn99, returnVal;
      const getButtonName = async (obj) => {
        let btnName = await MessageBox(obj);
        return { btnName, obj };
      };
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.O_STATUS === "999") {
          const { btnName, obj } = await getButtonName({
            messageTitle: "Validation Failed",
            message: data[i]?.O_MESSAGE,
            icon: "ERROR",
          });
          if (formMode == "edit") {
            setFormMode("edit");
          }
          returnVal = "";
        } else if (data[i]?.O_STATUS === "99") {
          if (btn99 !== "No") {
            const { btnName, obj } = await getButtonName({
              messageTitle: "Confirmation",
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
              message: data[i]?.O_MESSAGE,
            });
          }
        } else if (data[i]?.O_STATUS === "0") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: "Proceed ?",
            icon: "CONFIRM",
            buttonNames: ["Yes", "No"],
            // loadingBtnName: ["Yes"],
          });
          if (buttonName === "Yes") {
            PayslipSaveMutation.mutate({
              ...formDataRef.current.data,
              TRAN_CD:
                formMode == "new"
                  ? slipTransCd[0]?.TRAN_CD
                  : rows?.[0]?.data?.TRAN_CD,
            });
          }
        }
      }
      isErrorFuncRef.current?.endSubmit(false);
    },
  });
  const regionmutation = useMutation(addRegionData, {
    onSuccess: (data) => {
      regionRefetch();
      setregionRefetch((prev) => prev + 1);
      setregionDialouge(false);
      enqueueSnackbar(t("insertSuccessfully"), {
        variant: "success",
      });
      CloseMessageBox();
    },
    onError: async (error: any) => {
      CloseMessageBox();
      setregionDialouge(false);
    },
  });
  const olddraftData = draftDtlData
    ? draftDtlData.map((item) => {
        const {
          COL_SER_CHARGE,
          REASON_CD,
          LAST_ENTERED_BY,
          REQUEST_CD,
          TRAN_DT,
          LAST_MACHINE_NM,
          ISSUE_DT,
          DIFF_AMT,
          PENDING_FLAG,
          REALIZE_COMP_CD,
          LAST_MODIFIED_DATE,
          ENABLE,
          ACCT_CD,
          ACCT_TYPE,
          REALIZE_DATE,
          ENTERED_DATE,
          REALIZE_BY,
          REALIZE_AMT,
          CHEQUE_NO,
          ENTERED_BY,
          C_C_T_SP_C,
          REALIZE_BRANCH_CD,
          THROUGH_CHANNEL,
          DESCRIPTION,
          COMP_CD,
          COMM_TRX_CD,
          MACHINE_NM,
          COLLECT_COMISSION,
          REALIZE_FLAG,
          DOC_DATE,
          PRINT_CNT,
          BALANCE,
          REGION,
          TRAN_CD,
          ...rest
        } = item;
        return {
          ...rest,
          REGION: item.REGION,
          AMOUNT: parseFloat(item.AMOUNT).toFixed(2),
        };
      })
    : [];
  const oldaccttData = acctDtlData
    ? acctDtlData.map((item) => {
        const {
          COMP_CD,
          ENABLE,
          ENABLE_ALL,
          TRAN_DT,
          ENTERED_BRANCH_CD,
          ENTERED_COMP_CD,
          ISSUE_DT,
          DUMMY_CHECK,
          DOC_DATE,
          TRAN_CD,
          ...rest
        } = item;
        return rest;
      })
    : [];

  const setChequeImage = async () => {
    if (Boolean("rowimagedata?.CHEQUE_IMG")) {
      setOpenSignature(true);
      let blob = utilFunction.base64toBlob(
        "rowimagedata?.CHEQUE_IMG",
        "image/png"
      );

      setSignBlob(blob);
    } else {
      return "";
    }
  };
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    endSubmit(true);
    if (!formDataRef.current) {
      formDataRef.current = { data: {} };
    }

    let srCount = utilFunction.GetMaxCdForDetails(olddraftData, "SR_CD");

    let filteredDraftData = data?.PAYSLIP_DRAFT_DTL?.map((item, i) => ({
      ...item,
      SR_CD: item?.isOldRow === "Y" ? item?.SR_CD : srCount++,
      AMOUNT: parseFloat(item.AMOUNT).toFixed(2),
    }));
    filteredDraftData.forEach((item) => {
      delete item.REGIONBTN;
      delete item.INS_FLAG;
      delete item.BILL_TYPE;
      delete item.DISP_REGION;
      delete item.DISP_SIGN1;
      delete item.DISP_SIGN2;
      delete item.PENDING_FLAG;
      delete item.HIDDEN_PAYSLIPNO;
      delete item.TAX_RATE;
      delete item.signature1;
      delete item.signature2;
      delete item.GST_ROUND;
      delete item.INFAVOUR_OF_OPTION;
      delete item.BALANCE;
    });
    let srCount1 = utilFunction.GetMaxCdForDetails(oldaccttData, "SR_CD");
    let filteredAcctData = data?.PAYSLIP_MST_DTL?.map((item, i) => ({
      ...item,
      SR_CD: item?.isOldRow === "Y" ? item?.SR_CD : srCount1++,
      DUMMY_CHECK: Boolean(item["DUMMY_CHECK"]) ? "Y" : "N",
    }));

    filteredAcctData.forEach((item) => {
      delete item.TYPE_CD;
      delete item.JOINT_DTL;
      delete item.PENDING_FLAG;
      if (formMode === "edit") {
        delete item.DUMMY_CHECK;
      }
    });

    const validatePayslipReq = {
      ISSUE_DT: authState?.workingDate,
      PENDING_FLAG: data?.PENDING_FLAG === "Confirmed" ? "Y" : "N",
      SLIP_CD: data?.SLIP_CD,
      // PAYSLIP_MST_DTL: filteredDraftData,
      // PAYSLIP_DRAFT_DTL: filteredAcctData,
      SCREEN_REF: "RPT/14",
      ENTRY_TYPE: formMode === "new" ? "N" : "M",
      ENT_COMP: authState?.companyID ?? "",
      ENT_BRANCH: authState?.user?.branchCode ?? "",
      WORKING_DATE: authState?.workingDate ?? "",
      USERNAME: authState?.user?.id ?? "",
      USERROLE: authState?.role ?? "",
      DTL_CLOB: filteredAcctData ?? "",
      MST_CLOB: filteredDraftData ?? "",
    };
    isErrorFuncRef.current = {
      validatePayslipReq,
      displayData,
      endSubmit,
      setFieldError,
    };

    endSubmit(true);

    const updPara1 = utilFunction.transformDetailDataForDML(
      oldaccttData ?? [],
      filteredAcctData ?? [],
      ["SR_CD"]
    );

    const updPara2 = utilFunction.transformDetailDataForDML(
      olddraftData ?? [],
      filteredDraftData ?? [],
      ["SR_CD"]
    );

    // if (formMode === "edit" && updPara2.isUpdatedRow.length === 0) {
    //   setFormMode("view");
    // }

    if (data.MST_TOTAL !== data.FINAL_DRAFT_TOTAL && formMode === "new") {
      const btn2 = await MessageBox({
        messageTitle: t("ValidationFailed"),
        message: t("amountCheckMsg"),
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    } else {
      validDataNutation.mutate({
        ...isErrorFuncRef.current?.validatePayslipReq,
      });
    }

    if (formDataRef.current) {
      formDataRef.current.data = {
        ISSUE_DT: format(new Date(data.TRAN_DT), "dd/MMM/yyyy"),
        SLIP_CD: data?.SLIP_CD,
        REQ_FLAG: "D",
        COMP_CD: authState?.companyID,
        _isNewRow: formMode === "new",
        PAYSLIP_DRAFT_DTL: updPara2,
        PAYSLIP_MST_DTL: formMode === "edit" ? [] : updPara1,
        // PAYSLIP_MST_DTL: [{ _isNewRow: filteredAcctData }],
        // ADD_DRAFT_DATA: formMode === "new" ? "Y" : "N",
        ADD_DRAFT_DATA: updPara2?.isNewRow?.length !== 0 ? "Y" : "N",
      };
    }
  };

  const handleClick = (e) => {
    myChequeFormRef.current.handleSubmit(e);
  };

  const updatedDraftDtlData = draftDtlData
    ? draftDtlData.map((item) => ({
        ...item,
        HIDDEN_PAYSLIPNO: item.PAYSLIP_NO,
      }))
    : [];

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getpaySliptranscd"]);
      queryClient.removeQueries(["regionData"]);
      queryClient.removeQueries(["draftdata"]);
      queryClient.removeQueries(["headerData"]);
      queryClient.removeQueries(["getSlipNo"]);
    };
  }, []);
  const openJointDetailfn = () => {
    setjointDtl(true);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === "S") || (e.ctrlKey && e.key === "s")) {
        e.preventDefault();
        handleClick(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const errorDataa: any = [
    { error: draftDtlError, isError: isdraftDtlError },
    { error: acctDtlError, isError: isAcctDtlError },
    { error: slipnoError, isError: isSlipnoDataError },
    // { error: regionDataError, isError: isRegionDataError },
    { error: slipTransCdError, isError: isSlipTranCdError },
    { error: regionmutation?.error, isError: regionmutation?.isError },
    { error: validDataNutation?.error, isError: validDataNutation?.isError },
    {
      error: PayslipSaveMutation?.error,
      isError: PayslipSaveMutation?.isError,
    },
    { error: voucherMutation?.error, isError: voucherMutation?.isError },
  ];

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={openForm}
        style={{ height: "100%", width: "100%" }}
        PaperProps={{
          style: { width: "100%", height: "100%", paddingInline: "4px" },
        }}
      >
        <div className="form">
          <AppBar
            position="sticky"
            sx={{ top: "0px", width: "inherit" }}
            color="secondary"
          >
            <Toolbar className={headerClasses.root} variant="dense">
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant="h6"
                component="div"
              >
                {utilFunction.getDynamicLabel(
                  currentPath,
                  authState?.menulistdata,
                  true
                )}
                <Chip
                  style={{ color: "white", marginLeft: "8px" }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  label={`${formMode} mode`}
                />
              </Typography>
              {formMode !== "new" &&
                !isdraftDtlLoading &&
                !isAcctDtlLoading &&
                rows?.[0]?.data.ALLOW_DEL === "Y" && (
                  <GradientButton
                    onClick={(event) => {
                      setopenDltDialogue(true);
                    }}
                    color={"primary"}
                  >
                    {t("delete")}
                  </GradientButton>
                )}
              {formMode === "edit" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleClick(event);
                    }}
                    endIcon={
                      validDataNutation.isLoading ||
                      PayslipSaveMutation.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      setFormMode("view");
                    }}
                    color={"primary"}
                  >
                    {t("Cancel")}
                  </GradientButton>
                </>
              ) : formMode === "new" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleClick(event);
                    }}
                    endIcon={
                      validDataNutation.isLoading ||
                      PayslipSaveMutation.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>
                  <GradientButton onClick={closeDialog} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              ) : (
                <>
                  {!isdraftDtlLoading && !isAcctDtlLoading ? (
                    <GradientButton
                      onClick={async () => {
                        if (rows) {
                          if (rows[0]?.data?.CONFIRMED !== "Y") {
                            setFormMode("edit");
                          } else {
                            await MessageBox({
                              message: t("confirmEntryRestrictionMsg"),
                              messageTitle: t("ValidationFailed"),
                              icon: "ERROR",
                              buttonNames: ["Ok"],
                            });
                          }
                        }
                      }}
                      color={"primary"}
                    >
                      {t("edit")}
                    </GradientButton>
                  ) : null}

                  <GradientButton onClick={closeDialog} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              )}
            </Toolbar>
          </AppBar>
          {errorDataa.map(
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
          {(
            formMode === "new"
              ? !isslipnoDataLoading
              : ![isAcctDtlLoading, isdraftDtlLoading].some(
                  (isLoading) => isLoading
                )
          ) ? (
            <>
              <FormWrapper
                ref={myChequeFormRef}
                key={`basicinfoform${formMode}`}
                hideHeader={true}
                metaData={
                  extractMetaData(
                    PayslipdetailsFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={onSubmitHandler}
                initialValues={{
                  TRAN_DT:
                    formMode === "new"
                      ? authState.workingDate
                      : rows?.[0]?.data.TRAN_DT,
                  SLIP_CD:
                    formMode === "new"
                      ? slipnoData?.[0]?.MAX_SLIP_CD
                      : rows?.[0]?.data?.SLIP_CD,
                  PENDING_FLAG:
                    formMode === "new"
                      ? "Pending"
                      : rows?.[0]?.data.PENDING_FLAG,
                }}
                formStyle={{ background: "white", padding: "17px" }}
              />

              <FormWrapper
                key={`accdetailsformst${formMode}`}
                metaData={
                  extractMetaData(
                    AccdetailsFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={() => {}}
                onFormButtonClickHandel={async (id) => {
                  let startIndex = id.indexOf("[") + 1;
                  let endIndex = id.indexOf("]");
                  let btnIndex = parseInt(id.substring(startIndex, endIndex)); //
                  const formDadata =
                    await myChequeFormRef?.current?.getFieldData();
                  if (formDadata && formDadata.PAYSLIP_MST_DTL) {
                    let arrayIndex =
                      formDadata.PAYSLIP_MST_DTL.length - 1 - btnIndex;
                    if (
                      arrayIndex >= 0 &&
                      arrayIndex < formDadata.PAYSLIP_MST_DTL.length
                    ) {
                      const selectedObject = formDadata
                        ? formDadata.PAYSLIP_MST_DTL[arrayIndex]
                        : [];
                      const retrivedObj = acctDtlData
                        ? acctDtlData[btnIndex]
                        : [];
                      const ACCT_CD =
                        formMode === "new"
                          ? selectedObject.ACCT_CD
                          : retrivedObj.ACCT_CD;
                      const ACCT_TYPE =
                        formMode === "new"
                          ? selectedObject.ACCT_TYPE
                          : retrivedObj.ACCT_TYPE;
                      jointDetailMutation.mutate({
                        ACCT_CD,
                        ACCT_TYPE,
                        COMP_CD: authState?.companyID,
                        BRANCH_CD: authState.user.branchCode,
                      });

                      setjointDtl(true);
                    }
                  }
                }}
                initialValues={{
                  PAYSLIP_MST_DTL:
                    formMode === "new"
                      ? mstState?.PAYSLIP_MST_DTL ?? []
                      : acctDtlData ?? [],
                }}
                hideHeader={true}
                formState={{
                  MessageBox: MessageBox,
                  Mode: formMode,
                  docCD: docCD,
                  openJointDetailfn: openJointDetailfn,
                  acctDtlReqPara: {
                    ACCT_CD: {
                      ACCT_TYPE: "PAYSLIP_MST_DTL.ACCT_TYPE",
                      BRANCH_CD: "PAYSLIP_MST_DTL.BRANCH_CD",
                      SCREEN_REF: docCD ?? "",
                    },
                  },
                }}
                formStyle={{
                  background: "white",
                  height: "31vh",
                  overflow: "scroll",
                  padding: "17px",
                }}
              />

              <FormWrapper
                key={`draftmstdetails${formMode}`}
                metaData={
                  extractMetaData(
                    DraftdetailsFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={() => {}}
                onFormButtonClickHandel={async (id) => {
                  if (id.slice(id.indexOf(".") + 1) === "REGIONBTN") {
                    const btnName = await MessageBox({
                      message: t("addRegionMSG"),
                      messageTitle: t("Confirmation"),
                      buttonNames: ["Yes", "No"],
                    });
                    if (btnName === "Yes") {
                      setregionDialouge(true);
                      trackDialogClass("masterDtl");
                    }
                  }
                  if (id.slice(id.indexOf(".") + 1) === "signature1") {
                    setOpenSignature(true);
                  }
                  if (id.slice(id.indexOf(".") + 1) === "signature2") {
                    setOpenSignature(true);
                  }
                }}
                initialValues={{
                  PAYSLIP_DRAFT_DTL:
                    formMode === "new"
                      ? draftState?.PAYSLIP_DRAFT_DTL ?? []
                      : updatedDraftDtlData ?? [],
                  FORM_MODE: formMode,
                }}
                hideHeader={true}
                formStyle={{
                  background: "white",
                  height: "40vh",
                  overflow: "scroll",
                  padding: "17px",
                }}
                setDataOnFieldChange={async (action, paylod) => {
                  if (action === "DEF_TRAN_CD") {
                    billType.current = {
                      paylod,
                    };
                  }
                }}
                formState={{
                  MessageBox: MessageBox,
                  refID: billType,
                  REGIONDD: refetchRegion,
                }}
              />

              <FormWrapper
                key={`totaldetaisformst${formMode}}`}
                metaData={
                  extractMetaData(
                    TotaldetailsFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={() => {}}
                initialValues={{}}
                hideHeader={true}
                formStyle={{
                  background: "white",
                  height: "auto",
                  padding: "17px",
                }}
                formState={{
                  MessageBox: MessageBox,
                  FLAG:
                    rows?.[0]?.data.PENDING_FLAG === "Confirmed" ? "Y" : "N",
                }}
              />
              {/* <Typography
              sx={{
                fontSize: "15px",
                marginLeft: "20px",
                display: "inline-block",
              }}
            >
              {t("PressCtrlJToViewJointInformation")}
            </Typography> */}
            </>
          ) : (
            <Paper sx={{ display: "flex", justifyContent: "center" }}>
              <LoadingTextAnimation />
            </Paper>
          )}
        </div>
        <Dialog
          open={regionDialouge}
          className="masterDtl"
          PaperProps={{
            style: { width: "100%", padding: "7px" },
          }}
        >
          <MasterDetailsForm
            key={"regionMasterMetaData" + formMode}
            metaData={regionMasterMetaData}
            formStyle={{
              width: "100%%",
            }}
            initialData={{
              _isNewRow: true,
              regionGridData,
              DETAILS_DATA: regionGridData,
            }}
            onSubmitData={(resultValueObj) => {
              const { COMM_TYPE_CD, REGION_CD, REGION_NM } =
                resultValueObj.data;

              regionmutation.mutate({
                COMM_TYPE_CD,
                REGION_CD,
                REGION_NM,
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                _isNewRow: true,
              });
            }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <GradientButton
                    onClick={handleSubmit}
                    color={"primary"}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {t("Ok")}
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      setregionDialouge(false);
                      trackDialogClass("");
                    }}
                    color={"primary"}
                  >
                    {t("Close")}
                  </GradientButton>
                </>
              );
            }}
          </MasterDetailsForm>
        </Dialog>
        <Dialog open={jointDtl} fullWidth maxWidth="lg">
          <JointDetails
            data={jointDtlData}
            loading={jointDetailMutation.isLoading}
            onClose={async (result) => {
              setjointDtl(result);
            }}
            hideHeader={false}
          />
        </Dialog>
        <Dialog
          open={OpenSignature}
          PaperProps={{
            style: {
              height: "50%",
              width: "50%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <ImageViewer
            blob={signBlob}
            fileName=" Payslip Issue Entry"
            onClose={() => {
              setOpenSignature(false);
              setFormMode(formMode);
            }}
          />
        </Dialog>
      </Dialog>
      {openDltDialogue ? (
        <>
          <RemarksAPIWrapper
            TitleText={"Enter Removal Remarks For PAYSLP ISSUE ENTRY RPT/14"}
            onActionNo={() => {
              setopenDltDialogue(false);
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
                let deleteReqPara = {
                  REQ_FLAG: "A",
                  TRAN_TYPE: "Delete",
                  COMP_CD: acctDtlData[0].ENTERED_COMP_CD,
                  BRANCH_CD: acctDtlData[0].ENTERED_BRANCH_CD,
                  ACCT_CD: rows[0]?.data?.ACCT_CD,
                  ACCT_TYPE: rows[0]?.data?.ACCT_TYPE,
                  AMOUNT: `${rows[0].data?.TOTAL_AMT}`,
                  REMARKS: acctDtlData[0].REMARKS,
                  SCREEN_REF: "RPT/14",
                  CONFIRMED: rows[0]?.data?.CONFIRMED,
                  USER_DEF_REMARKS: val,
                  TRAN_CD: rows[0]?.data?.TRAN_CD,
                  ENTERED_BY: draftDtlData[0].ENTERED_BY,
                  PAYSLIP_NO: rows[0]?.data?.PAYSLIP_NO,
                  DRAFT_MST_DATA: [
                    {
                      COMP_CD: "",
                      BRANCH_CD: "",
                      ACCT_CD: "",
                      ACCT_TYPE: "",
                    },
                  ],
                  ADD_DRAFT_DATA: "N",
                  _isNewRow: false,
                };
                deleteMutation.mutate(deleteReqPara);
              }
            }}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={openDltDialogue}
            defaultValue={"WRONG ENTRY FROM PAYSLIP ISSUE ENTRY (RPT/14) "}
            rows={rows}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export const PaySlipIssueEntryData = ({
  defaultView,
  closeDialog,
  slipdataRefetch,
}) => {
  return (
    <ClearCacheProvider>
      <PayslipIsuueEntryform
        defaultView={defaultView}
        closeDialog={closeDialog}
        slipdataRefetch={slipdataRefetch}
      />
    </ClearCacheProvider>
  );
};
