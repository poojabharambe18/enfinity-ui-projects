import {
  extractMetaData,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { fixDeposit_tab_metadata } from "../tabMetadata/fixDepositMetadata";
import TabNavigate from "../TabNavigate";
import _ from "lodash";
import { format } from "date-fns";
import { getdocCD } from "components/utilFunction/function";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { useCommonFunctions } from "../function";

const FixDepositTab = () => {
  const {
    AcctMSTState,
    handleCurrFormctx,
    handleStepStatusctx,
    handleSavectx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
    handleCustFieldsReadOnlyctx,
  } = useContext(AcctMSTContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { showMessageBox } = useCommonFunctions();
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update

  useEffect(() => {
    handleCustFieldsReadOnlyctx(fixDeposit_tab_metadata);
  }, []);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [formRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };

  useEffect(() => {
    let refs = [formRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: AcctMSTState?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (
      Boolean(
        AcctMSTState?.currentFormctx.currentFormRefctx &&
          AcctMSTState?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        AcctMSTState?.currentFormctx.currentFormRefctx.length ===
        formStatus.length
      ) {
        setIsNextLoading(false);
        let submitted;
        submitted = formStatus.filter((form) => !Boolean(form));
        if (submitted && Array.isArray(submitted) && submitted.length > 0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: AcctMSTState?.colTabValuectx,
          });
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        });
        setFormStatus([]);
      }
    }
  }, [formStatus]);

  const onFormSubmitHandler = (
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
      const dateFields: string[] = ["INST_DUE_DT", "INST_RS"];
      const allFields = Object.keys(formData);
      allFields.forEach((field) => {
        if (dateFields.includes(field)) {
          formData[field] = Boolean(formData[field])
            ? format(utilFunction.getParsedDate(formData[field]), "dd/MMM/yyyy")
            : "";
        }
      });

      let newData = AcctMSTState?.formDatactx;
      const commonData = {
        IsNewRow: !AcctMSTState?.req_cd_ctx ? true : false,
        // COMP_CD: "",
        // BRANCH_CD: "",
        // REQ_FLAG: "",
        // REQ_CD: "",
        // SR_CD: "",
      };
      newData["MAIN_DETAIL"] = {
        ...newData["MAIN_DETAIL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!AcctMSTState?.isFreshEntryctx) {
        let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
        let updatedCols = tabModifiedCols.MAIN_DETAIL
          ? _.uniq([...tabModifiedCols.MAIN_DETAIL, ...formFieldsRef.current])
          : _.uniq([...formFieldsRef.current]);

        tabModifiedCols = {
          ...tabModifiedCols,
          MAIN_DETAIL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      // handleStepStatusctx({ status: "", coltabvalue: state?.colTabValuectx });
      setFormStatus((old) => [...old, true]);
      // if(state?.isFreshEntry) {
      // PODFormRef.current.handleSubmit(NextBtnRef.current, "save");
      // }
      // setIsNextLoading(false)
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: AcctMSTState?.colTabValuectx,
      });
      // setIsNextLoading(false);
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    const dateFields: string[] = ["INST_DUE_DT", "INST_RS"];
    let formData: any = {
      ...(AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"] ?? {}),
    };
    if (
      !Boolean(AcctMSTState?.isFreshEntryctx) &&
      !Boolean(AcctMSTState?.formDatactx["MAIN_DETAIL"])
    ) {
      dateFields.forEach((field) => {
        if (Object.hasOwn(formData, field)) {
          formData[field] = Boolean(formData[field])
            ? utilFunction.getParsedDate(formData[field])
            : "";
        }
      });
    }
    let AcctMstSavingTab = AcctMSTState?.isFreshEntryctx
      ? AcctMSTState?.formDatactx["MAIN_DETAIL"]
      : AcctMSTState?.formDatactx["MAIN_DETAIL"]
      ? {
          ...(AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"] ?? {}),
          ...(AcctMSTState?.formDatactx["MAIN_DETAIL"] ?? {}),
        }
      : { ...formData };
    return {
      ...AcctMstSavingTab,
      INT_TYPE: AcctMSTState?.defaultInterestTypectx ?? "",
    };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes,
    AcctMSTState?.formDatactx["MAIN_DETAIL"],
  ]);

  fixDeposit_tab_metadata.fields[2].render.componentType =
    AcctMSTState?.changeRelationshipCompctx === "Y"
      ? "autocomplete"
      : "textField";
  fixDeposit_tab_metadata.fields[2].placeholder =
    AcctMSTState?.changeRelationshipCompctx === "Y"
      ? "SelectRelationship"
      : "EnterRelationship";
  fixDeposit_tab_metadata.fields[2].maxLength =
    AcctMSTState?.changeRelationshipCompctx === "Y" ? 0 : 27;

  return (
    <Grid>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onFormSubmitHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={
          "acct-mst-fix-deposit-tab-form" +
          initialVal +
          AcctMSTState?.formmodectx
        }
        metaData={
          extractMetaData(
            fixDeposit_tab_metadata,
            AcctMSTState?.formmodectx
          ) as MetaDataType
        }
        formStyle={{
          height: "auto !important",
        }}
        formState={{
          GPARAM155: AcctMSTState?.gparam155,
          OPEN_FD: AcctMSTState?.displayFDDetailsctx,
          DISABLE_INT_RATE: AcctMSTState?.disableIntRatectx,
          DISABLE_PENAL_RATE: AcctMSTState?.disablePanelRatectx,
          DISABLE_AG_CLR_RATE: AcctMSTState?.disableAgClearingRatectx,
          DISABLE_INSU_DUE_RATE: AcctMSTState?.disableInsuDueRatectx,
          DISABLE_INT_TYPE: AcctMSTState?.disableInterestTypectx,
          DISABLE_CLASS_CD: AcctMSTState?.disableRiskCategoryctx,
          DISABLE_INST_DUE_DT: AcctMSTState?.disableInstDueDatectx,
          INT_RATE_BASE_ON: AcctMSTState?.setInterestRatectx,
          ACCT_TYPE: AcctMSTState?.accTypeValuectx,
          ACCT_CD: AcctMSTState?.acctNumberctx,
          BRANCH_CD: AcctMSTState?.rowBranchCodectx,
          CUSTOMER_ID: AcctMSTState?.formDatactx["MAIN_DETAIL"]?.CUSTOMER_ID,
          docCD: docCD,
          SHARE_ACCT_TYPE:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.SHARE_ACCT_TYPE ?? "",
          SHARE_ACCT_CD:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.SHARE_ACCT_CD ?? "",
          APPLIED_AMT:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.APPLIED_AMT ?? "",
          LIMIT_AMOUNT:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.LIMIT_AMOUNT ?? "",
          PURPOSE_CD:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.PURPOSE_CD ?? "",
          PTS: AcctMSTState?.formDatactx["MAIN_DETAIL"]?.PTS ?? "",
          SANCTION_DT:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.SANCTION_DT ?? "",
          RECOMMENED_NM:
            AcctMSTState?.formDatactx["MAIN_DETAIL"]?.RECOMMENED_NM ?? "",
          formMode: AcctMSTState?.formmodectx,
          MessageBox: MessageBox,
          showMessageBox: showMessageBox,
        }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default FixDepositTab;
