import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog, Grid, Typography } from "@mui/material";
import {
  attest_history_meta_data,
  attestation_detail_meta_data,
} from "../../metadata/individual/attestationdetails";
import { CkycContext } from "../../../../CkycContext";
import { useTranslation } from "react-i18next";
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import {
  utilFunction,
  Alert,
  GridWrapper,
  GridMetaDataType,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  queryClient,
  GradientButton,
} from "@acuteinfo/common-base";
import { format } from "date-fns";
const actions = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const AttestationDetails = ({ onFormClose, onUpdateForm }) => {
  const [historyDialog, setHistoryDialog] = useState(false);
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    handleReqCDctx,
    handleFormModalClosectx,
    toNextTab,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const AttestationDTLFormRef = useRef<any>("");
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const onCloseSearchDialog = () => {
    setHistoryDialog(false);
  };

  useEffect(() => {
    let refs = [AttestationDTLFormRef];
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

  // attest.history
  const {
    data: historyData,
    isError: isHistoryDataError,
    isLoading: isHistoryDataLoading,
    error,
    refetch: historyDataRefetch,
  } = useQuery<any, any>(["getAttestHistory", state?.customerIDctx], () =>
    API.getAttestHistory({
      COMP_CD: authState?.companyID ?? "",
      // BRANCH_CD: authState?.user?.branchCode ?? "",
      CUSTOMER_ID: state?.customerIDctx,
    })
  );

  // get attest. form data
  const {
    data: attestData,
    isError: isAttestDataError,
    isLoading: isAttestDataLoading,
    error: attestDataError,
    refetch: attestDataRefetch,
  } = useQuery<any, any>(["getAttestData", state?.customerIDctx], () =>
    API.getAttestData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      CUSTOMER_ID: state?.customerIDctx ?? "",
      USER_NAME: authState?.user?.id ?? "",
    })
  );

  const docValidationMutation: any = useMutation(API.validateDocData, {
    onSuccess: async (data) => {
      // console.log("qwiwuiefhqioweuhfd", data?.[0]?.MESSAGE)
      if (data?.[0]?.MESSAGE) {
        let buttonName = await MessageBox({
          messageTitle: "Alert",
          message: data?.[0]?.MESSAGE,
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
          icon: "WARNING",
        });
        if (buttonName === "Yes") {
          onSave();
        } else if (buttonName === "No") {
          setFormStatus((old) => [...old, false]);
        }
      } else {
        onSave();
      }
    },
    onError: (error: any) => {
      setFormStatus((old) => [...old, false]);
    },
  });

  const mutation: any = useMutation(API.SaveEntry, {
    onSuccess: async (data) => {
      // console.log("data on save", data)
      CloseMessageBox();
      if (data?.[0]?.REQ_CD) {
        if (!Number.isNaN(data?.[0]?.REQ_CD)) {
          handleReqCDctx(parseInt(data?.[0]?.REQ_CD));
          setFormStatus((old) => [...old, true]);
          const buttonName = await MessageBox({
            messageTitle: "SUCCESS",
            message: `${t("SavedSuccessfully")} Request ID - ${
              parseInt(data?.[0]?.REQ_CD) ?? ""
            }`,
            icon: "SUCCESS",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            handleFormModalClosectx();
            onFormClose();
            CloseMessageBox();
            queryClient.invalidateQueries({
              queryKey: ["ckyc", "getPendingTabData"],
            });
          }
        }
        // handleReqCDctx(data?.[0]?.REQ_CD)
      }
    },
    onError: (error: any) => {
      CloseMessageBox();
      setFormStatus((old) => [...old, false]);
    },
  });

  const AttestationDTLSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let formFields = Object.keys(data); // array, get all form-fields-name
      // formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
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
      };
      const dateFields: string[] = ["IPV_DATE", "DATE_OF_DECLARE"];
      dateFields.forEach((field) => {
        if (Object.hasOwn(data, field)) {
          data[field] = Boolean(data[field])
            ? format(utilFunction.getParsedDate(data[field]), "dd-MMM-yyyy")
            : "";
        }
      });
      let newData = state?.formDatactx;
      newData["ATTESTATION_DTL"] = {
        ...newData["ATTESTATION_DTL"],
        ...data,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      handleStepStatusctx({
        status: "completed",
        coltabvalue: state?.colTabValuectx,
      });
      if (!state?.isFreshEntryctx && !state?.isDraftSavedctx) {
        let tabModifiedCols: any = state?.modifiedFormCols;
        let updatedCols = tabModifiedCols.ATTESTATION_DTL
          ? _.uniq([...tabModifiedCols.ATTESTATION_DTL, ...formFields])
          : _.uniq([...formFields]);
        tabModifiedCols = {
          ...tabModifiedCols,
          ATTESTATION_DTL: [...updatedCols],
        };
        handleModifiedColsctx(tabModifiedCols);
      }
      // if(!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
      //     setFormStatus(old => [...old, true])
      // } else {
      if (state?.isFreshEntryctx || state?.isDraftSavedctx) {
        // console.log("acdsvq currentFormctx mutateeee...", state?.steps)
        // if(state?.req_cd_ctx) {}
        // /customerServiceAPI/VALIDATEDOCDATA
        let submittedDoc = state?.formDatactx["DOC_MST"]?.["doc_mst_payload"];
        if (Array.isArray(submittedDoc)) {
          submittedDoc = submittedDoc?.map((docRow) => {
            return docRow?.TEMPLATE_CD ?? "";
          });
          submittedDoc = submittedDoc.toString();
        }

        let docValidatePayload = {
          PAN_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PAN_NO ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.PAN_NO ?? "",
          UNIQUE_ID: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.UNIQUE_ID ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.UNIQUE_ID ?? "",
          ELECTION_CARD_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                ?.ELECTION_CARD_NO ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.ELECTION_CARD_NO ?? "",
          NREGA_JOB_CARD: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                ?.NREGA_JOB_CARD ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.NREGA_JOB_CARD ?? "",
          PASSPORT_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.PASSPORT_NO ??
              ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.PASSPORT_NO ?? "",
          DRIVING_LICENSE_NO: state?.isDraftSavedctx
            ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                ?.DRIVING_LICENSE_NO ?? ""
            : state?.formDatactx["PERSONAL_DETAIL"]?.DRIVING_LICENSE_NO ?? "",
          TEMPLATE_CD: submittedDoc ?? "", //temp
          CUST_TYPE: state?.entityTypectx ?? "",
          // PAN_NO: "DWIPP9643D",
          // UNIQUE_ID: "123123123123",
          // ELECTION_CARD_NO: "",
          // NREGA_JOB_CARD: "",
          // PASSPORT_NO: "",
          // DRIVING_LICENSE_NO: "",
          // CUST_TYPE: state?.entityTypectx,
        };
        docValidationMutation.mutate(docValidatePayload);
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

  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx
      ? attestData
        ? { ...state?.formDatactx["ATTESTATION_DTL"], ...attestData?.[0] }
        : state?.formDatactx["ATTESTATION_DTL"]
      : state?.retrieveFormDataApiRes
      ? attestData
        ? {
            ...state?.retrieveFormDataApiRes["ATTESTATION_DTL"],
            ...attestData?.[0],
          }
        : state?.retrieveFormDataApiRes["ATTESTATION_DTL"]
      : null;
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes, attestData]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [AttestationDTLFormRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };

  const onSave = () => {
    if (state?.isFreshEntryctx || state?.isDraftSavedctx) {
      let data = {
        CUSTOMER_ID: state?.customerIDctx,
        CUSTOMER_TYPE: state?.entityTypectx,
        CATEGORY_CD: state?.categoryValuectx,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        ACCT_TYPE: state?.accTypeValuectx,
        KYC_NUMBER: state?.kycNoValuectx,
        CONSTITUTION_TYPE: state?.constitutionValuectx,
        IsNewRow:
          state?.isFreshEntryctx || state?.isDraftSavedctx ? true : false,
        REQ_CD: state?.req_cd_ctx,
        formData: state?.formDatactx,
        isDraftSaved: state?.isDraftSavedctx,
        updated_tab_format: {},
      };
      if (state?.isDraftSavedctx) {
        let oldFormData = _.pick(
          state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {},
          state?.modifiedFormCols["PERSONAL_DETAIL"] ?? []
        );
        let newFormData = _.pick(
          state?.formDatactx["PERSONAL_DETAIL"] ?? {},
          state?.modifiedFormCols["PERSONAL_DETAIL"] ?? []
        );
        let upd = utilFunction.transformDetailsData(newFormData, oldFormData);
        let updated_tabs = Object.keys(state?.modifiedFormCols ?? {});
        // console.log("weuifhwiuefhupdated_tabs", updated_tabs, Array.isArray(updated_tabs), updated_tabs.includes("PERSONAL_DETAIL"), updated_tabs["PERSONAL_DETAIL"])
        if (
          Array.isArray(updated_tabs) &&
          updated_tabs.includes("PERSONAL_DETAIL")
        ) {
          let updated_tab_format: any = {};
          updated_tab_format["PERSONAL_DETAIL"] = {
            ...upd,
            ..._.pick(
              state?.formDatactx["PERSONAL_DETAIL"],
              upd._UPDATEDCOLUMNS
            ),
            // ...other_data
            // IsNewRow: (state?.req_cd_ctx && state?.isDraftSavedctx) ? true : false,
            IsNewRow:
              state?.req_cd_ctx && state?.isDraftSavedctx ? false : true,
            REQ_CD: state?.req_cd_ctx ?? "",
            COMP_CD: authState?.companyID ?? "",
          };
          data["updated_tab_format"] = updated_tab_format;
          // console.log("on final saveeee", updated_tab_format)
        }
      }
      mutation.mutate(data);
    }
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getAttestData"]);
    };
  }, []);

  return (
    <Grid container rowGap={3}>
      {mutation.isError ? (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      ) : docValidationMutation.isError ? (
        <Alert
          severity={docValidationMutation.error?.severity ?? "error"}
          errorMsg={
            docValidationMutation.error?.error_msg ??
            "Something went to wrong.."
          }
          errorDetail={docValidationMutation.error?.error_detail}
          color="error"
        />
      ) : null}
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
          item
          container
          direction={"row"}
          style={{ justifyContent: "space-between" }}
        >
          <Typography
            sx={{ color: "var(--theme-color3)", pl: 2, pt: "6px" }}
            variant={"h6"}
          >
            {t("AttestationDetails")}
          </Typography>
          {!state?.isFreshEntryctx && !state?.isDraftSavedctx && (
            <GradientButton
              onClick={() => {
                if (!isHistoryDataLoading && historyData) {
                  setHistoryDialog(true);
                }
              }}
              color="primary"
            >
              {t("History")}
            </GradientButton>
          )}
        </Grid>
        <Grid container item>
          <Grid item xs={12}>
            <FormWrapper
              ref={AttestationDTLFormRef}
              onSubmitHandler={AttestationDTLSubmitHandler}
              initialValues={initialVal}
              displayMode={state?.formmodectx}
              key={
                "att-details-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["ATTESTATION_DTL"] +
                state?.formmodectx
              }
              metaData={attestation_detail_meta_data as MetaDataType}
              formStyle={{}}
              formState={{ attestData, state }}
              hideHeader={true}
            />
          </Grid>
        </Grid>
      </Grid>
      <TabNavigate
        handleSave={
          state?.formmodectx !== "new" && !state?.isDraftSavedctx
            ? onUpdateForm
            : handleSave
        }
        displayMode={state?.formmodectx ?? "new"}
      />
      {historyDialog && (
        <AttestHistory
          open={historyDialog}
          onClose={onCloseSearchDialog}
          data={historyData}
          isLoading={isHistoryDataLoading}
        />
      )}
    </Grid>
  );
};

const AttestHistory = ({ open, onClose, isLoading, data }) => {
  const setCurrentAction = useCallback((data) => {
    if (data.name === "close") {
      onClose();
    }
  }, []);
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
        },
      }}
    >
      <GridWrapper
        key={`AttestHistoryGrid`}
        finalMetaData={attest_history_meta_data as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading}
        actions={actions}
        setAction={setCurrentAction}
      />
    </Dialog>
  );
};

export default AttestationDetails;
