import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "@mui/material";
import {
  extractMetaData,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import TabNavigate from "../../TabNavigate";
import _ from "lodash";
import { joint_tab_metadata } from "../../tabMetadata/jointTabMetadata";
import { AcctMSTContext } from "../../AcctMSTContext";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";
import { CreditWorthinessBtnGrid } from "../../buttonComponent/CreditWorthinessGrid";
import { format } from "date-fns";

const JointTab = () => {
  const {
    AcctMSTState,
    handleCurrFormctx,
    handleSavectx,
    handleStepStatusctx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
    handleCustFieldsReadOnlyctx,
  } = useContext(AcctMSTContext);
  const { MessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update
  const [openCreditWorthGrid, setOpenCreditWorthGrid] =
    useState<Boolean>(false);
  const [accountNumberDetails, setAccountNumberDetails] = useState<Object>({
    A_COMP_CD: "",
    A_BRANCH_CD: "",
    A_ACCT_TYPE: "",
    A_ACCT_CD: "",
    TAB: "",
  });

  useEffect(() => {
    handleCustFieldsReadOnlyctx(joint_tab_metadata);
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
      let newData = AcctMSTState?.formDatactx;
      if (data?.JOINT_HOLDER_DTL) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.JOINT_HOLDER_DTL[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (AcctMSTState?.isFreshEntryctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }
        let newFormatOtherAdd = data?.JOINT_HOLDER_DTL?.map((formRow, i) => {
          let formFields = Object.keys(formRow);
          formFields = formFields.filter(
            (field) => !field.includes("_ignoreField")
          );
          const formData = _.pick(data?.JOINT_HOLDER_DTL[i], formFields);
          const allFields = Object.keys(formData);
          const dateFields: string[] = ["EVENT_DT", "BIRTH_DATE"];
          const checkBoxFields: string[] = ["ACTIVE_FLAG"];
          allFields.forEach((field) => {
            if (dateFields.includes(field)) {
              formData[field] = Boolean(formData[field])
                ? format(
                    utilFunction.getParsedDate(formData[field]),
                    "dd/MMM/yyyy"
                  )
                : "";
            }
          });
          allFields.forEach((field) => {
            if (checkBoxFields.includes(field)) {
              formData[field] = Boolean(formData[field]) ? "Y" : "N";
            }
          });
          return {
            ...formData,
            // J_TYPE: "J",
          };
        });
        newData["JOINT_HOLDER_DTL"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_HOLDER_DTL: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["JOINT_HOLDER_DTL"] = [];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_HOLDER_DTL: [],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      }
      setFormStatus((old) => [...old, true]);
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: AcctMSTState?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    const dateFields: string[] = ["EVENT_DT", "BIRTH_DATE"];
    let formData: any = [
      ...(AcctMSTState?.retrieveFormDataApiRes["JOINT_HOLDER_DTL"] ?? []),
    ];
    if (
      !Boolean(AcctMSTState?.isFreshEntryctx) &&
      !Boolean(AcctMSTState?.formDatactx["JOINT_HOLDER_DTL"])
    ) {
      formData = formData.map((row) => {
        dateFields.forEach((field) => {
          if (Object.hasOwn(row, field)) {
            row[field] = Boolean(row[field])
              ? utilFunction.getParsedDate(row[field])
              : "";
          }
        });
        return { ...row, HIDDEN_CUSTOMER_ID: row?.CUSTOMER_ID ?? "" };
      });
    }
    return AcctMSTState?.isFreshEntryctx
      ? AcctMSTState?.formDatactx["JOINT_HOLDER_DTL"]?.length > 0
        ? {
            JOINT_HOLDER_DTL: [
              ...(AcctMSTState?.formDatactx["JOINT_HOLDER_DTL"] ?? []),
            ],
            HIDDEN_COMP_CD: authState?.companyID ?? "",
            HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
          }
        : {
            JOINT_HOLDER_DTL: [],
            HIDDEN_COMP_CD: authState?.companyID ?? "",
            HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
          }
      : AcctMSTState?.formDatactx["JOINT_HOLDER_DTL"]
      ? {
          JOINT_HOLDER_DTL: [
            ...(AcctMSTState?.formDatactx["JOINT_HOLDER_DTL"] ?? []),
          ],
          HIDDEN_COMP_CD: authState?.companyID ?? "",
          HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
        }
      : {
          JOINT_HOLDER_DTL: [...formData],
          HIDDEN_COMP_CD: authState?.companyID ?? "",
          HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
        };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes["JOINT_HOLDER_DTL"],
    AcctMSTState?.formDatactx["JOINT_HOLDER_DTL"],
  ]);

  return (
    <Grid>
      <FormWrapper
        key={"acct-mst-joint-tab-form" + initialVal + AcctMSTState?.formmodectx}
        ref={formRef}
        metaData={
          extractMetaData(
            joint_tab_metadata,
            AcctMSTState?.formmodectx
          ) as MetaDataType
        }
        onSubmitHandler={onFormSubmitHandler}
        formStyle={{
          height: "auto !important",
        }}
        formState={{
          docCD: docCD,
          PARAM320: AcctMSTState?.param320,
          ACCT_TYPE: AcctMSTState?.accTypeValuectx,
          MessageBox: MessageBox,
          formMode: AcctMSTState?.formmodectx,
          acctDtlReqPara: {
            MEM_ACCT_CD: {
              ACCT_TYPE: "JOINT_HOLDER_DTL.MEM_ACCT_TYPE",
              BRANCH_CD: "JOINT_HOLDER_DTL.PATH_SIGN",
              SCREEN_REF: docCD ?? "",
            },
          },
        }}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        onFormButtonClickHandel={async (id, dependentFields) => {
          if (id.slice(id.indexOf(".") + 1) === "CRDT_WORTHINESS_ignoreField") {
            setOpenCreditWorthGrid(true);
            setAccountNumberDetails({
              A_COMP_CD:
                dependentFields?.["JOINT_HOLDER_DTL.PATH_PHOTO"]?.value ?? "",
              A_BRANCH_CD:
                dependentFields?.["JOINT_HOLDER_DTL.PATH_SIGN"]?.value ?? "",
              A_ACCT_TYPE:
                dependentFields?.["JOINT_HOLDER_DTL.MEM_ACCT_TYPE"]?.value ??
                "",
              A_ACCT_CD:
                dependentFields?.["JOINT_HOLDER_DTL.MEM_ACCT_CD"]?.value ?? "",
              TAB: "JOINTTAB",
            });
          }
        }}
      ></FormWrapper>
      {openCreditWorthGrid && (
        <CreditWorthinessBtnGrid
          handleDialogClose={() => {
            setOpenCreditWorthGrid(false);
            setAccountNumberDetails({
              A_COMP_CD: "",
              A_BRANCH_CD: "",
              A_ACCT_TYPE: "",
              A_ACCT_CD: "",
              TAB: "",
            });
          }}
          accountNumberDetails={accountNumberDetails}
        />
      )}
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default JointTab;
