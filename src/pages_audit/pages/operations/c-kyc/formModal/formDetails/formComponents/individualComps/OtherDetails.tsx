import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Grid, Typography, Collapse, IconButton } from "@mui/material";
import {
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import { other_details_meta_data } from "../../metadata/individual/otherdetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { CkycContext } from "../../../../CkycContext";
import { useTranslation } from "react-i18next";
import { AuthContext } from "pages_audit/auth";
import _ from "lodash";
import { other_details_legal_meta_data } from "../../metadata/legal/legalotherdetails";
import TabNavigate from "../TabNavigate";
import { format } from "date-fns";

const OtherDetails = () => {
  const { authState } = useContext(AuthContext);
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
  const OtherDTLFormRef = useRef<any>("");
  const [isOtherDetailsExpanded, setIsOtherDetailsExpanded] = useState(true);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const handleOtherDetailsExpand = () => {
    setIsOtherDetailsExpanded(!isOtherDetailsExpanded);
  };
  const otherDtlMetadata =
    state?.entityTypectx === "I"
      ? other_details_meta_data
      : other_details_legal_meta_data;

  useEffect(() => {
    let refs = [OtherDTLFormRef];
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
      } else {
        handleCurrFormctx({
          currentFormSubmitted: null,
          isLoading: false,
        });
        setFormStatus([]);
        handleStepStatusctx({
          status: "error",
          coltabvalue: state?.colTabValuectx,
        });
      }
    }
  }, [formStatus]);

  const OtherDTLSubmitHandler = (
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
      const formData = _.pick(data, formFields);

      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
      const dateFields: string[] = ["JOINING_DT", "RETIREMENT_DT"];
      dateFields.forEach((field) => {
        if (Object.hasOwn(formData, field)) {
          formData[field] = Boolean(formData[field])
            ? format(utilFunction.getParsedDate(formData[field]), "dd-MMM-yyyy")
            : "";
        }
      });
      // if (Boolean(formData["POLITICALLY_CONNECTED"])) {
      //   formData["POLITICALLY_CONNECTED"] = "Y";
      // } else {
      //   formData["POLITICALLY_CONNECTED"] = "N";
      // }

      // if (Boolean(formData["BLINDNESS"])) {
      //   formData["BLINDNESS"] = "Y";
      // } else {
      //   formData["BLINDNESS"] = "N";
      // }

      // if (Boolean(formData["REFERRED_BY_STAFF"])) {
      //   formData["REFERRED_BY_STAFF"] = "Y";
      // } else {
      //   formData["REFERRED_BY_STAFF"] = "N";
      // }

      let newData = state?.formDatactx;
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
      newData["OTHER_DTL"] = {
        ...newData["OTHER_DTL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.OTHER_DTL
          ? _.uniq([...tabModifiedCols.OTHER_DTL, ...formFields])
          : _.uniq([...formFields]);
        tabModifiedCols = {
          ...tabModifiedCols,
          OTHER_DTL: [...updatedCols],
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
    return state?.formDatactx["OTHER_DTL"]
      ? state?.formDatactx["OTHER_DTL"]
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["OTHER_DTL"]
        ? state?.retrieveFormDataApiRes["OTHER_DTL"]
        : {}
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [OtherDTLFormRef.current.handleSubmit(e, "save", false)];
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
            {t("OtherDetails")}
          </Typography>
          <IconButton onClick={handleOtherDetailsExpand}>
            {!isOtherDetailsExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isOtherDetailsExpanded}>
          <Grid item>
            <FormWrapper
              ref={OtherDTLFormRef}
              onSubmitHandler={OtherDTLSubmitHandler}
              key={
                "other-details-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["OTHER_DTL"] +
                state?.formmodectx
              }
              metaData={otherDtlMetadata as MetaDataType}
              displayMode={state?.formmodectx}
              initialValues={initialVal}
              formStyle={{}}
              hideHeader={true}
              formState={{
                WORKING_DATE: authState?.workingDate,
              }}
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

export default OtherDetails;
