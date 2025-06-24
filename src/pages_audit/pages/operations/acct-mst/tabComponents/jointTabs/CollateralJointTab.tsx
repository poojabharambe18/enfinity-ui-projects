import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "@mui/material";
import {
  extractMetaData,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { AcctMSTContext } from "../../AcctMSTContext";
import { AuthContext } from "pages_audit/auth";
import { collateraljoint_tab_metadata } from "../../tabMetadata/collateralJointMetadata";
import TabNavigate from "../../TabNavigate";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";
import { CreditWorthinessBtnGrid } from "../../buttonComponent/CreditWorthinessGrid";
import TermLoanButtons from "../../buttonComponent/TermLoanButtons";
import { OtherSecurityButton } from "../../buttonComponent/otherSecurityButton";
import { useMutation, useQuery } from "react-query";
import * as API from "../../api";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { format } from "date-fns";

const CollateralJointTab = () => {
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
  const [openForm, setOpenForm] = useState(false);
  const [openSecBtn, setSecBtn] = useState(false);
  const [buttonName, setButtonName] = useState("");
  const [openCreditWorthGrid, setOpenCreditWorthGrid] = useState(false);
  const [accountNumberDetails, setAccountNumberDetails] = useState<Object>({
    A_COMP_CD: "",
    A_BRANCH_CD: "",
    A_ACCT_TYPE: "",
    A_ACCT_CD: "",
    TAB: "",
  });

  const [optionData, setOptionData] = useState("");
  const [otherSecurityData, setOtherSecurityData] = useState([]);
  const [isData, setIsData] = useState({
    securityCode: [],
    securityType: [],
    securityOption: [],
    accountType: [],
    accountCd: [],
  });

  const getOtherSecurityBtnData = useMutation(API.getOtherSecurityBtnDetail, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: (data) => {
      setOtherSecurityData(data);
    },
  });
  useEffect(() => {
    handleCustFieldsReadOnlyctx(collateraljoint_tab_metadata);
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
      if (data?.JOINT_HYPOTHICATION_DTL) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.JOINT_HYPOTHICATION_DTL[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (AcctMSTState?.isFreshEntryctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }
        let newFormatOtherAdd = data?.JOINT_HYPOTHICATION_DTL?.map(
          (formRow, i) => {
            let formFields = Object.keys(formRow);
            formFields = formFields.filter(
              (field) => !field.includes("_ignoreField")
            );
            const formData = _.pick(
              data?.JOINT_HYPOTHICATION_DTL[i],
              formFields
            );
            const allFields = Object.keys(formData);
            const dateFields: string[] = [
              "BIRTH_DATE",
              "VALUATION_DT",
              "TITLE_CLEAR_DT",
            ];
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
            return {
              ...formData,
              // J_TYPE: "M",
            };
          }
        );
        newData["JOINT_HYPOTHICATION_DTL"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_HYPOTHICATION_DTL: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["JOINT_HYPOTHICATION_DTL"] = [];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_HYPOTHICATION_DTL: [],
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
    const dateFields: string[] = [
      "BIRTH_DATE",
      "VALUATION_DT",
      "TITLE_CLEAR_DT",
    ];
    let formData: any = [
      ...(AcctMSTState?.retrieveFormDataApiRes["JOINT_HYPOTHICATION_DTL"] ??
        []),
    ];
    if (
      !Boolean(AcctMSTState?.isFreshEntryctx) &&
      !Boolean(AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"])
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
      ? AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"]?.length > 0
        ? {
            JOINT_HYPOTHICATION_DTL: [
              ...(AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"] ?? []),
            ],
            HIDDEN_COMP_CD: authState?.companyID ?? "",
            HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
          }
        : {
            JOINT_HYPOTHICATION_DTL: [],
            HIDDEN_COMP_CD: authState?.companyID ?? "",
            HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
          }
      : AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"]
      ? {
          JOINT_HYPOTHICATION_DTL: [
            ...(AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"] ?? []),
          ],
          HIDDEN_COMP_CD: authState?.companyID ?? "",
          HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
        }
      : {
          JOINT_HYPOTHICATION_DTL: [...formData],
          HIDDEN_COMP_CD: authState?.companyID ?? "",
          HIDDEN_IsFreshEntry: AcctMSTState?.isFreshEntryctx ?? "",
        };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes["JOINT_HYPOTHICATION_DTL"],
    AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"],
  ]);
  const showErrorMessage = async (message) => {
    await MessageBox({
      messageTitle: "ValidationFailed",
      message: message,
      icon: "ERROR",
    });
  };
  return (
    <Grid>
      <FormWrapper
        key={
          "acct-mst-joint-hypothication-form" +
          initialVal +
          AcctMSTState?.formmodectx
        }
        ref={formRef}
        metaData={
          extractMetaData(
            collateraljoint_tab_metadata,
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
        }}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        onFormButtonClickHandel={async (id, dependentFields) => {
          const securityCd =
            dependentFields?.["JOINT_HYPOTHICATION_DTL.SECURITY_CD"] ?? "";
          const securityType =
            dependentFields?.["JOINT_HYPOTHICATION_DTL.SECURITY_TYPE"] ?? "";
          const securityOption =
            securityCd?.optionData?.[0]?.SECURITY_TYPE ?? "";
          const accountType =
            initialVal?.JOINT_HYPOTHICATION_DTL[0]?.ACCT_TYPE ?? "";
          const accountCd =
            initialVal?.JOINT_HYPOTHICATION_DTL[0]?.ACCT_CD ?? "";
          const SrCd = initialVal?.JOINT_HYPOTHICATION_DTL[0]?.SR_CD ?? "";
          setIsData({
            securityCode: securityCd,
            securityType: securityType?.value,
            securityOption: securityOption,
            accountType: accountType,
            accountCd: accountCd,
          });
          if (id.slice(id.indexOf(".") + 1) === "PROPERTY_ignoreField") {
            setOpenForm(true);
            setButtonName("PROPERTY");
          } else if (
            id.slice(id.indexOf(".") + 1) === "MACHINERY_ignoreField"
          ) {
            setOpenForm(true);
            setButtonName("MACHINERY");
          } else if (
            id.slice(id.indexOf(".") + 1) === "CRDT_WORTHINESS_ignoreField"
          ) {
            setOpenCreditWorthGrid(true);
            setAccountNumberDetails({
              A_COMP_CD:
                dependentFields?.["JOINT_HYPOTHICATION_DTL.PATH_PHOTO"]
                  ?.value ?? "",
              A_BRANCH_CD:
                dependentFields?.["JOINT_HYPOTHICATION_DTL.PATH_SIGN"]?.value ??
                "",
              A_ACCT_TYPE:
                dependentFields?.["JOINT_HYPOTHICATION_DTL.MEM_ACCT_TYPE"]
                  ?.value ?? "",
              A_ACCT_CD:
                dependentFields?.["JOINT_HYPOTHICATION_DTL.MEM_ACCT_CD"]
                  ?.value ?? "",
              TAB: "COLLATERALTAB",
            });
          }
          if (id.slice(id.indexOf(".") + 1) === "OTHRSECURITY_ignoreField") {
            if (!securityCd?.value?.length) {
              await showErrorMessage("Please Select Security Type");
            } else if (!securityType?.value?.length) {
              await showErrorMessage("Please Select Security");
            } else if (securityOption === "PRT") {
              await showErrorMessage(
                "User property button to enter Property details."
              );
            } else {
              const validSecurityOptions = [
                "VEH",
                "STK",
                "BDC",
                "SH",
                "OTH",
                "GOV",
                "LIC",
                "BRD",
                "BFD",
              ];
              if (validSecurityOptions.includes(securityOption)) {
                getOtherSecurityBtnData.mutate({
                  COMP_CD: authState?.companyID ?? "",
                  BRANCH_CD: authState?.user?.branchCode ?? "",
                  ACCT_TYPE: accountType ?? "",
                  ACCT_CD: accountCd ?? "",
                  SECURITY_CD: securityCd?.value ?? "",
                  SR_CD: SrCd ?? "",
                  SECURITY_TYPE: securityOption ?? "",
                  REQ_CD: AcctMSTState?.req_cd_ctx ?? "",
                });
                setSecBtn(true);
                setButtonName("OTHRSECURITY");
                setOptionData(securityOption ?? "");
              } else {
                setSecBtn(false);
              }
            }
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
      {openForm && (
        <TermLoanButtons
          closeDialog={() => {
            setOpenForm(false);
            setButtonName("");
          }}
          buttonName={buttonName}
        />
      )}
      {openSecBtn && (
        <OtherSecurityButton
          closeDialog={() => {
            setSecBtn(false);
            setButtonName("");
          }}
          optionData={optionData}
          buttonName={buttonName}
          isLoading={getOtherSecurityBtnData?.isLoading}
          otherSecurityData={otherSecurityData}
          isData={isData}
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

export default CollateralJointTab;
