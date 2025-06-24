import { AuthContext } from "pages_audit/auth";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import {
  commonDataRetrive,
  getJointDetailsList,
  headerDataRetrive,
} from "../payslip-issue-entry/api";
import {
  DraftdetailsFormMetaData,
  TotaldetailsFormMetaData,
} from "../payslip-issue-entry/paySlipMetadata";
import {
  AppBar,
  Chip,
  Dialog,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import JointDetails from "../payslip-issue-entry/JointDetails";
import {
  AccdetailsFormMetaData,
  PayslipdetailsFormMetaData,
} from "./confirmationFormMetaData";
import { t } from "i18next";
import { ConFirmedHistory } from "./conFirmedHistory";
import { format } from "date-fns";
import * as API from "./api";
import { enqueueSnackbar } from "notistack";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";
import {
  LoaderPaperComponent,
  RemarksAPIWrapper,
  GradientButton,
  usePopupContext,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  ClearCacheProvider,
  utilFunction,
  Alert,
} from "@acuteinfo/common-base";
import { Box, Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
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
function PayslipConfirmationForm({
  defaultView,
  closeDialog,
  slipdataRefetch,
  isDataChangedRef,
}) {
  const [formMode, setFormMode] = useState("view");
  const { authState } = useContext(AuthContext);
  const [jointDtl, setjointDtl] = useState(false);
  const [openConfmHistory, setopenConfmHistory] = useState(false);
  const [jointDtlData, setjointDtlData] = useState([]);
  const [SignData, setSignData] = useState();
  const { state: rows } = useLocation();
  const myChequeFormRef = useRef<any>(null);
  const [isPhotoSign, setIsPhotoSign] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [isDeleteRemark, SetDeleteRemark] = useState(false);

  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: rows?.[0]?.data.TRAN_CD,
  };
  const {
    data: acctDtlData,
    isLoading: isAcctDtlLoading,
    isError: isAcctDtlError,
    error: acctDtlError,
  } = useQuery(
    ["headerData", requestData],
    () => headerDataRetrive(requestData),
    {}
  );

  const {
    data: draftDtlData,
    isLoading: isdraftDtlLoading,
    isError: isDraftDtlError,
    error: draftDtlError,
  } = useQuery(
    ["draftdata", requestData],
    () => commonDataRetrive(requestData),
    {}
  );

  const jointDetailMutation = useMutation(getJointDetailsList, {
    onError: async (error: any) => {
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      setjointDtlData(data);
    },
  });
  const confirmMutation = useMutation(
    "confirmMutation",
    API.getEntryConfirmed,
    {
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        CloseMessageBox();
        closeDialog();
      },
      onError: async (error: any) => {
        CloseMessageBox();
      },
    }
  );
  const rejectMutaion = useMutation("rejectMutaion", API.getEntryReject, {
    onSuccess: (data) => {
      SetDeleteRemark(false);
      enqueueSnackbar(`${t("RecordRemovedMsg")}`, {
        variant: "success",
      });
      isDataChangedRef.current = true;
      CloseMessageBox();
      closeDialog();
    },
    onError: async (error: any) => {
      CloseMessageBox();
    },
  });
  const handlePhotoSignOpen = () => {
    setIsPhotoSign(true);
  };
  const handleJointDetailOpen = () => {
    setjointDtl(true);
  };
  const headerClasses = useTypeStyles();
  let currentPath = useLocation().pathname;
  const errorDataa: any = [
    {
      error: jointDetailMutation?.error,
      isError: jointDetailMutation?.isError,
    },
    {
      error: confirmMutation?.error,
      isError: confirmMutation?.isError,
    },
    {
      error: acctDtlError,
      isError: isAcctDtlError,
    },
    {
      error: draftDtlError,
      isError: isDraftDtlError,
    },
  ];

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={true}
        style={{ height: "100%" }}
        PaperProps={{
          style: { width: "100%", height: "100%", padding: "5px" },
        }}
      >
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
            {rows[0]?.data?.ALLOW_CONFIRM === "Y" &&
            draftDtlData &&
            acctDtlData ? (
              <GradientButton
                color={"primary"}
                onClick={async (event) => {
                  if (rows[0]?.data?.RESTRICT_CNFIRM_MSG !== "") {
                    await MessageBox({
                      messageTitle: t("ValidationFailed"),
                      message: rows?.RESTRICT_CNFIRM_MSG,
                      icon: "ERROR",
                      buttonNames: ["Ok"],
                    });
                  } else if (
                    authState?.user?.id === rows[0]?.data?.ENTERED_BY
                  ) {
                    await MessageBox({
                      messageTitle: t("ValidationFailed"),
                      message: t("ConfirmRestrictMsg"),
                      buttonNames: ["Ok"],
                      icon: "ERROR",
                    });
                  } else {
                    const buttonName = await MessageBox({
                      messageTitle: t("Confirmation"),
                      message: `${t("DoYouWantToAllowPayslipDD")}Slip No. ${
                        rows?.[0]?.data?.SLIP_CD
                      }`,
                      buttonNames: ["Yes", "No"],
                      icon: "CONFIRM",
                      loadingBtnName: ["Yes"],
                    });
                    if (buttonName === "Yes") {
                      confirmMutation.mutate({
                        DETAILS_DATA: {
                          isNewRow: [
                            {
                              ...rows[0].data,
                              ENTERED_COMP_CD: draftDtlData
                                ? draftDtlData[0]?.ENTERED_COMP_CD
                                : "",
                              ENTERED_BRANCH_CD: draftDtlData
                                ? draftDtlData[0]?.ENTERED_BRANCH_CD
                                : "",
                              TRAN_CD: rows[0].data?.TRAN_CD,
                              COMP_CD: authState?.companyID,
                              BRANCH_CD: authState?.user?.branchCode,
                              ACCT_TYPE: rows[0].data?.ACCT_TYPE,
                              ACCT_CD: rows[0].data?.ACCT_CD,
                              TRN_DT: format(
                                new Date(rows[0].data?.TRAN_DT),
                                "dd/MMM/yyyy"
                              ),
                              AMOUNT: `${rows[0].data?.TOTAL_AMT}`,
                              SCREEN_REF: "RPT/15",
                              TYPE_CD: "",
                              TRN_FLAG: "",
                              TRAN_BAL: acctDtlData
                                ? acctDtlData[0]?.TRAN_BAL
                                : "",
                            },
                          ],
                        },
                      });
                    }
                  }
                }}
              >
                {t("Confirm")}
              </GradientButton>
            ) : (
              ""
            )}
            {draftDtlData && acctDtlData ? (
              <>
                <GradientButton
                  color={"primary"}
                  onClick={(event) => {
                    SetDeleteRemark(true);
                  }}
                >
                  {t("Reject")}
                </GradientButton>
                <GradientButton
                  color={"primary"}
                  onClick={(event) => {
                    setopenConfmHistory(true);
                  }}
                >
                  {t("ConfHistory")}
                </GradientButton>
              </>
            ) : (
              ""
            )}
            <GradientButton onClick={closeDialog} color={"primary"}>
              {t("Close")}
            </GradientButton>
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
        {!isdraftDtlLoading && !isAcctDtlLoading ? (
          <>
            <FormWrapper
              ref={myChequeFormRef}
              key={`basicinfoform${formMode}`}
              metaData={
                extractMetaData(
                  PayslipdetailsFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={() => {}}
              hideHeader={true}
              initialValues={{
                TRAN_DT: rows?.[0]?.data.TRAN_DT,
                SLIP_CD: rows?.[0]?.data?.SLIP_CD,
                PENDING_FLAG:
                  rows?.[0]?.data.CONFIRMED === "Y" ? "Confirmed" : "Pending",
              }}
              formStyle={{ background: "white" }}
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
                if (id === `PAYSLIP_MST_DTL[${btnIndex}].JOINT_DTL`) {
                  const retrivedObj = acctDtlData ? acctDtlData[btnIndex] : [];
                  const ACCT_CD = retrivedObj.ACCT_CD;
                  const ACCT_TYPE = retrivedObj.ACCT_TYPE;
                  jointDetailMutation.mutate({
                    ACCT_CD,
                    ACCT_TYPE,
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: authState.user.branchCode,
                  });

                  setjointDtl(true);
                }
                if (id === `PAYSLIP_MST_DTL[${btnIndex}].SIGN`) {
                  const retrievedObject = acctDtlData
                    ? acctDtlData[btnIndex]
                    : [{}];
                  setSignData(retrievedObject);
                  setIsPhotoSign(true);
                }
              }}
              initialValues={{
                PAYSLIP_MST_DTL: acctDtlData ?? [],
              }}
              hideHeader={true}
              formState={{
                openPhotoSign: handlePhotoSignOpen,
                openJointDetail: handleJointDetailOpen,
                Mode: formMode,
              }}
              formStyle={{
                background: "white",
                height: "31vh",
                overflow: "scroll",
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
              initialValues={{
                PAYSLIP_DRAFT_DTL: draftDtlData ?? [],
                FORM_MODE: "view",
              }}
              hideHeader={true}
              formStyle={{
                background: "white",
                height: "40vh",
                overflow: "scroll",
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
              formStyle={{ background: "white", height: "auto" }}
            />
          </>
        ) : (
          <Paper sx={{ display: "flex", justifyContent: "center" }}>
            <LoaderPaperComponent />
          </Paper>
        )}
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
      </Dialog>
      {isDeleteRemark ? (
        <RemarksAPIWrapper
          TitleText={
            "Enter Removal Remarks For PAYSLP ISSUE CONFIRMATION (RPT/15) Confirmation"
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
              let deleteReqPara = {
                REQ_FLAG: "A",
                TRAN_TYPE: "Delete",
                COMP_CD: acctDtlData[0].ENTERED_COMP_CD,
                BRANCH_CD: acctDtlData[0].ENTERED_BRANCH_CD,
                ACCT_CD: rows[0]?.data?.ACCT_CD,
                ACCT_TYPE: rows[0]?.data?.ACCT_TYPE,
                AMOUNT: `${rows[0].data?.TOTAL_AMT}`,
                REMARKS: acctDtlData[0].REMARKS,
                SCREEN_REF: "RPT/15",
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
              rejectMutaion.mutate(deleteReqPara);
            }
          }}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isDeleteRemark}
          defaultValue={
            "WRONG ENTRY FROM PAYSLIP ISSUE CONFIRMATION (RPT/15) CONFIRMATION"
          }
          rows={rows}
        />
      ) : (
        ""
      )}
      {openConfmHistory ? (
        <ConFirmedHistory
          open={openConfmHistory}
          close={() => setopenConfmHistory(false)}
        />
      ) : (
        ""
      )}
      {isPhotoSign ? (
        <>
          <div style={{ paddingTop: 10 }}>
            <PhotoSignWithHistory
              data={SignData ? SignData : {}}
              onClose={() => {
                setIsPhotoSign(false);
              }}
              screenRef={"RPT/015"}
            />
          </div>
        </>
      ) : null}
    </>
  );
}

export const PayslipConfirmationFormDetails = ({
  defaultView,
  closeDialog,
  slipdataRefetch,
  isDataChangedRef,
}) => {
  return (
    <ClearCacheProvider>
      <PayslipConfirmationForm
        defaultView={defaultView}
        closeDialog={closeDialog}
        slipdataRefetch={slipdataRefetch}
        isDataChangedRef={isDataChangedRef}
      />
    </ClearCacheProvider>
  );
};
