import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Typography, Collapse, IconButton } from "@mui/material";
import { related_person_detail_data } from "../../metadata/individual/relatedpersondetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import { AuthContext } from "pages_audit/auth";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import {
  FormWrapper,
  MetaDataType,
  queryClient,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { format } from "date-fns";
import { useQuery } from "react-query";
import { getAttestData } from "pages_audit/pages/operations/c-kyc/api";
const RelatedPersonDetails = () => {
  const { t } = useTranslation();
  const { MessageBox } = usePopupContext();
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
  const RelPersonFormRef = useRef<any>("");
  const [isRelatedPDExpanded, setIsRelatedPDExpanded] = useState(true);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const handleRelatedPDExpand = () => {
    setIsRelatedPDExpanded(!isRelatedPDExpanded);
  };
  const {
    data: attestData,
    isError: isAttestDataError,
    isLoading: isAttestDataLoading,
    error: attestDataError,
    refetch: attestDataRefetch,
  } = useQuery<any, any>(
    ["getAttestData"],
    () =>
      getAttestData({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        CUSTOMER_ID: state?.customerIDctx,
        USER_NAME: authState?.user?.id ?? "",
      }),
    {
      enabled: state?.customerIDctx === "",
    }
  );
  useEffect(() => {
    let refs = [RelPersonFormRef];
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

  const RelPersonSubmitHandler2 = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "F",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        CONFIRMED: "N",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        ACTIVE: "Y",
      };
      // "new entry" && "minor customer" && "no row with guardian type"
      if (
        state?.isFreshEntryctx &&
        state?.formDatactx["PERSONAL_DETAIL"]?.LF_NO === "M" &&
        !(
          Array.isArray(data.RELATED_PERSON_DTL) &&
          data.RELATED_PERSON_DTL?.filter(
            (row) => row?.RELATED_PERSON_TYPE === "1 "
          )?.length > 0
        )
      ) {
        handleStepStatusctx({
          status: "error",
          coltabvalue: state?.colTabValuectx,
        });
        let buttonName = await MessageBox({
          messageTitle: "HOBranchValidMessageTitle",
          message: `InCaseOfMinorKYCAtleastOneRelatedPersonShouldHaveAsAGuardianOfMinor`,
          buttonNames: ["Ok"],
          icon: "ERROR",
        });
        setFormStatus((old) => [...old, false]);
      } else {
        if (data.RELATED_PERSON_DTL) {
          let filteredCols: any[] = [];
          filteredCols = Object.keys(data.RELATED_PERSON_DTL[0]);
          filteredCols = filteredCols.filter(
            (field) => !field.includes("_ignoreField")
          );
          if (state?.isFreshEntryctx) {
            filteredCols = filteredCols.filter(
              (field) => !field.includes("SR_CD")
            );
          }

          let newFormatRelPerDtl = data.RELATED_PERSON_DTL.map((formRow, i) => {
            let formFields = Object.keys(formRow);
            formFields = formFields.filter(
              (field) => !field.includes("_ignoreField")
            );
            // console.log("reltedaw formFields 2", formFields)
            const formData = _.pick(data.RELATED_PERSON_DTL[i], formFields);
            const dateFields: string[] = [
              "DRIVING_LICENSE_EXPIRY_DT",
              "PASSPORT_EXPIRY_DT",
              "IPV_DATE",
              "DATE_OF_DECLARE",
            ];
            dateFields.forEach((field) => {
              if (Object.hasOwn(formData, field)) {
                formData[field] = Boolean(formData[field])
                  ? format(
                      utilFunction.getParsedDate(formData[field]),
                      "dd-MMM-yyyy"
                    )
                  : "";
              }
            });
            // console.log("reltedaw formData", formData)
            return { ...formData, ...commonData };
          });
          newData["RELATED_PERSON_DTL"] = [...newFormatRelPerDtl];
          handleFormDataonSavectx(newData);
          if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
            let tabModifiedCols: any = state?.modifiedFormCols;
            tabModifiedCols = {
              ...tabModifiedCols,
              RELATED_PERSON_DTL: [...filteredCols],
            };
            handleModifiedColsctx(tabModifiedCols);
          }
        } else {
          newData["RELATED_PERSON_DTL"] = [];
          handleFormDataonSavectx(newData);
          if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
            let tabModifiedCols: any = state?.modifiedFormCols;
            tabModifiedCols = {
              ...tabModifiedCols,
              RELATED_PERSON_DTL: [],
            };
            handleModifiedColsctx(tabModifiedCols);
          }
        }
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

  const initialVal = useMemo(() => {
    return state?.formDatactx["RELATED_PERSON_DTL"]
      ? { RELATED_PERSON_DTL: state?.formDatactx["RELATED_PERSON_DTL"] }
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"]
        ? {
            RELATED_PERSON_DTL:
              state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"],
          }
        : {}
      : { RELATED_PERSON_DTL: [] };
  }, [
    state?.isFreshEntryctx,
    state?.isDraftSavedctx,
    state?.retrieveFormDataApiRes,
  ]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [RelPersonFormRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getAttestData"]);
    };
  }, []);
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
            {t("DetailsOfRelatedPerson")}
          </Typography>
          <IconButton onClick={handleRelatedPDExpand}>
            {!isRelatedPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>
        <Collapse in={isRelatedPDExpanded}>
          <Grid item>
            <FormWrapper
              ref={RelPersonFormRef}
              onSubmitHandler={RelPersonSubmitHandler2}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={
                "new-form-in-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"] +
                state?.formmodectx
              }
              metaData={related_person_detail_data as MetaDataType}
              formStyle={{}}
              formState={{
                MessageBox: MessageBox,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                CATEG_CD: state?.categoryValuectx ?? "",
                CUSTOMER_ID: state?.customerIDctx ?? "",
                REQ_FLAG:
                  state?.isFreshEntryctx || state?.isDraftSavedctx ? "F" : "E",
                RESIDENCE_STATUS:
                  state?.formDatactx["PERSONAL_DETAIL"]?.RESIDENCE_STATUS ?? "",
                attestData,
                state,
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

export default RelatedPersonDetails;
