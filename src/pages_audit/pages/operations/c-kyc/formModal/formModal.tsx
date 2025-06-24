import * as React from "react";
import { useState, useContext, useEffect } from "react";
import {
  Typography,
  Grid,
  Chip,
  Tooltip,
  Dialog,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import { CustomTabs } from "../Ckyc";
import PersonalDetails from "./formDetails/formComponents/individualComps/PersonalDetails";
import KYCDetails from "./formDetails/KYCDetails";
import DeclarationDetails from "./formDetails/formComponents/individualComps/DeclarationDetails";
import RelatedPersonDetails from "./formDetails/formComponents/individualComps/RelatedPersonDetails";
import OtherDetails from "./formDetails/formComponents/individualComps/OtherDetails";
import OtherAddressDetails from "./formDetails/formComponents/individualComps/OtherAddressDetails";
import NRIDetails from "./formDetails/formComponents/individualComps/NRIDetails";
import AttestationDetails from "./formDetails/formComponents/individualComps/AttestationDetails";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CancelIcon from "@mui/icons-material/Cancel"; // close-icon
import { AuthContext } from "pages_audit/auth";
import * as API from "../api";
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../CkycContext";
import TabStepper from "./TabStepper";
import EntityDetails from "./formDetails/formComponents/legalComps/EntityDetails";
import ControllingPersonDTL from "./formDetails/formComponents/legalComps/ControllingPersonDTL";
import { useLocation } from "react-router-dom";
import Document from "./DocumentTab/Document";
import { format } from "date-fns";
import ExtractedHeader from "./ExtractedHeader";
import HeaderForm from "./HeaderForm";
import {
  Alert,
  RemarksAPIWrapper,
  GradientButton,
  queryClient,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";

import PhotoSign from "./formDetails/formComponents/individualComps/PhotoSign";
import { CustomTab, useDialogStyles } from "./style";
import { getdocCD } from "components/utilFunction/function";
export const CustomTabLabel = ({
  IconName,
  isSidebarExpanded,
  tabLabel,
  subtext,
}) => {
  const ApiIcon = Icons[IconName] ?? Icons["HowToReg"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "capitalize",
        // minWidth: "100px"
      }}
    >
      <div className="toggle_icon_container">
        <ApiIcon fontSize="large" />
      </div>
      {
        <div
          className="toggle_text_container"
          style={{
            display: isSidebarExpanded ? "block" : "none",
            transition: "width 0.4s, display 0.4s",
            transitionDelay: "0.5s",
          }}
        >
          <h4 style={{ margin: 0 }}>{tabLabel}</h4>
          {subtext.toString().length > 0 && (
            <p style={{ margin: 0 }}>{subtext}</p>
          )}
        </div>
      }
    </div>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other }: any = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid item xs sx={{ p: 1 }}>
          {children}
        </Grid>
      )}
    </div>
  );
}

export default function FormModal({ onClose, formmode, from }) {
  const {
    state,
    handleFormModalOpenctx,
    handleFormModalClosectx,
    handleSidebarExpansionctx,
    handleColTabChangectx,
    handleFormDataonRetrievectx,
    handleFormModalOpenOnEditctx,
    onFinalUpdatectx,
    handleCurrFormctx,
    handleUpdatectx,
    handleFromFormModectx,
    handleModifiedColsctx,
    handleFormDataonSavectx,
    handleStepStatusctx,
  } = useContext(CkycContext);
  const location: any = useLocation();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const classes = useDialogStyles();
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const closeForm = () => {
    handleFormModalClosectx();
    onClose();
  };

  // get customer form details
  const mutation: any = useMutation(API.getCustomerDetailsonEdit, {
    onSuccess: (data) => {
      handleFormDataonRetrievectx(data[0]);
    },
    onError: (error: any) => {},
  });

  // modify customer
  const modifyCustMutation: any = useMutation(API.updateCustomer, {
    onSuccess: async (data: any) => {
      const reqCD = Boolean(data?.[0]?.REQ_CD && parseInt(data?.[0]?.REQ_CD))
        ? parseInt(data?.[0]?.REQ_CD)
        : Boolean(state?.req_cd_ctx && parseInt(state?.req_cd_ctx))
        ? parseInt(state?.req_cd_ctx)
        : "";
      CloseMessageBox();
      handleCurrFormctx({
        currentFormSubmitted: null,
        isLoading: false,
      });
      onFinalUpdatectx(false);
      handleModifiedColsctx({});
      handleFormDataonSavectx({});
      const buttonName = await MessageBox({
        messageTitle: "SUCCESS",
        message: `${t("DataUpdatedSuccessfully")} Request ID - ${reqCD}`,
        icon: "SUCCESS",
        buttonNames: ["Ok"],
      });
      if (buttonName === "Ok") {
        handleStepStatusctx({ reset: true });
        closeForm();
        CloseMessageBox();
        queryClient.invalidateQueries({
          queryKey: ["ckyc", "getPendingTabData"],
        });
      }
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

  const confirmMutation: any = useMutation(API.ConfirmPendingCustomers, {
    onSuccess: async (data, variables) => {
      setIsOpen(false);
      const confirmed: string = variables?.CONFIRMED;
      const customerID = Boolean(
        data?.[0]?.CUSTOMER_ID && parseInt(data?.[0]?.CUSTOMER_ID)
      )
        ? parseInt(data?.[0]?.CUSTOMER_ID)
        : Boolean(state?.customerIDctx && parseInt(state?.customerIDctx))
        ? parseInt(state?.customerIDctx)
        : "";

      const reqId = Boolean(
        variables?.REQUEST_CD && parseInt(variables?.REQUEST_CD)
      )
        ? parseInt(variables?.REQUEST_CD)
        : Boolean(state?.req_cd_ctx && parseInt(state?.req_cd_ctx))
        ? parseInt(state?.req_cd_ctx)
        : "";
      const message =
        confirmed === "Y"
          ? `${t("ConfirmedSuccessfully")} Customer ID - ${customerID}`
          : confirmed === "M"
          ? `${t("SentForModificationSuccessfully")} Request ID - ${reqId}`
          : confirmed === "R"
          ? `${t("RejectedSuccessfully")} Request ID - ${reqId}`
          : "No Message";
      const buttonName = await MessageBox({
        messageTitle: "SUCCESS",
        message: message,
        icon: "SUCCESS",
        buttonNames: ["Ok"],
      });
      if (buttonName === "Ok") {
        closeForm();
        CloseMessageBox();
        queryClient.invalidateQueries({
          queryKey: ["ckyc", "getConfirmPendingData"],
        });
      }
    },
    onError: (error: any) => {
      setIsOpen(false);
      setConfirmAction(null);
    },
  });

  useEffect(() => {
    return () => {
      handleFormModalClosectx();
      queryClient.invalidateQueries({
        queryKey: ["ckyc", "getPendingTabData"],
      });
    };
  }, []);

  useEffect(() => {
    handleFromFormModectx({
      formmode: formmode === "edit" ? "view" : formmode,
      from,
    });
    if (location.state) {
      if (!state?.isDraftSavedctx && formmode) {
        if (formmode == "new") {
          handleFormModalOpenctx(location?.state?.entityType);
        } else {
          handleFormModalOpenOnEditctx(location?.state);
          let payload = {
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? "",
            REQUEST_CD: location.state?.[0]?.data.REQUEST_ID ?? "",
            CUSTOMER_ID: location.state?.[0]?.data.CUSTOMER_ID ?? "",
            SCREEN_REF: docCD,
          };
          mutation.mutate(payload);
        }
      }
    }
  }, [location]);

  const getIndividualTabComp = (tabName: string) => {
    switch (tabName) {
      case "Personal Details":
        return <PersonalDetails />;

      case "KYC Details":
        return <KYCDetails />;

      case "Declaration Details":
        return <DeclarationDetails />;

      case "KYC Document Upload":
        return <Document />;

      case "Photo & Signature Upload":
        return <PhotoSign />;

      case "Details of Related Person":
        return <RelatedPersonDetails />;

      case "More Details":
        return <OtherDetails />;

      case "Other Address":
        return <OtherAddressDetails />;

      case "NRI Details":
        return <NRIDetails />;

      case "Attestation Details":
        return (
          <AttestationDetails
            onFormClose={onClose}
            onUpdateForm={onUpdateForm}
          />
        );

      default:
        return <p>Not Found - {tabName}</p>;
    }
  };
  const getLegalTabComp = (tabName: string) => {
    switch (tabName) {
      case "Entity Details":
        return <EntityDetails />;

      case "KYC Details":
        return <KYCDetails />;

      case "Declaration Details":
        return <DeclarationDetails />;

      case "KYC Document Upload":
        return <Document />;

      case "Photo & Signature Upload":
        return <PhotoSign />;

      case "Details of Controlling Persons":
        return <ControllingPersonDTL />;

      case "More Details":
        return <OtherDetails />;

      case "Other Address":
        return <OtherAddressDetails />;

      case "NRI Details":
        return <NRIDetails />;

      case "Attestation Details":
        return (
          <AttestationDetails
            onFormClose={onClose}
            onUpdateForm={onUpdateForm}
          />
        );

      default:
        return <p>Not Found - {tabName}</p>;
    }
  };

  const openActionDialog = (state: string) => {
    setIsOpen(true);
    setConfirmAction(state);
  };

  const onUpdateForm = React.useCallback(
    async (e) => {
      const { updated_tab_format, update_type } = await handleUpdatectx({
        COMP_CD: authState?.companyID ?? "",
      });
      if (typeof updated_tab_format === "object") {
        if (Object.keys(updated_tab_format)?.length === 0) {
          let buttonName = await MessageBox({
            messageTitle: "Alert",
            message: "You have not made any changes yet.",
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
          let buttonName = await MessageBox({
            messageTitle: "CONFIRMATION",
            message: "Are you sure you want to apply changes and update ?",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
            icon: "CONFIRM",
          });
          if (buttonName === "Yes") {
            const payload = {
              COMP_CD: authState?.companyID ?? "",
              updated_tab_format: updated_tab_format,
              update_type: update_type,
              CUSTOMER_ID: state?.customerIDctx ?? "",
              REQ_CD: state?.req_cd_ctx ?? "",
              REQ_FLAG: state?.customerIDctx ? "E" : "F",
              SAVE_FLAG: state?.customerIDctx
                ? ""
                : update_type == "save_as_draft"
                ? "D"
                : update_type == "full_save"
                ? "F"
                : "",
              IsNewRow: !state?.req_cd_ctx ? true : false,
            };
            modifyCustMutation.mutate(payload);
          } else {
            onFinalUpdatectx(false);
          }
        }
      }
    },
    [
      state?.currentFormctx.currentFormRefctx,
      state?.modifiedFormCols,
      state?.formmodectx,
    ]
  );

  const onCancelForm = async () => {
    if (Boolean(state?.formmodectx) && state?.formmodectx !== "view") {
      if (Object.keys(state?.formDatactx).length > 0) {
        let buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "Your changes will be Lost. Are you Sure?",
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

  const ActionBTNs = React.useMemo(() => {
    return state?.formmodectx == "view"
      ? state?.fromctx && state?.fromctx === "confirmation-entry" && (
          <React.Fragment>
            <GradientButton
              onClick={() => openActionDialog("Y")}
              color="primary"
              style={{ minWidth: "fit-content" }}
            >
              {t("Confirm")}
            </GradientButton>
            {!Boolean(state?.customerIDctx) && (
              <GradientButton
                onClick={() => openActionDialog("M")}
                color="primary"
                style={{ minWidth: "fit-content" }}
              >
                {t("Raise Query")}
              </GradientButton>
            )}
            <GradientButton
              onClick={() => openActionDialog("R")}
              color="primary"
              style={{ minWidth: "fit-content" }}
            >
              {t("Reject")}
            </GradientButton>
          </React.Fragment>
        )
      : state?.formmodectx == "edit" && state?.fromctx !== "new-draft" && (
          <GradientButton
            onClick={onUpdateForm}
            color="primary"
            style={{ minWidth: "fit-content" }}
          >
            {t("Update")}
          </GradientButton>
        );
  }, [
    state?.currentFormctx.currentFormRefctx,
    state?.formmodectx,
    from,
    state?.fromctx,
    state?.modifiedFormCols,
  ]);

  const HeaderContent = React.useMemo(() => {
    return (
      <React.Fragment>
        {!state?.isFreshEntryctx &&
        state?.fromctx !== "new-draft" &&
        state?.retrieveFormDataApiRes ? (
          <Typography
            sx={{ whiteSpace: "nowrap", mx: "30px" }}
            // className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {state?.entityTypectx === "I" &&
            state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.IMAGE === "P"
              ? "Photo/Signature yet not scanned"
              : state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.IMAGE ===
                "N"
              ? "Photo/Signature Confirmation Pending"
              : null}
          </Typography>
        ) : (
          ""
        )}
        {!state?.isFreshEntryctx &&
        state?.fromctx !== "new-draft" &&
        state?.retrieveFormDataApiRes &&
        state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.BRANCH_CD ? (
          <Typography
            sx={{ whiteSpace: "nowrap", mx: "30px" }}
            // className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >{`Open from Branch - ${state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.BRANCH_CD}`}</Typography>
        ) : null}

        {!state?.isFreshEntryctx &&
        state?.fromctx !== "new-draft" &&
        state?.retrieveFormDataApiRes &&
        state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.ENTERED_DATE ? (
          <Typography
            sx={{ whiteSpace: "nowrap", mr: "30px" }}
            // className={classes.title}
            color="inherit"
            variant="subtitle2"
            component="div"
          >{`Opening Date - ${format(
            utilFunction.getParsedDate(
              state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.ENTERED_DATE
            ),
            "dd/MM/yyyy"
          )}`}</Typography>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }, [state?.retrieveFormDataApiRes]);

  const onEdit = () => {
    handleFromFormModectx({ formmode: "edit" });
  };

  const steps: any = state?.tabsApiResctx.filter((tab) => tab.isVisible);

  return (
    <Dialog fullScreen={true} open={true}>
      <ExtractedHeader />
      <AppBar
        position="sticky"
        color="secondary"
        style={{ top: "65px", background: "var(--theme-color5)", zIndex: "99" }}
      >
        <Toolbar variant="dense" sx={{ display: "flex", alignItems: "center" }}>
          <GradientButton
            onClick={handleSidebarExpansionctx}
            sx={{
              border: "1px solid var(--theme-color2)",
              mx: "10px",
              height: "30px",
              minWidth: "30px !important",
              display:
                state?.isFreshEntryctx || state?.fromctx === "new-draft"
                  ? "none"
                  : "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1.5rem", md: "1.2rem" },
              },
              visibility:
                state?.tabsApiResctx && state?.tabsApiResctx.length > 0
                  ? "visible"
                  : "hidden",
            }}
          >
            {!state?.isSidebarExpandedctx ? (
              <MenuOutlinedIcon sx={{ color: "var(--theme-color2)" }} />
            ) : (
              <CancelIcon sx={{ color: "var(--theme-color2)" }} />
            )}
          </GradientButton>
          <Typography
            className={classes.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            {state?.entityTypectx == "C"
              ? t("LegalEntry")
              : t("IndividualEntry")}
            {state?.formmodectx === "view" && (
              <Chip
                style={{ color: "white", marginLeft: "8px" }}
                variant="outlined"
                color="primary"
                size="small"
                label={`view mode`}
              />
            )}
          </Typography>
          {HeaderContent}

          {/* for checker, view-only */}
          {ActionBTNs}
          {formmode === "edit" && state?.formmodectx !== "edit" && (
            <GradientButton
              onClick={onEdit}
              color={"primary"}
              style={{ minWidth: "fit-content" }}
            >
              {t("Edit")}
            </GradientButton>
          )}
          <GradientButton
            onClick={onCancelForm}
            color="primary"
            style={{ minWidth: "fit-content" }}
            // disabled={mutation.isLoading}
          >
            {t("Close")}
          </GradientButton>
        </Toolbar>
      </AppBar>
      <HeaderForm />
      <Grid
        container
        sx={{ transition: "all 0.4s ease-in-out", px: 1 }}
        columnGap={(theme) => theme.spacing(1)}
      >
        {!Boolean(state?.isFreshEntryctx || state?.fromctx === "new-draft") && (
          <Grid
            container
            item
            xs="auto"
            sx={{
              display:
                state?.isFreshEntryctx || state?.fromctx === "new-draft"
                  ? "none"
                  : "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "sticky",
              top: 175,
              height: "calc(95vh - 150px)",
              boxShadow: "inset 10px 2px 30px #eee",

              opacity:
                state?.tabsApiResctx && state?.tabsApiResctx.length > 0 ? 1 : 0,
              transition: "opacity 0.4s ease-in-out",
              pointerEvents:
                state?.tabsApiResctx && state?.tabsApiResctx.length > 0
                  ? ""
                  : "none",
            }}
          >
            <CustomTabs
              sx={{ height: "calc(100% - 10px)", minWidth: "76px" }}
              textColor="secondary"
              variant="scrollable"
              scrollButtons={false}
              orientation="vertical"
              value={state?.colTabValuectx}
              onChange={(e, newValue) => handleColTabChangectx(newValue)}
            >
              {steps &&
                steps.length > 0 &&
                steps.map((el: any, i) => {
                  const isModified = Boolean(
                    state?.steps?.[i] &&
                      state?.steps?.[i]?.status === "completed"
                  );
                  const hasError = Boolean(
                    state?.steps?.[i] && state?.steps?.[i]?.status === "error"
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
                        state?.isSidebarExpandedctx ? "" : el?.TAB_DISPL_NAME
                      }
                    >
                      <CustomTab
                        className={classNm}
                        isSidebarExpanded={state?.isSidebarExpandedctx}
                        label={
                          <CustomTabLabel
                            IconName={el?.ICON}
                            isSidebarExpanded={state?.isSidebarExpandedctx}
                            tabLabel={el?.TAB_NAME}
                            subtext={el?.TAB_DESC ?? ""}
                          />
                        }
                      />
                    </Tooltip>
                  );
                  // }
                })}
            </CustomTabs>
          </Grid>
        )}
        <Grid
          sx={{
            "& .MuiGrid-root": {
              padding: "0px",
            },
            maxWidth: state?.formmodectx === "new" ? "inherit" : "auto",
            overflow: state?.formmodectx === "new" ? "inherit" : "hidden",
          }}
          item
          xs
        >
          {state?.tabsApiResctx &&
            state?.tabsApiResctx.length > 0 &&
            (state?.isFreshEntryctx || state?.fromctx === "new-draft") && (
              <TabStepper />
            )}
          {mutation.isError ? (
            <Alert
              severity={mutation.error?.severity ?? "error"}
              errorMsg={
                mutation.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          ) : modifyCustMutation.isError ? (
            <Alert
              severity={modifyCustMutation.error?.severity ?? "error"}
              errorMsg={
                modifyCustMutation.error?.error_msg ??
                "Something went to wrong.."
              }
              errorDetail={modifyCustMutation.error?.error_detail}
              color="error"
            />
          ) : (
            confirmMutation.isError && (
              <Alert
                severity={confirmMutation.error?.severity ?? "error"}
                errorMsg={
                  confirmMutation.error?.error_msg ??
                  "Something went to wrong.."
                }
                errorDetail={confirmMutation.error?.error_detail}
                color="error"
              />
            )
          )}
          {steps &&
            steps.length > 0 &&
            steps.map((element, i) => {
              return (
                <Box
                  sx={{
                    marginTop: state?.isFreshEntryctx ? "70px" : "0px",
                  }}
                >
                  <TabPanel key={i} value={state?.colTabValuectx} index={i}>
                    {state?.entityTypectx === "I"
                      ? getIndividualTabComp(element?.TAB_NAME)
                      : getLegalTabComp(element?.TAB_NAME)}
                  </TabPanel>
                </Box>
              );
            })}
        </Grid>
      </Grid>

      <RemarksAPIWrapper
        TitleText={
          confirmAction === "Y"
            ? "Confirm"
            : confirmAction === "M"
            ? "Raise Query"
            : confirmAction === "R" && "Rejection Reason"
        }
        onActionNo={() => {
          setIsOpen(false);
          setConfirmAction(null);
        }}
        onActionYes={(val, rows) => {
          confirmMutation.mutate({
            REQUEST_CD: state?.req_cd_ctx ?? "",
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
      />
    </Dialog>
  );
}
