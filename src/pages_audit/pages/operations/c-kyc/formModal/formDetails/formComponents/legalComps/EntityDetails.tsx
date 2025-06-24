import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Grid, Typography, IconButton, Collapse, Dialog } from "@mui/material";
import {
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import { entity_detail_legal_meta_data } from "../../metadata/legal/legalentitydetails";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { ckyc_retrieved_meta_data } from "pages_audit/pages/operations/c-kyc/metadata";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
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

const EntityDetails = () => {
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const PDFormRef = useRef<any>("");
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    handleApiRes,
    toNextTab,
  } = useContext(CkycContext);
  const [isPDExpanded, setIsPDExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const acctNmRef = useRef("");
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded);
  };

  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const onCloseSearchDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    let refs = [PDFormRef];
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
      let formData = _.pick(data, formFields);
      const dateFields: string[] = [
        "BIRTH_DT",
        "KYC_REVIEW_DT",
        "LEI_EXPIRY_DATE",
      ];
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
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        ENTRY_TYPE: "1",
      };
      newData["PERSONAL_DETAIL"] = {
        ...newData["PERSONAL_DETAIL"],
        ...formData,
        ...commonData,
      };
      handleFormDataonSavectx(newData);
      if (!state?.isFreshEntryctx) {
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
    return state?.isFreshEntryctx
      ? state?.formDatactx["PERSONAL_DETAIL"]
        ? state?.formDatactx["PERSONAL_DETAIL"]
        : {}
      : state?.retrieveFormDataApiRes
      ? state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [PDFormRef.current.handleSubmit(e, "save", false)];
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
            {t("EntityDetails")}
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
              metaData={entity_detail_legal_meta_data as MetaDataType}
              formStyle={{}}
              formState={{
                MessageBox: MessageBox,
                TIN_ISSUING_COUNTRY: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
                      ?.TIN_ISSUING_COUNTRY ?? "",
                TIN: state?.isFreshEntryctx
                  ? state?.formDatactx["PERSONAL_DETAIL"]?.TIN ?? ""
                  : state?.retrieveFormDataApiRes["PERSONAL_DETAIL"]?.TIN ?? "",
                WORKING_DATE: authState?.workingDate,
              }}
              hideHeader={true}
              displayMode={state?.formmodectx}
              controlsAtBottom={false}
              onFormButtonClickHandel={(fieldID, dependentFields) => {
                if (
                  fieldID === "SEARCH_BTN_ignoreField" &&
                  dependentFields?.SURNAME?.value
                ) {
                  if (dependentFields?.SURNAME?.value.trim().length > 0) {
                    if (
                      acctNmRef.current !==
                      dependentFields?.SURNAME?.value.trim()
                    ) {
                      acctNmRef.current =
                        dependentFields?.SURNAME?.value.trim();
                      let data = {
                        COMP_CD: authState?.companyID ?? "",
                        BRANCH_CD: authState?.user?.branchCode ?? "",
                        A_PARA: [
                          {
                            COL_NM: "ACCT_NM",
                            COL_VAL: dependentFields?.SURNAME?.value.trim(),
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

export const SearchListdialog = ({ open, onClose, acctNM }) => {
  const { authState } = useContext(AuthContext);

  // retrieve customer data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any,
    any
  >(["CustomerListAccountName", acctNM], () =>
    API.getRetrieveData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      A_PARA: [
        {
          COL_NM: "ACCT_NM",
          COL_VAL: acctNM,
        },
      ],
    })
  );

  const setCurrentAction = useCallback((data) => {
    if (data.name === "close") {
      onClose();
    }
  }, []);

  useEffect(() => {
    if (Boolean(ckyc_retrieved_meta_data.gridConfig.gridLabel)) {
      ckyc_retrieved_meta_data.gridConfig.gridLabel = "MatchNameCustomerID";
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
      {isError && (
        <Alert
          severity={error?.severity ?? "error"}
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`SearchListGrid`}
        finalMetaData={ckyc_retrieved_meta_data as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
    </Dialog>
  );
};

export default EntityDetails;
