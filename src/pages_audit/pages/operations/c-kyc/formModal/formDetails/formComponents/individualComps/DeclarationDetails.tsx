import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Typography, IconButton, Collapse } from "@mui/material";
import { format } from "date-fns";
import { declaration_meta_data } from "../../metadata/individual/declarationdetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import * as API from "../../../../api";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import { getdocCD } from "components/utilFunction/function";
import {
  Alert,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { useLocation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
const DeclarationDetails = () => {
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const { t } = useTranslation();
  const {
    state,
    handleFromFormModectx,
    onDraftSavectx,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleReqCDctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    handleFormDataonRetrievectx,
    toNextTab,
  } = useContext(CkycContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const DeclarationFormRef = useRef<any>("");
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [formStatus, setFormStatus] = useState<any[]>([]);
  useEffect(() => {
    let refs = [DeclarationFormRef];
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

  const mutation: any = useMutation(API.SaveAsDraft, {
    onSuccess: (data) => {
      CloseMessageBox();
      if (data?.[0]?.REQ_CD) {
        let req_cd = parseInt(data?.[0]?.REQ_CD) ?? "";
        handleReqCDctx(req_cd);
        handleFromFormModectx({ formmode: "edit", from: "new-draft" });
        onDraftSavectx();
        enqueueSnackbar(
          `${t("SavedAsDraftSuccessfully")} Request ID - ${parseInt(
            data?.[0]?.REQ_CD
          )}`,
          { variant: "success" }
        );
        let payload = {
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          REQUEST_CD: (req_cd || state?.req_cd_ctx) ?? "",
          CUSTOMER_ID: state?.customerIDctx ?? "",
          SCREEN_REF: docCD,
        };
        retrieveMutation.mutate(payload);
      } else {
        setFormStatus((old) => [...old, false]);
        console.log("not found req_cd on success", data);
      }
    },
    onError: (error: any) => {
      CloseMessageBox();
      setFormStatus((old) => [...old, false]);
    },
  });

  // get customer form details
  const retrieveMutation: any = useMutation(API.getCustomerDetailsonEdit, {
    onSuccess: (data) => {
      handleFormDataonRetrievectx(data[0]);
      handleFormDataonSavectx({});
      handleModifiedColsctx({});
      setFormStatus((old) => [...old, true]);
    },
    onError: (error: any) => {
      setFormStatus((old) => [...old, false]);
    },
  });

  const DeclarationSubmitHandler = async (
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
        (field) => !field.includes("_ignoreField") && field !== "AGE"
      ); // array, removed divider field
      formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]); // array, added distinct all form-field names
      let formData: any = _.pick(data, formFieldsRef.current);
      const dateFields: string[] = ["FATCA_DT", "DATE_OF_COMMENCEMENT"];
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
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.PERSONAL_DETAIL
          ? _.uniq([...tabModifiedCols.PERSONAL_DETAIL, ...formFields])
          : _.uniq([...formFields]);
        tabModifiedCols = {
          ...tabModifiedCols,
          PERSONAL_DETAIL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      if (!Boolean(state?.req_cd_ctx)) {
        const buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "DoYouWantToSaveEntryAsDraft",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
          icon: "CONFIRM",
        });
        if (buttonName === "Yes") {
          let payload = {
            CUSTOMER_TYPE: state?.entityTypectx,
            CATEGORY_CD: state?.categoryValuectx,
            ACCT_TYPE: state?.accTypeValuectx,
            KYC_NUMBER: state?.kycNoValuectx,
            CONSTITUTION_TYPE: state?.constitutionValuectx,
            IsNewRow: true,
            PERSONAL_DETAIL: state?.formDatactx?.PERSONAL_DETAIL,
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? "",
          };
          mutation.mutate(payload);
        } else if (buttonName === "No") {
          setFormStatus((old) => [...old, true]);
        }
      } else {
        setFormStatus((old) => [...old, true]);
      }
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };
  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [DeclarationFormRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };
  const [isDeclarationExpanded, setIsDeclarationExpanded] = useState(true);
  const handleDeclarationExpand = () => {
    setIsDeclarationExpanded(!isDeclarationExpanded);
  };
  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.formDatactx["PERSONAL_DETAIL"]
      : state?.formDatactx["PERSONAL_DETAIL"]
      ? {
          ...(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}),
          ...(state?.formDatactx["PERSONAL_DETAIL"] ?? {}),
        }
      : { ...(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}) };
  }, [
    state?.isFreshEntryctx,
    state?.isDraftSavedctx,
    state?.retrieveFormDataApiRes,
  ]);

  return (
    <Grid container rowGap={3}>
      {mutation.isError ? (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      ) : (
        retrieveMutation.isError && (
          <Alert
            severity={retrieveMutation.error?.severity ?? "error"}
            errorMsg={
              retrieveMutation.error?.error_msg ?? "Something went to wrong.."
            }
            errorDetail={retrieveMutation.error?.error_detail}
            color="error"
          />
        )
      )}
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
            {t("DeclarationDetails")}
          </Typography>
          <IconButton onClick={handleDeclarationExpand}>
            {!isDeclarationExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>

        <Collapse in={isDeclarationExpanded}>
          <Grid item>
            <FormWrapper
              ref={DeclarationFormRef}
              onSubmitHandler={DeclarationSubmitHandler}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={
                "declaration-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] +
                state?.formmodectx
              }
              metaData={declaration_meta_data as MetaDataType}
              formStyle={{}}
              formState={{
                // GSTIN: state?.isFreshEntryctx
                // ? state?.formDatactx["PERSONAL_DETAIL"]?.GSTIN ?? ""
                // : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.GSTIN ?? "",
                GSTIN:
                  state?.formDatactx["PERSONAL_DETAIL"]?.GSTIN ??
                  state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.GSTIN,
              }}
              hideHeader={true}
            />
          </Grid>
        </Collapse>
      </Grid>
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
      />
    </Grid>
  );
};

export default DeclarationDetails;
