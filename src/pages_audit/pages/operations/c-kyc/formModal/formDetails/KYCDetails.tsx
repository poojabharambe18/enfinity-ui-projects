import { useRef, useState, useEffect, useContext, useMemo } from "react";
import { Grid, Typography, Collapse, IconButton, Dialog } from "@mui/material";
import { format } from "date-fns";
import {
  kyc_dup_reason_form,
  kyc_legal_proof_of_add_meta_data,
  kyc_proof_of_address_meta_data,
  kyc_proof_of_identity_meta_data,
} from "./metadata/individual/kycdetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../CkycContext";
import { company_info_meta_data } from "./metadata/legal/legalcompanyinfo";
import _ from "lodash";
import { AuthContext } from "pages_audit/auth";
import TabNavigate from "./formComponents/TabNavigate";
import {
  usePopupContext,
  MetaDataType,
  FormWrapper,
  utilFunction,
  GradientButton,
} from "@acuteinfo/common-base";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";

const KYCDetails = () => {
  const { t } = useTranslation();
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    toNextTab,
    handlePanDupReason,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [isPoIExpanded, setIsPoIExpanded] = useState(true);
  const [isPoAExpanded, setIsPoAExpanded] = useState(true);
  const KyCPoIFormRef = useRef<any>("");
  const KyCPoAFormRef = useRef<any>("");
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resolveDialog, setResolveDialog] = useState<any>("");
  const [currentTabFormData, setCurrentTabFormData] = useState({
    proof_of_identity: {},
    proof_of_address: {},
  });
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const { MessageBox } = usePopupContext();
  const handlePoIExpand = () => {
    setIsPoIExpanded(!isPoIExpanded);
  };
  const handlePoAExpand = () => {
    setIsPoAExpanded(!isPoAExpanded);
  };

  useEffect(() => {
    let refs = [KyCPoIFormRef, KyCPoAFormRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);
  useEffect(() => {
    if (
      Boolean(
        state?.currentFormctx.currentFormRefctx &&
          state?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        state?.currentFormctx.currentFormRefctx.length === formStatus.length
      ) {
        let submitted;
        submitted = formStatus.filter((form) => !Boolean(form));
        if (submitted && Array.isArray(submitted) && submitted.length > 0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: state?.colTabValuectx,
          });
          toNextTab();
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        });
        setFormStatus([]);
      }
    }
  }, [formStatus]);
  const POIMetadata =
    state?.entityTypectx === "I"
      ? kyc_proof_of_identity_meta_data
      : company_info_meta_data;
  const POAMetadata =
    state?.entityTypectx === "I"
      ? kyc_proof_of_address_meta_data
      : kyc_legal_proof_of_add_meta_data;

  const PoISubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      formFields = formFields.filter(
        (field) => !field.includes("_ignoreField")
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      let formData: any = _.pick(data, formFieldsRef.current);
      const dateFields: string[] = [
        "PASSPORT_ISSUE_DT",
        "PASSPORT_EXPIRY_DT",
        "DRIVING_LICENSE_ISSUE_DT",
        "DRIVING_LICENSE_EXPIRY_DT",
        "COMMENCEMENT_DT",
        "LIQUIDATION_DT",
      ];
      dateFields.forEach((field) => {
        if (Object.hasOwn(formData, field)) {
          formData[field] = Boolean(formData[field])
            ? format(utilFunction.getParsedDate(formData[field]), "dd-MMM-yyyy")
            : "";
        }
      });
      let newData = state?.formDatactx;
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx || state?.fromctx === "new-draft") {
        // on edit/view
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL
          ? _.uniq([
              ...tabModifiedCols.PERSONAL_DETAIL,
              ...formFieldsRef.current,
            ])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      setFormStatus((old) => [...old, true]);
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };
  const PoASubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      formFields = formFields.filter(
        (field) =>
          !(
            field.includes("_ignoreField") ||
            field.includes("DISTRICT_NM") ||
            field.includes("LOC_DISTRICT_NM")
          )
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      let formData = _.pick(data, formFieldsRef.current);
      // formData.SAME_AS_PER = Boolean(formData.SAME_AS_PER) ? "Y" : "N";
      let newData = state?.formDatactx;
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx || state?.fromctx === "new-draft") {
        // on edit/view
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL
          ? _.uniq([
              ...tabModifiedCols.PERSONAL_DETAIL,
              ...formFieldsRef.current,
            ])
          : _.uniq([...formFieldsRef.current]);
        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      setFormStatus((old) => [...old, true]);
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };
  const DupReasonFormubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    endSubmit(true);
    const dupPanReason = data?.PAN_DUP_REASON ?? "";
    handlePanDupReason(dupPanReason);
    handleDialogClose("Saved");
  };
  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.formDatactx["PERSONAL_DETAIL"]
      : state?.formDatactx["PERSONAL_DETAIL"]
      ? {
          ...(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}),
          CONTACT1:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT1 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT1 || ""),
          CONTACT2:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT2 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT2 || ""),
          CONTACT3:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT3 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT3 || ""),
          CONTACT4:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT4 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT4 || ""),
          CONTACT5:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT5 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT5 || ""),
          PAN_NO:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_PAN_NO ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PAN_NO || ""),
          ...(state?.formDatactx["PERSONAL_DETAIL"] ?? {}),
        }
      : {
          ...(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}),
          CONTACT1:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT1 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT1 || ""),
          CONTACT2:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT2 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT2 || ""),
          CONTACT3:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT3 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT3 || ""),
          CONTACT4:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT4 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT4 || ""),
          CONTACT5:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_CONTACT5 ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.CONTACT5 || ""),
          PAN_NO:
            state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.MASKED_PAN_NO ??
            (state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PAN_NO || ""),
        };
  }, [
    state?.isFreshEntryctx,
    state?.isDraftSavedctx,
    state?.retrieveFormDataApiRes,
  ]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [
      KyCPoIFormRef.current.handleSubmit(e, "save", false),
      KyCPoAFormRef.current.handleSubmit(e, "save", false),
    ];
    handleSavectx(e, refs);
  };

  const openDialogandReturnValue = () => {
    return new Promise((resolve) => {
      setResolveDialog(() => resolve);
      setDialogOpen(true);
    });
  };

  const handleDialogClose = (result) => {
    setDialogOpen(false);
    if (resolveDialog) {
      resolveDialog(result);
      setResolveDialog("");
    }
  };
  return (
    <Grid container rowGap={3}>
      <Grid
        sx={{
          backgroundColor: "var(--theme-color2)",
          padding: (theme) => theme.spacing(1),
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: "20px",
        }}
        container
        item
        xs={12}
        direction={"column"}
      >
        <Grid item>
          <Grid
            container
            item
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{ color: "var(--theme-color3)", pl: 2 }}
              variant={"h6"}
            >
              {state?.entityTypectx === "I"
                ? t("ProofOfIdentity")
                : "Company Info"}
            </Typography>
            <IconButton onClick={handlePoIExpand}>
              {!isPoIExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Grid>
        </Grid>
        <Collapse in={isPoIExpanded}>
          <Grid item xs={12}>
            <FormWrapper
              ref={KyCPoIFormRef}
              onSubmitHandler={PoISubmitHandler}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={
                "poi-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] +
                state?.formmodectx
              }
              metaData={POIMetadata as MetaDataType}
              formStyle={{}}
              hideHeader={true}
              formState={{
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                CATEG_CD: state?.categoryValuectx ?? "",
                CUSTOMER_ID: state?.customerIDctx ?? "",
                REQ_FLAG:
                  state?.isFreshEntryctx || state?.isDraftSavedctx ? "F" : "E",
                RESIDENCE_STATUS:
                  state?.formDatactx["PERSONAL_DETAIL"]?.RESIDENCE_STATUS ?? "",
                TIN_ISSUING_COUNTRY: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? "",
                TIN: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]?.TIN ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.TIN ?? "",
                MessageBox: MessageBox,
                asyncFunction: openDialogandReturnValue,
              }}
            />
          </Grid>
        </Collapse>
      </Grid>
      <Grid
        sx={{
          backgroundColor: "var(--theme-color2)",
          padding: (theme) => theme.spacing(1),
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: "20px",
        }}
        container
        item
        xs={12}
        direction={"column"}
      >
        <Grid
          container
          item
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography
            sx={{ color: "var(--theme-color3)", pl: 2 }}
            variant={"h6"}
          >
            {t("ProofOfAddress")}
          </Typography>
          <IconButton onClick={handlePoAExpand}>
            {!isPoAExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isPoAExpanded}>
          <Grid item>
            <FormWrapper
              ref={KyCPoAFormRef}
              onSubmitHandler={PoASubmitHandler}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={
                "poa-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] +
                state?.formmodectx
              }
              metaData={POAMetadata as MetaDataType}
              formStyle={{}}
              hideHeader={true}
              formState={{
                MessageBox: MessageBox,
                docCD: docCD,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                CATEG_CD: state?.categoryValuectx ?? "",
                CUSTOMER_ID: state?.customerIDctx ?? "",
                REQ_FLAG:
                  state?.isFreshEntryctx || state?.isDraftSavedctx ? "F" : "E",
              }}
            />
          </Grid>
        </Collapse>
      </Grid>
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
      />
      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          maxWidth="lg"
          PaperProps={{
            style: {
              minWidth: "50%",
              width: "50%",
              maxWidth: "80%",
            },
          }}
        >
          <FormWrapper
            key={"kyc-dup-reason-form"}
            metaData={kyc_dup_reason_form as MetaDataType}
            initialValues={initialVal}
            hideTitleBar={false}
            displayMode={state?.formmodectx}
            onSubmitHandler={DupReasonFormubmitHandler}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={() => handleDialogClose("Clear")}
                  color={"primary"}
                  disabled={isSubmitting}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </Dialog>
      )}
    </Grid>
  );
};

export default KYCDetails;
