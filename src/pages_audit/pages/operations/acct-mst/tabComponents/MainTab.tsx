import {
  FormWrapper,
  MetaDataType,
  usePopupContext,
  extractMetaData,
  utilFunction,
} from "@acuteinfo/common-base";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { main_tab_metadata } from "../tabMetadata/mainTabMetadata";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import TabNavigate from "../TabNavigate";
import _ from "lodash";
import { AuthContext } from "pages_audit/auth";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";
import { format } from "date-fns";

const MainTab = () => {
  const {
    AcctMSTState,
    handlecustomerIDctx,
    handleCurrFormctx,
    handleStepStatusctx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
    handleSavectx,
    handleCustFieldsReadOnlyctx,
  } = useContext(AcctMSTContext);
  const { MessageBox } = usePopupContext();
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const formRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [ddwData, setDDWData] = useState([]);
  useEffect(() => {
    handleCustFieldsReadOnlyctx(main_tab_metadata);
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
      const dateFields: string[] = [
        "BIRTH_DT",
        "DATE_OF_RETIREMENT",
        "DATE_OF_DEATH",
        "UDYAM_REG_DT",
      ];
      dateFields.forEach((field) => {
        if (Object.hasOwn(formData, field)) {
          formData[field] = Boolean(formData[field])
            ? format(utilFunction.getParsedDate(formData[field]), "dd/MMM/yyyy")
            : "";
        }
      });
      const custID = formData?.CUSTOMER_ID ?? "";
      handlecustomerIDctx(custID);
      let newData = AcctMSTState?.formDatactx;
      const commonData = {
        IsNewRow: !AcctMSTState?.req_cd_ctx ? true : false,
        // COMP_CD: "",
        // ACCT_TYPE: AcctMSTState?.accTypeValuectx,
        // ACCT_CD: AcctMSTState?.acctNumberctx,
        // OP_DATE: authState?.workingDate,
        // CLOSE_DT: "",
        // STATUS: "",
        // CUSTOMER_ID: AcctMSTState?.customerIDctx,
        // CONFIRMED: "",
        // MOBILE_REG: "Y",
        // LEAN_TYPE: "0",
        // LEAN_AMT: "0",
        // ENTERED_DATE: authState?.workingDate,
        // RECOMMENDED_DESG: "04",
        // APPLY_DT: authState?.workingDate,
        // INS_START_DT: authState?.workingDate,
        // APPLIED_AMT: "0",
        // INST_RS: "0",
        // LAST_INST_DT: authState?.workingDate,
        // INSTALLMENT_TYPE: "M",
        // LIMIT_AMOUNT: "0",
        // DRAWING_POWER: "0",
        // DUE_AMT: "6",
        // DISBURSEMENT_DT: "21-02-1995",
        // CLOSE_REASON_CD: "001 ",
        // LST_STATEMENT_DT: "21-09-2012",
        // PREFIX_CD: "1",
        // HANDICAP_DESCIRPTION: "12345678901",
        // DOCKET_NO: "0",
        // INT_SKIP_FLAG: "N",
        // INT_SKIP_REASON_TRAN_CD: "3",
        // LOCKER_KEY_NO: "000003",
        // REF_COMP_CD: "132 ",
        // REF_BRANCH_CD: "099 ",
        // REF_ACCT_TYPE: "0030",
        // REF_ACCT_CD: "000001              ",
        // CHEQUE_NO: "0",
        // ACTION_TAKEN_CD: "1",
        // REQUEST_CD: "",
        // THROUGH_CHANNEL: "MOBILE",
        // RENRE_CD: "01  ",
        // INDUSTRY_CODE: "01  ",
        // BRANCH_CD: "",
        // REQ_FLAG: "",
        // REQ_CD: "",
        // SR_CD: "",
      };
      newData["MAIN_DETAIL"] = {
        // ...AcctMSTState?.mainIntialVals,
        ...newData["MAIN_DETAIL"],
        ...formData,
        ...commonData,
        ACCT_TYPE: AcctMSTState?.accTypeValuectx,
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
    const dateFields: string[] = [
      "BIRTH_DT",
      "DATE_OF_RETIREMENT",
      "DATE_OF_DEATH",
      "UDYAM_REG_DT",
    ];
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
    // console.log(
    //   AcctMSTState?.retrieveFormDataApiRes,
    //   "ewhfiuwhfwef",
    //   AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"]
    // );
    let AcctMstMainTab = AcctMSTState?.isFreshEntryctx
      ? {
          ...AcctMSTState?.formDatactx["MAIN_DETAIL"],
          MEM_ACCT_TYPE: authState.baseCompanyID ?? "",
          MEM_ACCT_CD: authState?.user?.baseBranchCode ?? "",
        }
      : AcctMSTState?.formDatactx["MAIN_DETAIL"]
      ? {
          ...(AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"] ?? {}),
          ...(AcctMSTState?.formDatactx["MAIN_DETAIL"] ?? {}),
        }
      : { ...formData };
    return {
      ...AcctMstMainTab,
      // MEM_ACCT_TYPE: authState.companyID ?? "",
      // MEM_ACCT_CD: authState?.user?.branchCode ?? "",
    };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes,
    AcctMSTState?.formDatactx["MAIN_DETAIL"],
  ]);

  main_tab_metadata.fields[10].label = AcctMSTState?.lf_noctx;
  main_tab_metadata.fields[10].render.componentType =
    AcctMSTState?.lf_noctx === "Minor/Major" ? "autocomplete" : "textField";
  main_tab_metadata.fields[10].isReadOnly =
    AcctMSTState?.lf_noctx === "Minor/Major" ? true : false;
  main_tab_metadata.fields[10].placeholder =
    AcctMSTState?.lf_noctx === "Minor/Major"
      ? "selectMinorMajor"
      : "EnterLedgerNo";
  main_tab_metadata.fields[10].maxLength =
    AcctMSTState?.lf_noctx === "Minor/Major" ? 0 : 8;

  return (
    <Grid>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onSubmitPDHandler}
        initialValues={{
          ...initialVal,
          HIDDEN_CUSTOMER_ID: initialVal?.CUSTOMER_ID ?? "",
        }}
        key={
          "acct-mst-main-tab-form" +
          initialVal +
          AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"] +
          AcctMSTState?.formmodectx +
          AcctMSTState?.accTypeValuectx
        }
        // metaData={main_tab_metadata as MetaDataType}
        metaData={
          extractMetaData(
            main_tab_metadata,
            AcctMSTState?.formmodectx
          ) as MetaDataType
        }
        formStyle={{}}
        formState={{
          docCD: docCD,
          PARAM320: AcctMSTState?.param320,
          ACCT_TYPE: AcctMSTState?.accTypeValuectx,
          MessageBox: MessageBox,
          handlecustomerIDctx: handlecustomerIDctx,
          LF_NO: AcctMSTState?.lf_noctx,
          IS_NBFC: AcctMSTState?.is_nbfcctx,
          CCTLCA: AcctMSTState?.cctlcactx,
          ddwData: ddwData,
          ALLOW_STATUS_EDIT:
            AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"]
              ?.ALLOW_STATUS_EDIT,
          STATUS_DDDW:
            AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"]?.STATUS_DDDW,
          customerIdFlag: false,
          RetrieveCustomerId:
            AcctMSTState?.retrieveFormDataApiRes["MAIN_DETAIL"]?.CUSTOMER_ID,
          VISIBLE_TRADE_INFO: AcctMSTState?.visibleTradeInfoctx,
          acctDtlReqPara: {
            SHARE_ACCT_CD: {
              ACCT_TYPE: "SHARE_ACCT_TYPE",
              BRANCH_CD: "MEM_ACCT_CD",
              SCREEN_REF: docCD ?? "",
            },
          },
        }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
        // setDataOnFieldChange={(action, payload, ...data) => {
        //   console.log("payload", action, payload, data);
        //   if (action === "RES_DATA") {
        //     handleDDWDataChange(payload);
        //   }
        // }}
      ></FormWrapper>
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default MainTab;
