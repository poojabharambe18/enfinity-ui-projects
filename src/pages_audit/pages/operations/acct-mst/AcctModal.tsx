import {
  AppBar,
  Box,
  Chip,
  Dialog,
  Grid,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ExtractedHeader from "../c-kyc/formModal/ExtractedHeader";
import {
  GradientButton,
  queryClient,
  utilFunction,
} from "@acuteinfo/common-base";
import { t } from "i18next";
import {
  Fragment,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"; // sidebar-open-icon
import CancelIcon from "@mui/icons-material/Cancel"; // sidebar-close-icon
import { CustomTabLabel, TabPanel } from "../c-kyc/formModal/formModal";
import { CustomTab, useDialogStyles } from "../c-kyc/formModal/style";
import AcctHeaderForm from "./AcctHeaderForm";
import { AuthContext } from "pages_audit/auth";
import { AcctMSTContext } from "./AcctMSTContext";
import { CustomTabs } from "../c-kyc/Ckyc";
import TabStepper from "./TabStepper";
import { useLocation } from "react-router-dom";
import * as API from "./api";
import MainTab from "./tabComponents/MainTab";
import JointTab from "./tabComponents/jointTabs/JointTab";
import NomineeJointTab from "./tabComponents/jointTabs/NomineeJointTab";
import GuardianJointTab from "./tabComponents/jointTabs/GuardianJointTab";
import GuarantorJointTab from "./tabComponents/jointTabs/GuarantorJointTab";
import CollateralJointTab from "./tabComponents/jointTabs/CollateralJointTab";
import SignatoryJointTab from "./tabComponents/jointTabs/SignatoryJointTab";
import IntroductorJointTab from "./tabComponents/jointTabs/IntroductorJointTab";
import TermLoanTab from "./tabComponents/TermLoanTab";
import SavingsDepositTab from "./tabComponents/SavingsDepositTab";
import HypothicationTab from "./tabComponents/HypothicationTab";
import CurrentTab from "./tabComponents/CurrentTab";
import FixDepositTab from "./tabComponents/FixDepositTab";
import LockerTab from "./tabComponents/LockerTab";
import MobileRegTab from "./tabComponents/MobileRegTab";
import RelativeDtlTab from "./tabComponents/RelativeDtlTab";
import ShareNominalTab from "./tabComponents/ShareNominalTab";
import OtherAddTab from "./tabComponents/OtherAddTab";
import Document from "./tabComponents/DocumentTab/Document";
import OverDraftTab from "./tabComponents/OverdraftTab";
import RecurringTab from "./tabComponents/RecurringTab";
// import Document from "./tabComponents/DocumentTab2/Document";
import { useMutation, useQuery } from "react-query";
import {
  Alert,
  RemarksAPIWrapper,
  usePopupContext,
} from "@acuteinfo/common-base";
import { enqueueSnackbar } from "notistack";
import { getdocCD } from "components/utilFunction/function";
import { AdvConfig } from "./tabComponents/AdvConfig/AdvConfig";
import { format } from "date-fns";

const AcctModal = ({ onClose }) => {
  const {
    AcctMSTState,
    handleFromFormModectx,
    handleFormModalOpenOnEditctx,
    handleFormDataonRetrievectx,
    handleFormModalClosectx,
    handleSidebarExpansionctx,
    handleColTabChangectx,
    handleFormModalOpenctx,
    handleCurrFormctx,
    onFinalUpdatectx,
    handleUpdatectx,
    handleModifiedColsctx,
    handleFormDataonSavectx,
    handleFormLoading,
    toNextTab,
    handleReqCDctx,
    handleStepStatusctx,
  } = useContext(AcctMSTContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const {
    state: {
      rows: [{ data: row }],
      from,
      formmode,
    },
  }: any = useLocation();
  const classes = useDialogStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const reqCD =
    formmode === "new"
      ? ""
      : !isNaN(parseInt(row?.REQUEST_ID))
      ? parseInt(row?.REQUEST_ID)
      : "";

  // get account form details
  const {
    data: accountDetails,
    isLoading,
    isError: isAcctDtlError,
    error: AcctDtlError,
    refetch,
  } = useQuery<any, any>(
    ["getAccountDetails", row?.ACCT_TYPE],
    () =>
      API.getAccountDetails({
        ACCT_TYPE: row?.ACCT_TYPE ?? "",
        ACCT_CD: row?.ACCT_CD ?? "",
        REQUEST_CD: reqCD,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        SCREEN_REF: docCD,
      }),
    { enabled: false }
  );

  useEffect(() => {
    if (isLoading) {
      handleFormLoading(true);
    } else {
      handleFormLoading(false);
    }
    if (!isLoading && accountDetails) {
      handleFormDataonRetrievectx(accountDetails[0]);
      handleColTabChangectx(0);
      handleFormLoading(false);
    }
  }, [accountDetails, isLoading]);

  // validate new account entry
  const validateAcctMutation: any = useMutation(API.validateNewAcct, {
    onSuccess: async (data, variables) => {
      const filterdata = data?.[0]?.MSG;
      for (let i = 0; i < filterdata?.length; i++) {
        if (filterdata[i]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: filterdata[i]?.O_MSG_TITLE
              ? filterdata[i]?.O_MSG_TITLE
              : "ValidationFailed",
            message: filterdata[i]?.O_MESSAGE,
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
          if (btnName === "Ok") {
            onFinalUpdatectx(false);
            CloseMessageBox();
          }
        } else if (filterdata[i]?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: filterdata[i]?.O_MSG_TITLE
              ? filterdata[i]?.O_MSG_TITLE
              : "Alert",
            message: filterdata[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        } else if (filterdata[i]?.O_STATUS === "99") {
          const btnName = await MessageBox({
            messageTitle: filterdata[i]?.O_MSG_TITLE
              ? filterdata[i]?.O_MSG_TITLE
              : "Confirmation",
            message: filterdata[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
            icon: "CONFIRM",
          });
          if (btnName === "No") {
            onFinalUpdatectx(false);
            CloseMessageBox();
          }
        } else if (filterdata[i]?.O_STATUS === "0") {
          if (Boolean(variables?.IsNewRow)) {
            const reqPara = {
              IsNewRow: true,
              REQ_CD: AcctMSTState?.req_cd_ctx,
              REQ_FLAG: "F",
              SAVE_FLAG: "F",
              CUSTOMER_ID: AcctMSTState?.customerIDctx,
              ACCT_TYPE: AcctMSTState?.accTypeValuectx,
              ACCT_CD: AcctMSTState?.acctNumberctx,
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              formData: AcctMSTState?.formDatactx,
              OP_DATE: authState?.workingDate,
              SCREEN_REF: docCD,
              mainIntialVals: AcctMSTState?.mainIntialVals,
            };
            saveAcctMutation.mutate(reqPara);
          } else if (!Boolean(variables?.IsNewRow)) {
            const reqPara = {
              IsNewRow: !AcctMSTState?.req_cd_ctx ? true : false,
              REQ_CD: AcctMSTState?.req_cd_ctx,
              REQ_FLAG: AcctMSTState?.acctNumberctx ? "E" : "F",
              SAVE_FLAG: "F",
              // Not getting Customer ID so i commented this code.
              // CUSTOMER_ID: AcctMSTState?.customerIDctx,
              CUSTOMER_ID:
                AcctMSTState?.retrieveFormDataApiRes?.MAIN_DETAIL?.CUSTOMER_ID,
              ACCT_TYPE: AcctMSTState?.accTypeValuectx,
              ACCT_CD: AcctMSTState?.acctNumberctx,
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              IS_FROM_MAIN: "N",
              formData: AcctMSTState?.formDatactx,
              OP_DATE: authState?.workingDate,
              updated_tab_format: variables?.updated_tab_format,
            };
            modifyAcctMutation.mutate(reqPara);
          }
        }
      }
      // handleCurrFormctx({
      //   currentFormSubmitted: null,
      //   isLoading: false,
      // });
    },
    onError: (error: any) => {
      handleCurrFormctx({
        currentFormSubmitted: null,
        isLoading: false,
      });
      onFinalUpdatectx(false);
      CloseMessageBox();
    },
  });

  // save new account entry
  const saveAcctMutation: any = useMutation(API.accountSave, {
    onSuccess: async (data) => {
      if (data?.[0]?.REQ_CD && !isNaN(data?.[0]?.REQ_CD)) {
        handleReqCDctx(parseInt(data?.[0]?.REQ_CD));
        onFinalUpdatectx(false);
        const buttonName = await MessageBox({
          messageTitle: "SUCCESS",
          message: `${t("SavedSuccessfully")} Request ID - ${
            parseInt(data?.[0]?.REQ_CD) ?? ""
          }`,
          icon: "SUCCESS",
          buttonNames: ["Ok"],
        });
        if (buttonName === "Ok") {
          closeForm();
          CloseMessageBox();
          queryClient.invalidateQueries({
            queryKey: [
              "acct-mst",
              "getPendingTabData",
              authState?.user?.branchCode,
            ],
          });
        }
      }
    },
    onError: (error: any) => {
      onFinalUpdatectx(false);
      handleCurrFormctx({
        currentFormSubmitted: null,
        isLoading: false,
      });
    },
  });

  // modify new account entry
  const modifyAcctMutation: any = useMutation(API.accountModify, {
    onSuccess: async (data) => {
      CloseMessageBox();
      // handleCurrFormctx({
      //   currentFormSubmitted: null,
      //   isLoading: false,
      // });
      onFinalUpdatectx(false);
      handleModifiedColsctx({});
      handleFormDataonSavectx({});
      // enqueueSnackbar("UpdatedSuccessfully", { variant: "success" });
      const buttonName = await MessageBox({
        messageTitle: "SUCCESS",
        message: `${t("UpdatedSuccessfully")} Request ID - ${
          parseInt(data?.[0]?.REQ_CD) ?? ""
        }`,
        icon: "SUCCESS",
        buttonNames: ["Ok"],
      });
      if (buttonName === "Ok") {
        closeForm();
        CloseMessageBox();
        queryClient.invalidateQueries({
          queryKey: [
            "acct-mst",
            "getPendingTabData",
            authState?.user?.branchCode,
          ],
        });
      }
      handleStepStatusctx({ reset: true });
      closeForm();
    },
    onError: (error: any) => {
      CloseMessageBox();
      handleCurrFormctx({
        currentFormSubmitted: null,
        isLoading: false,
      });
      onFinalUpdatectx(false);
      handleModifiedColsctx({});
      handleFormDataonSavectx({});
    },
  });

  // confirm acount entry
  const confirmMutation: any = useMutation(API.confirmAccount, {
    onSuccess: async (data, variables) => {
      setIsOpen(false);
      if (variables?.CONFIRMED === "R") {
        enqueueSnackbar(t("AccountRemoveSuccessfully"), { variant: "success" });
      } else if (
        variables?.CONFIRMED === "Y" &&
        Boolean(data?.[0]?.BRANCH_CD)
      ) {
        const btnName = await MessageBox({
          messageTitle: "Success",
          message: `Account Created - A/C No:- '${data?.[0]?.COMP_CD}-${data?.[0]?.BRANCH_CD}-${data?.[0]?.ACCT_TYPE}-${data?.[0]?.ACCT_CD}`,
          icon: "SUCCESS",
          buttonNames: ["Ok"],
        });
        if (btnName === "Ok") {
          CloseMessageBox();
        }
      } else {
        enqueueSnackbar(t("AccountConfirmSuccessfully"), {
          variant: "success",
        });
      }
      closeForm();
    },
    onError: async (error: any) => {
      // console.log("data o n error", error)
      // setIsUpdated(true)
      setIsOpen(false);
      setConfirmAction(null);
      // console.log("onerrorrr", error)
      // let buttonName = await MessageBox({
      //   messageTitle: "ERROR",
      //   message: "",
      //   buttonNames: ["Ok"],
      // });
    },
  });

  useEffect(() => {
    handleFromFormModectx({
      formmode: formmode === "edit" ? "view" : formmode,
      from,
    });
    if (formmode === "new") {
      handleColTabChangectx(0);
      handleFormModalOpenctx();
    } else if (Boolean(row && typeof row === "object")) {
      handleFormModalOpenOnEditctx(row);
      refetch();
    } else {
      handleFormModalClosectx();
      onClose();
    }

    return () => {
      handleFormModalClosectx();
      queryClient.removeQueries(["getAccountDetails", row?.ACCT_TYPE]);
    };
  }, []);

  const closeForm = () => {
    handleFormModalClosectx();
    onClose();
  };
  const onCancelForm = async () => {
    // console.log(Object.keys(state?.formDatactx).length >0, Object.keys(state?.steps).length>0, "*0*",state?.formDatactx, Object.keys(state?.formDatactx).length, " - ", state?.steps, Object.keys(state?.steps).length, "aisuhdiuweqhd")
    if (
      Boolean(AcctMSTState?.formmodectx) &&
      AcctMSTState?.formmodectx !== "view"
    ) {
      if (Object.keys(AcctMSTState?.formDatactx).length > 0) {
        let buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "YourChangesWillBeLostAreYouSure",
          buttonNames: ["Yes", "No"],
          icon: "CONFIRM",
        });
        if (buttonName === "Yes") {
          closeForm();
        }
      } else {
        closeForm();
      }
    } else {
      closeForm();
    }
  };

  const ActionBTNs = useMemo(() => {
    // console.log(AcctMSTState?.formmodectx, "wieuhfiwhefwef", AcctMSTState?.fromctx)
    return AcctMSTState?.formmodectx == "view"
      ? AcctMSTState?.fromctx &&
          AcctMSTState?.fromctx === "confirmation-entry" && (
            <Fragment>
              <GradientButton
                onClick={() => openActionDialog("Y")}
                color="primary"
                // disabled={mutation.isLoading}
              >
                {t("Confirm")}
              </GradientButton>
              <GradientButton
                onClick={() => openActionDialog("R")}
                color="primary"
                // disabled={mutation.isLoading}
              >
                {t("Reject")}
              </GradientButton>
            </Fragment>
          )
      : AcctMSTState?.formmodectx == "edit" &&
          AcctMSTState?.fromctx !== "new-draft" && (
            <GradientButton
              onClick={() => onFinalUpdatectx(true)}
              color="primary"
            >
              {t("Update")}
            </GradientButton>
          );
  }, [
    AcctMSTState?.currentFormctx.currentFormRefctx,
    formmode,
    AcctMSTState?.formmodectx,
    from,
    AcctMSTState?.fromctx,
    AcctMSTState?.modifiedFormCols,
  ]);

  useEffect(() => {
    if (
      AcctMSTState?.currentFormctx?.currentFormSubmitted ||
      Boolean(AcctMSTState?.isFinalUpdatectx)
    ) {
      const steps = AcctMSTState?.tabNameList.filter((tab) => tab.isVisible);
      const totalTab: any = Array.isArray(steps) && steps.length;
      // const isLastTab: boolean =AcctMSTState?.isFreshEntryctx
      //    &&
      //   totalTab - 1 === AcctMSTState?.colTabValuectx;
      const isLastTab: boolean = Boolean(
        totalTab - 1 === AcctMSTState?.colTabValuectx
      );
      if (formmode === "new") {
        if (isLastTab) {
          const ValidatereqPara = {
            IsNewRow: true,
            formData: AcctMSTState?.formDatactx,
            SCREEN_REF: docCD,
            mainIntialVals: AcctMSTState?.mainIntialVals,
          };
          validateAcctMutation.mutate(ValidatereqPara);
          // saveAcctMutation.mutate(reqPara);
        }
      } else if (formmode === "edit") {
        if (isLastTab || AcctMSTState?.isFinalUpdatectx) {
          const getUpdatedTabs = async () => {
            const { updated_tab_format } = await handleUpdatectx({
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              ACCT_TYPE: AcctMSTState?.accTypeValuectx ?? "",
              ACCT_CD: AcctMSTState?.acctNumberctx ?? "",
            });
            if (typeof updated_tab_format === "object") {
              // console.log(
              //   "asdqwezxc weoifhwoehfiwoehfwef",
              //   typeof updated_tab_format,
              //   updated_tab_format
              // );
              if (Object.keys(updated_tab_format)?.length === 0) {
                let buttonName = await MessageBox({
                  messageTitle: "Alert",
                  message: "YouHaveNotMadeAnyChangesYet",
                  buttonNames: ["Ok"],
                  icon: "WARNING",
                });
                if (buttonName === "Ok") {
                  handleCurrFormctx({
                    currentFormSubmitted: null,
                    isLoading: false,
                  });
                  onFinalUpdatectx(false);
                  handleModifiedColsctx({});
                  handleFormDataonSavectx({});
                  handleStepStatusctx({ reset: true });
                }
              } else if (Object.keys(updated_tab_format)?.length > 0) {
                let newRequest = {
                  BRANCH_CD: AcctMSTState?.rowBranchCodectx,
                  COMP_CD: authState?.companyID,
                  ACCT_TYPE: AcctMSTState?.accTypeValuectx,
                  ACCT_CD: AcctMSTState?.acctNumberctx,
                  CUSTOMER_ID:
                    AcctMSTState?.retrieveFormDataApiRes?.MAIN_DETAIL
                      ?.CUSTOMER_ID,
                  REQ_CD: AcctMSTState?.req_cd_ctx ?? "",
                  REQ_FLAG: AcctMSTState?.acctNumberctx ? "E" : "F",
                  SAVE_FLAG: "F",
                  ENTRY_TYPE: "",
                  IS_FROM_MAIN: "N",
                };
                let buttonName = await MessageBox({
                  messageTitle: "Confirmation",
                  message: "AreYouSureYouWantToApplyChangesAndUpdate",
                  buttonNames: ["Yes", "No"],
                  loadingBtnName: ["Yes"],
                  icon: "CONFIRM",
                });
                if (buttonName === "Yes") {
                  const validateReq = {
                    IsNewRow: false,
                    SCREEN_REF: docCD,
                    NEW_REQ_DATA: { ...newRequest },
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD: authState?.user?.branchCode ?? "",
                    ACCT_TYPE: AcctMSTState?.accTypeValuectx,
                    formData: AcctMSTState?.formDatactx,
                    oldData:
                      AcctMSTState?.retrieveFormDataApiRes?.["MAIN_DETAIL"],
                    oldDocData:
                      AcctMSTState?.retrieveFormDataApiRes?.["DOC_MST"],
                    oldJointData:
                      AcctMSTState?.retrieveFormDataApiRes?.[
                        "JOINT_ACCOUNT_DTL"
                      ],
                    updated_tab_format: updated_tab_format,
                    REQ_CD: AcctMSTState?.req_cd_ctx ?? "",
                  };
                  validateAcctMutation.mutate(validateReq);
                } else {
                  onFinalUpdatectx(false);
                }
              }
            }
          };
          getUpdatedTabs().catch((err) =>
            console.log("update error", err.message)
          );
        }
      }
      if (Boolean(!isLastTab && !AcctMSTState?.isFinalUpdatectx)) {
        toNextTab();
      }
    }
  }, [
    AcctMSTState?.currentFormctx.currentFormSubmitted,
    AcctMSTState?.isFinalUpdatectx,
  ]);

  // useEffect(() => {
  //   if(Boolean(AcctMSTState?.currentFormctx.currentFormSubmitted)) {
  //     const steps = AcctMSTState?.tabNameList.filter(tab => tab.isVisible)
  //     const totalTab:any = Array.isArray(steps) && steps.length;
  //     // console.log(AcctMSTState?.currentFormctx, "wkeuhjfiowehfiweuifh", AcctMSTState?.currentFormctx.currentFormSubmitted, "---- ", steps, totalTab)
  //     if((totalTab - 1) > AcctMSTState?.colTabValuectx) {
  //       handleCurrFormctx({
  //         colTabValuectx: AcctMSTState?.colTabValuectx + 1,
  //       })
  //       handleColTabChangectx(AcctMSTState?.colTabValuectx + 1);
  //     } else if(Boolean(AcctMSTState?.isFreshEntryctx && (totalTab - 1) === AcctMSTState?.colTabValuectx)) {
  //       const reqPara = {
  //         IsNewRow: true,
  //         REQ_CD: AcctMSTState?.req_cd_ctx,
  //         REQ_FLAG: "F",
  //         SAVE_FLAG: "F",
  //         CUSTOMER_ID: AcctMSTState?.customerIDctx,
  //         ACCT_TYPE: AcctMSTState?.accTypeValuectx,
  //         ACCT_CD: AcctMSTState?.acctNumberctx,
  //         COMP_CD: authState?.companyID ?? "",
  //         formData: AcctMSTState?.formDatactx,
  //         OP_DATE: authState?.workingDate,
  //       }
  //       // console.log("oifjwoiejfowiejf", reqPara)
  //       saveAcctMutation.mutate(reqPara)
  //     }

  //     // if(Boolean(AcctMSTState?.isFinalUpdatectx)) {
  //     //   const getUpdatedTabs = async () => {
  //     //     const {updated_tab_format, update_type} = await handleUpdatectx({
  //     //       COMP_CD: authState?.companyID ?? ""
  //     //     })
  //     //     if(typeof updated_tab_format === "object") {
  //     //       // console.log(update_type, "asdqwezxc weoifhwoehfiwoehfwef", typeof updated_tab_format, updated_tab_format)
  //     //       if (Object.keys(updated_tab_format)?.length === 0) {
  //     //           setAlertOnUpdate(true)
  //     //       } else if(Object.keys(updated_tab_format)?.length>0) {
  //     //         setUpdateDialog(true)
  //     //       }
  //     //     }
  //     //   }
  //     //   getUpdatedTabs().catch(err => console.log("update error", err.message))
  //     //   // if(Object.keys(AcctMSTState?.modifiedFormCols).length >0) {
  //     //   //   setUpdateDialog(true)
  //     //   //   // setCancelDialog(true)
  //     //   // } else {
  //     //   //   setAlertOnUpdate(true)
  //     //   // }
  //     // } else {
  //     //   if((totalTab - 1) > AcctMSTState?.colTabValuectx) {
  //     //     handleCurrFormctx({
  //     //       colTabValuectx: AcctMSTState?.colTabValuectx + 1,
  //     //     })
  //     //     handleColTabChangectx(AcctMSTState?.colTabValuectx + 1);
  //     //   }
  //     // }
  //   }
  // }, [AcctMSTState?.currentFormctx.currentFormSubmitted, AcctMSTState?.tabNameList, AcctMSTState?.isFinalUpdatectx])

  const steps: any = AcctMSTState?.tabsApiResctx.filter((tab) => tab.isVisible);

  const getTabComp = (tabName: string) => {
    switch (tabName) {
      case "MAIN":
        return <MainTab />; // MAIN_DETAIL
      case "TL":
        return <TermLoanTab />; // MAIN_DETAIL
      case "GDL":
        return <TermLoanTab />; // MAIN_DETAIL
      case "SB":
        return <SavingsDepositTab />; // MAIN_DETAIL
      case "CC":
        return <HypothicationTab />; // MAIN_DETAIL
      case "CA":
        return <CurrentTab />; // MAIN_DETAIL
      case "SH":
        return <ShareNominalTab />; // MAIN_DETAIL
      case "FD":
      case "FCUM":
      case "DFD":
        return <FixDepositTab />; // MAIN_DETAIL
      case "REC":
      case "RECD":
      case "RECM":
        return <RecurringTab />; // MAIN_DETAIL
      case "LOC":
        return <LockerTab />; // MAIN_DETAIL
      case "MOB_REG":
        return <MobileRegTab />; // MOBILE_REG_DTL
      case "REL_DTL":
        return <RelativeDtlTab />; // RELATIVE_DTL
      case "OTH_ADD":
        return <OtherAddTab />; // OTHER_ADDRESS_DTL
      case "DOC":
        return <Document />;
      case "JOINT":
        return <JointTab />; // JOINT_HOLDER_DTL
      case "NOMINEE":
        return <NomineeJointTab />; // JOINT_NOMINEE_DTL
      case "GUARDIAN":
        return <GuardianJointTab />; // JOINT_GUARDIAN_DTL
      case "GUARANTOR":
        return <GuarantorJointTab />; // JOINT_GUARANTOR_DTL
      case "COLL_DTL":
        return <CollateralJointTab />; // JOINT_HYPOTHICATION_DTL
      case "SIGNATORY":
        return <SignatoryJointTab />; // JOINT_SIGNATORY_DTL
      case "INTRODUCTOR":
        return <IntroductorJointTab />; // JOINT_INTRODUCTOR_DTL
      case "ADV_CONFIG":
        return <AdvConfig />;
      default:
        return <p>Not Found - {tabName}</p>;
    }
  };

  const openActionDialog = (state: string) => {
    setIsOpen(true);
    setConfirmAction(state);
  };

  const onEdit = () => {
    handleFromFormModectx({ formmode: "edit" });
  };

  return (
    <Dialog fullScreen={true} open={true}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <ExtractedHeader />
        <AppBar
          position="sticky"
          color="secondary"
          style={{
            top: "65px",
            background: "var(--theme-color5)",
            zIndex: "99",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {/* <GradientButton
              onClick={handleSidebarExpansionctx}
              sx={{
                border: "1px solid var(--theme-color2)",
                mx: "10px",
                height: "30px",
                minWidth: "30px !important",
                display: AcctMSTState?.isFreshEntryctx ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1.5rem", md: "1.2rem" },
                },
                visibility:
                  AcctMSTState?.tabsApiResctx &&
                  AcctMSTState?.tabsApiResctx.length > 0
                    ? "visible"
                    : "hidden",
              }}
            >
              {!AcctMSTState?.isSidebarExpandedctx ? (
                <MenuOutlinedIcon sx={{ color: "var(--theme-color2)" }} />
              ) : (
                <CancelIcon sx={{ color: "var(--theme-color2)" }} />
              )}
            </GradientButton> */}
            <Typography
              className={classes.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {from === "new-entry"
                ? t("newAcct")
                : from === "confirmation-entry"
                ? (`${row?.REQ_FLAG_DISP ?? ""} ${t("confirmAcct")}`)
                : formmode === "edit" && AcctMSTState?.allowEditctx === "Y"
                ? (`${row?.REQ_FLAG_DISP ?? ""} ${t("AcctModification")}`)
                : t("viewAcct")}
              {/* {state?.entityTypectx == "C"
                ? t("LegalEntry")
                : t("IndividualEntry")
              } */}
              {/* {AcctMSTState?.formmodectx === "view" && (
              <Chip
                style={{ color: "white", marginLeft: "8px" }}
                variant="outlined"
                color="primary"
                size="small"
                label={`view mode`}
              />
            )} */}
              {Boolean(AcctMSTState?.formmodectx) && (
                <Chip
                  style={{ color: "white", marginLeft: "8px" }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  label={`${AcctMSTState?.formmodectx} mode`}
                />
              )}
            </Typography>
            {AcctMSTState?.isFreshEntryctx && AcctMSTState?.lastAcctCdctx && (
              <Typography
                sx={{ whiteSpace: "nowrap", mr: 3 }}
                color="inherit"
                variant="subtitle2"
                component="div"
              >
                {`${t("LastOpenedAccountNumber")} : ${
                  AcctMSTState?.lastAcctCdctx
                }`}
              </Typography>
            )}
            {!AcctMSTState?.isFreshEntryctx &&
            AcctMSTState?.retrieveFormDataApiRes?.["MAIN_DETAIL"]
              ?.ENTERED_DATE ? (
              <Typography
                sx={{ whiteSpace: "nowrap", mr: "30px" }}
                color="inherit"
                variant="subtitle2"
                component="div"
              >{`Status: ${
                AcctMSTState?.retrieveFormDataApiRes?.["MAIN_DETAIL"]
                  ?.STATUS_DISP
              }\u00A0\u00A0||\u00A0Opening Date - ${
                Boolean(
                  AcctMSTState?.retrieveFormDataApiRes?.["MAIN_DETAIL"]?.OP_DATE
                )
                  ? format(
                      utilFunction.getParsedDate(
                        AcctMSTState?.retrieveFormDataApiRes?.["MAIN_DETAIL"]
                          ?.OP_DATE
                      ),
                      "dd/MM/yyyy"
                    )
                  : ""
              }`}</Typography>
            ) : AcctMSTState?.isFreshEntryctx ? (
              <Typography
                sx={{ whiteSpace: "nowrap", mr: "30px" }}
                color="inherit"
                variant="subtitle2"
                component="div"
              >{`Status: Open\u00A0\u00A0||\u00A0Opening Date - ${
                Boolean(authState?.workingDate)
                  ? format(
                      utilFunction.getParsedDate(authState?.workingDate),
                      "dd/MM/yyyy"
                    )
                  : ""
              }`}</Typography>
            ) : null}
            {/* {HeaderContent} */}

            {/* for checker, view-only */}
            {formmode === "edit" &&
              AcctMSTState?.allowReopenAcctctx === "Y" &&
              AcctMSTState?.formmodectx === "edit" && (
                <GradientButton onClick={onEdit} color={"primary"}>
                  {t("Reopen A/c")}
                </GradientButton>
              )}
            {formmode === "edit" &&
              AcctMSTState?.allowCloseAcctctx === "Y" &&
              AcctMSTState?.formmodectx === "edit" && (
                <GradientButton onClick={onEdit} color={"primary"}>
                  {t("Close A/c")}
                </GradientButton>
              )}
            {ActionBTNs}
            {formmode === "edit" &&
              AcctMSTState?.allowEditctx === "Y" &&
              AcctMSTState?.formmodectx !== "edit" && (
                <GradientButton onClick={onEdit} color={"primary"}>
                  {t("Edit")}
                </GradientButton>
              )}
            <GradientButton onClick={onCancelForm} color={"primary"}>
              {t("Close")}
            </GradientButton>
          </Toolbar>
        </AppBar>
        <AcctHeaderForm />
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Grid
            container
            sx={{ transition: "all 0.4s ease-in-out", px: 1 }}
            columnGap={(theme) => theme.spacing(1)}
          >
            {AcctMSTState?.tabsApiResctx &&
              AcctMSTState?.tabsApiResctx.length > 0 && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    position: "sticky",
                    top: 2,
                    zIndex: 1000,
                    backgroundColor: "var(--theme-color2)", // Ensures it doesn’t overlap
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    // padding: "10px",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TabStepper />
                </Grid>
              )}
            {/* 
    // Commented Code of Stepper Icon showing in Left side.
    <Grid
    container
    item
    xs="auto"
    sx={{
      display: AcctMSTState?.isFreshEntryctx ? "none" : "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "sticky",
      top: 175,
      height: "calc(95vh - 150px)",
      boxShadow: "inset 10px 2px 30px #eee",
      opacity:
        AcctMSTState?.tabsApiResctx &&
        AcctMSTState?.tabsApiResctx.length > 0
          ? 1
          : 0,
      transition: "opacity 0.4s ease-in-out",
      pointerEvents:
        AcctMSTState?.tabsApiResctx &&
        AcctMSTState?.tabsApiResctx.length > 0
          ? ""
          : "none",
      background: "var(--theme-color2)",
      // padding: "8px",
    }}
  >
    <CustomTabs
      sx={{ height: "calc(100% - 10px)", minWidth: "76px", "& .MuiTab-root": {
          minHeight: "50px",
        }, }}
      textColor="secondary"
      variant="scrollable"
      scrollButtons={false}
      orientation="vertical"
      value={AcctMSTState?.colTabValuectx}
      onChange={(e, newValue) => handleColTabChangectx(newValue)}
    >
      {steps &&
        steps.length > 0 &&
        steps.map((el: any, i) => {
          const isModified = Boolean(
            AcctMSTState?.steps?.[i] &&
              AcctMSTState?.steps?.[i]?.status === "completed"
          );
          const hasError = Boolean(
            AcctMSTState?.steps?.[i] &&
              AcctMSTState?.steps?.[i]?.status === "error"
          );
          const classNm = hasError
            ? "tab-error"
            : isModified
            ? "tab-modified"
            : "";
          return (
            <Tooltip
              key={el?.TAB_NAME}
              placement="left"
              title={
                AcctMSTState?.isSidebarExpandedctx ? "" : el?.TAB_DISPL_NAME
              }
            >
              <CustomTab
                className={classNm}
                isSidebarExpanded={AcctMSTState?.isSidebarExpandedctx}
                label={
                  <CustomTabLabel
                    IconName={el?.ICON}
                    isSidebarExpanded={AcctMSTState?.isSidebarExpandedctx}
                    tabLabel={el?.TAB_DISPL_NAME}
                    subtext={el?.TAB_DESC ?? ""}
                  />
                }
              />
            </Tooltip>
          );
        })}
    </CustomTabs>
  </Grid> */}
            <Grid
              item
              xs
              sx={{
                "& .MuiGrid-root": { padding: "0px" },
                // maxWidth: AcctMSTState?.isFreshEntryctx ? "inherit" : "auto",
                // overflow: "hidden", // Prevents grid overflow issues
                height: "100%", // Restrict height for scroll
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  // flex: 1,
                  overflowY: "auto", // Enables independent scrolling
                  // height: AcctMSTState?.isFreshEntryctx ? "85%" : "100%",
                  height: "85%",
                  // padding: "15px",
                  // minHeight: "400px",
                  // padding: "10px",
                }}
              >
                {isAcctDtlError ? (
                  <Alert
                    severity={AcctDtlError?.severity ?? "error"}
                    errorMsg={
                      AcctDtlError?.error_msg ?? "Something went wrong.."
                    }
                    errorDetail={AcctDtlError?.error_detail}
                    color="error"
                  />
                ) : validateAcctMutation.isError ? (
                  <Alert
                    severity={validateAcctMutation.error?.severity ?? "error"}
                    errorMsg={
                      validateAcctMutation.error?.error_msg ??
                      "Something went wrong.."
                    }
                    errorDetail={validateAcctMutation.error?.error_detail}
                    color="error"
                  />
                ) : saveAcctMutation.isError ? (
                  <Alert
                    severity={saveAcctMutation.error?.severity ?? "error"}
                    errorMsg={
                      saveAcctMutation.error?.error_msg ??
                      "Something went wrong.."
                    }
                    errorDetail={saveAcctMutation.error?.error_detail}
                    color="error"
                  />
                ) : modifyAcctMutation.isError ? (
                  <Alert
                    severity={modifyAcctMutation.error?.severity ?? "error"}
                    errorMsg={
                      modifyAcctMutation.error?.error_msg ??
                      "Something went wrong.."
                    }
                    errorDetail={modifyAcctMutation.error?.error_detail}
                    color="error"
                  />
                ) : (
                  confirmMutation.isError && (
                    <Alert
                      severity={confirmMutation.error?.severity ?? "error"}
                      errorMsg={
                        confirmMutation.error?.error_msg ??
                        "Something went wrong.."
                      }
                      errorDetail={confirmMutation.error?.error_detail}
                      color="error"
                    />
                  )
                )}
                {/* 🔹 Component Rendering */}
                {steps &&
                  steps.length > 0 &&
                  steps.map((element, i) => {
                    return (
                      <TabPanel
                        key={i}
                        value={AcctMSTState?.colTabValuectx}
                        index={i}
                      >
                        {getTabComp(element?.TAB_NAME)}
                      </TabPanel>
                    );
                  })}
              </div>
            </Grid>
          </Grid>

          <RemarksAPIWrapper
            TitleText={"Confirmation"}
            onActionNo={() => {
              setIsOpen(false);
              setConfirmAction(null);
            }}
            onActionYes={(val, rows) => {
              // console.log(val, "weiuifuhiwuefefgwef", rows)
              confirmMutation.mutate({
                REQUEST_CD: AcctMSTState?.req_cd_ctx ?? "",
                REMARKS: val ?? "",
                CONFIRMED: confirmAction,
              });
            }}
            isLoading={confirmMutation.isLoading || confirmMutation.isFetching}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={isOpen}
            rows={{}}
            isRequired={confirmAction === "Y" ? false : true}
            // isRequired={false}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default AcctModal;
