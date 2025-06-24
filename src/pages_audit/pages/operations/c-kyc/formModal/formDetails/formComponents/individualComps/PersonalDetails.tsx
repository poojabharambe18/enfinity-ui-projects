import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Typography, IconButton, Collapse } from "@mui/material";
import {
  extractMetaData,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { format } from "date-fns";
import {
  personal_detail_prefix_data,
  personal_other_detail_meta_data,
} from "../../metadata/individual/personaldetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import _ from "lodash";
import { AuthContext } from "pages_audit/auth";
import * as API from "../../../../api";
import { useMutation } from "react-query";
import { SearchListdialog } from "../legalComps/EntityDetails";
import TabNavigate from "../TabNavigate";
import { getdocCD } from "components/utilFunction/function";
import { useLocation } from "react-router-dom";
const PersonalDetails = () => {
  const { t } = useTranslation();
  const PDFormRef = useRef<any>("");
  const PODFormRef = useRef<any>("");
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    handleApiRes,
    handleAccTypeVal,
    toNextTab,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const [isPDExpanded, setIsPDExpanded] = useState(true);
  const [isOtherPDExpanded, setIsOtherPDExpanded] = useState(true);
  const acctNmRef = useRef("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update+
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const { MessageBox } = usePopupContext();
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded);
  };
  const handleOtherPDExpand = () => {
    setIsOtherPDExpanded(!isOtherPDExpanded);
  };
  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const onCloseSearchDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    let refs = [PDFormRef, PODFormRef];
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
          let newTabs = state?.tabsApiResctx;
          if (Array.isArray(newTabs) && newTabs.length > 0) {
            newTabs = newTabs.map((tab) => {
              if (tab.TAB_NAME === "NRI Details") {
                if (
                  state?.formDatactx.PERSONAL_DETAIL["RESIDENCE_STATUS"] ===
                    "02" ||
                  state?.formDatactx.PERSONAL_DETAIL["RESIDENCE_STATUS"] ===
                    "03"
                ) {
                  return { ...tab, isVisible: false };
                } else {
                  return { ...tab, isVisible: true };
                }
              } else {
                return tab;
              }
            });
            handleApiRes(newTabs);
          }
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

  const onSubmitPDHandler = (
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
      const formData = _.pick(data, formFieldsRef.current);
      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: "",
        BRANCH_CD: "",
        REQ_FLAG: "",
        REQ_CD: "",
        // SR_CD: "",
      };
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx || state?.fromctx === "new-draft") {
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
  const onSubmitPODHandler = (
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
      const dateFields: string[] = ["BIRTH_DT", "KYC_REVIEW_DT"];
      dateFields.forEach((field) => {
        if (Object.hasOwn(formData, field)) {
          formData[field] = Boolean(formData[field])
            ? format(utilFunction.getParsedDate(formData[field]), "dd-MMM-yyyy")
            : "";
        }
      });

      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        // COMP_CD: "",
        // BRANCH_CD: "",
        // REQ_FLAG: "",
        // REQ_CD: "",
        // // SR_CD: "",
      };
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx || state?.fromctx === "new-draft") {
        // let oldFormData = _.pick(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}, formFieldsRef.current)
        // let newFormData = _.pick(state?.formDatactx["PERSONAL_DETAIL"] ?? {}, formFieldsRef.current)
        // let upd = utilFunction.transformDetailsData(newFormData, oldFormData);
        // console.log("pod.", upd)
        // console.log("pod. old", oldFormData)
        // console.log("pod. new", newFormData)

        let tabModifiedCols: any = state?.modifiedFormCols;

        // for storing tab-wise updated cols
        // let updatedCols = tabModifiedCols.PERSONAL_DETAIL ? _.uniq([...tabModifiedCols.PERSONAL_DETAIL, ...upd._UPDATEDCOLUMNS]) : _.uniq([...upd._UPDATEDCOLUMNS])
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

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [
      PDFormRef.current.handleSubmit(e, "save", false),
      PODFormRef.current.handleSubmit(e, "save", false),
    ];
    handleSavectx(e, refs);
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
        <Grid
          container
          item
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography
            sx={{ color: "var(--theme-color3)", pl: 2 }}
            variant={"h6"}
          >
            {t("PersonalDetails")}
          </Typography>
          <IconButton onClick={handlePDExpand}>
            {!isPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isPDExpanded}>
          <Grid item>
            <FormWrapper
              ref={PDFormRef}
              onSubmitHandler={onSubmitPDHandler}
              initialValues={initialVal}
              key={
                "pd-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] +
                state?.formmodectx
              }
              metaData={personal_detail_prefix_data as MetaDataType}
              formState={{ state, docCD, MessageBox }}
              formStyle={{}}
              hideHeader={true}
              displayMode={state?.formmodectx}
              controlsAtBottom={false}
              onFormButtonClickHandel={(fieldID, dependentFields) => {
                if (
                  fieldID === "SEARCH_BTN_ignoreField" &&
                  dependentFields?.ACCT_NM?.value
                ) {
                  if (dependentFields?.ACCT_NM?.value.trim().length > 0) {
                    if (
                      acctNmRef.current !==
                      dependentFields?.ACCT_NM?.value.trim()
                    ) {
                      acctNmRef.current =
                        dependentFields?.ACCT_NM?.value.trim();
                      let data = {
                        COMP_CD: authState?.companyID ?? "",
                        BRANCH_CD: authState?.user?.branchCode ?? "",
                        A_PARA: [
                          {
                            COL_NM: "ACCT_NM",
                            COL_VAL: dependentFields?.ACCT_NM?.value.trim(),
                          },
                        ],
                      };
                      mutation.mutate(data);
                    }
                    setDialogOpen(true);
                  } else {
                    acctNmRef.current = "";
                  }
                }
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
            {t("OtherPersonalDetails")}
          </Typography>
          <IconButton onClick={handleOtherPDExpand}>
            {!isOtherPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isOtherPDExpanded}>
          <Grid item>
            <FormWrapper
              ref={PODFormRef}
              key={
                "pod-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] +
                state?.formmodectx
              }
              metaData={
                extractMetaData(
                  personal_other_detail_meta_data,
                  state?.formmodectx
                ) as MetaDataType
              }
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              formStyle={{}}
              formState={{
                CustomerType: state?.entityTypectx,
                handleAccTypeVal: handleAccTypeVal,
                WORKING_DATE: authState?.workingDate,
                MessageBox,
              }}
              hideHeader={true}
              onSubmitHandler={onSubmitPODHandler}
            />
          </Grid>
        </Collapse>
      </Grid>
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
      />
      {dialogOpen && (
        <SearchListdialog
          open={dialogOpen}
          onClose={onCloseSearchDialog}
          acctNM={acctNmRef.current}
        />
      )}
    </Grid>
  );
};

export default PersonalDetails;
