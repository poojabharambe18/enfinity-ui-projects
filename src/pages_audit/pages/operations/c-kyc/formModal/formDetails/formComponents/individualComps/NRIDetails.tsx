import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import {
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import { nri_detail_meta_data } from "../../metadata/individual/nridetails";
import { CkycContext } from "../../../../CkycContext";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import { format } from "date-fns";

const NRIDetails = () => {
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    toNextTab,
  } = useContext(CkycContext);
  const { t } = useTranslation();
  const NRIDTLFormRef = useRef<any>("");
  const { authState } = useContext(AuthContext);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  useEffect(() => {
    let refs = [NRIDTLFormRef];
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

  const NRIDTLSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    let formFields = Object.keys(data); // array, get all form-fields-name
    if (data && !hasError) {
      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
      const commonData = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "F",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      };
      let newData = state?.formDatactx;
      const dateFields: string[] = ["VISA_ISSUE_DT", "VISA_EXPIRY_DT"];
      dateFields.forEach((field) => {
        if (Object.hasOwn(data, field)) {
          data[field] = Boolean(data[field])
            ? format(utilFunction.getParsedDate(data[field]), "dd-MMM-yyyy")
            : "";
        }
      });
      newData["NRI_DTL"] = { ...newData["NRI_DTL"], ...data, ...commonData };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.NRI_DTL
          ? _.uniq([...tabModifiedCols.NRI_DTL, ...formFields])
          : _.uniq([...formFields]);
        tabModifiedCols = {
          ...tabModifiedCols,
          NRI_DTL: [...updatedCols],
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
    return state?.formDatactx["NRI_DTL"]
      ? state?.formDatactx["NRI_DTL"]
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["NRI_DTL"]
        ? state?.retrieveFormDataApiRes["NRI_DTL"]
        : {}
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [NRIDTLFormRef.current.handleSubmit(e, "save", false)];
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
            sx={{ color: "var(--theme-color3)", pl: 2, pt: "6px" }}
            variant={"h6"}
          >
            {t("NRIDetails")}
          </Typography>
        </Grid>
        <Grid container item>
          <Grid item xs={12}>
            <FormWrapper
              ref={NRIDTLFormRef}
              onSubmitHandler={NRIDTLSubmitHandler}
              key={
                "nri-details-form-kyc" +
                initialVal +
                +state?.retrieveFormDataApiRes["NRI_DTL"] +
                state?.formmodectx
              }
              metaData={nri_detail_meta_data as MetaDataType}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              formStyle={{}}
              hideHeader={true}
            />
          </Grid>
        </Grid>
      </Grid>
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
      />
    </Grid>
  );
};

export default NRIDetails;
