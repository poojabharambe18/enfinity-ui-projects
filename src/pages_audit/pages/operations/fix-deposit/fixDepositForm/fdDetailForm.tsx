import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FixDepositDetailFormMetadata } from "./metaData/fdDetailMetaData";
import { FDContext } from "../context/fdContext";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import {
  extractMetaData,
  usePopupContext,
  GradientButton,
  InitialValuesType,
  utilFunction,
  SubmitFnType,
  MetaDataType,
  FormWrapper,
  LoaderPaperComponent,
  queryClient,
  Alert,
  formatCurrency,
  getCurrencySymbol,
  usePropertiesConfigContext,
} from "@acuteinfo/common-base";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { getdocCD } from "components/utilFunction/function";
import { useCommonFunctions } from "../function";
import { FDDetailGridForArrayField } from "../fdDetailForArrayfieldGrid";
import { makeStyles } from "@mui/styles";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "var(--theme-color5)",
  },
  appbarTitle: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  paperContainer: {
    height: "100%",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  paper: {
    overflowY: "auto",
    flex: 1,
    border: "2px solid var(--theme-color4)",
    boxShadow: "none",
    maxHeight: "calc(60vh - 150px)",
  },
  gridPaper: {
    overflowY: "auto",
    border: "2px solid var(--theme-color4)",
    boxShadow: "none",
    maxHeight: "calc(38vh - 110px)",
    marginTop: "5px !important",
  },
  footerNote: {
    color: "rgb(128, 0, 57)",
    fontSize: "1rem",
    fontWeight: "500",
  },
  footerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "var(--theme-color4)  !important",
    padding: "0 10px",
    height: "30px",
  },
  footerTypo: {
    backgroundColor: "var(--theme-color4)  !important",
    fontWeight: "700",
    color: "var(--theme-color3)",
  },
  formControl: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    cursor: "pointer",
    "& .MuiRadio-root": {
      padding: "4px 9px",
    },
  },
}));

export const FDDetailForm = forwardRef<any, any>(
  (
    {
      defaultView,
      handleDialogClose,
      screenFlag,
      isDataChangedRef,
      openDepositForRenew,
      openNewFdForScheme,
      fdDetailArrayFGridDataRef,
      renewDetailsSubmitHandler,
      isMultipleFD,
      setIsMultipleFD,
    },
    ref: any
  ) => {
    const { FDState, updateFDDetailsFormData } = useContext(FDContext);
    const [fdDtlRefresh, setFdDtlRefresh] = useState<number>(0);
    const [totalCashAmount, setTotalCashAmount] = useState<number>(0);
    const [totalTrnsAmount, setTotalTrnsAmount] = useState<number>(0);
    const [gridData, setGridData] = useState<any>([]);
    const { state: rows }: any = useLocation();
    const finalSubmitDataRef = useRef<any>(null);
    const editingSRNORef = useRef<any>(null);
    const iniDtlFormDataNewFDRef = useRef<any>({});
    const initialRenDataRef = useRef<any>({});
    const { t } = useTranslation();
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const { authState } = useContext(AuthContext);
    let currentPath = useLocation().pathname;
    const docCD = getdocCD(currentPath, authState?.menulistdata);
    const { showMessageBox } = useCommonFunctions();
    const classes = useTypeStyles();
    const customParameter = usePropertiesConfigContext();
    const { dynamicAmountSymbol, currencyFormat, decimalCount } =
      customParameter;
    const [selectedOption, setSelectedOption] = useState("SF");

    const calculateTotalAmount = useCallback(() => {
      const totalCashAmt = gridData?.reduce((accum, obj) => {
        const cashAmt = Number(obj?.CASH_AMT ?? 0);
        return accum + cashAmt;
      }, 0);
      const formattedCashAmount = totalCashAmt.toFixed(2);
      setTotalCashAmount(formattedCashAmount);

      const totalTrnsAmt = gridData?.reduce((accum, obj) => {
        const trsfAmt = Number(obj?.TRSF_AMT ?? 0);
        return accum + trsfAmt;
      }, 0);
      const formattedTrnsAmount = totalTrnsAmt.toFixed(2);
      setTotalTrnsAmount(formattedTrnsAmount);
    }, [gridData]);

    useEffect(() => {
      if (defaultView === "new") {
        fdDetailArrayFGridDataRef.current = gridData;
        calculateTotalAmount();
      }
    }, [gridData, calculateTotalAmount, defaultView]);

    const {
      data: getMatDtForScheme,
      isLoading: getMatDtForSchemeLoading,
      isFetching: getMatDtForSchemeisFetching,
      isError: getMatDtForSchemeisError,
      error: getMatDtForSchemeError,
    } = useQuery<any, any>(
      ["getMatDtForScheme"],
      () =>
        API.getFDMaturityDtForScheme({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
          ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
          ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
          CATEG_CD: FDState?.acctNoData?.CATEG_CD ?? "",
          PERIOD_CD: openNewFdForScheme
            ? FDState?.schemeSelecRowData?.PERIOD_CD ?? ""
            : "",
          PERIOD_NO: FDState?.schemeSelecRowData?.PERIOD_NO ?? "",
          PERIOD_NO_HIDDEN: FDState?.schemeSelecRowData?.PERIOD_NO ?? "",
          TRAN_DT: format(new Date(), "dd/MMM/yyyy") ?? "",
          TRSF_AMT: "",
          MATURITY_DT: "",
          PRE_INT_FLAG: "N",
          PRINCIPAL_AMT: "",
        }),
      { enabled: Boolean(openNewFdForScheme) }
    );

    //Api for get para details
    const {
      data: paraDtlData,
      isLoading: paraDtlDataIsLoading,
      isError: paraDtlDataIsError,
      error: paraDtlDataError,
    } = useQuery<any, any>(
      ["getFDParaDetail"],
      () =>
        API.getFDParaDetail({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
          ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
          SCREEN_REF: docCD ?? "",
        }),
      {
        enabled:
          Boolean(openDepositForRenew) ||
          (getMatDtForScheme &&
            Boolean(openNewFdForScheme) &&
            defaultView === "new") ||
          (!getMatDtForScheme &&
            !Boolean(openNewFdForScheme) &&
            defaultView === "new"),
        onSuccess: (data) => {
          const iniDtlData = {
            ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
            BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
            ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
            FD_NO_DISABLED: data?.[0]?.FD_NO_DISABLED ?? "",
            INT_RATE_DISABLED: data?.[0]?.INT_RATE_DISABLED ?? "",
            MATURITY_AMT_DISABLED: data?.[0]?.MATURITY_AMT_DISABLED ?? "",
            TERM_CD_DISABLED: data?.[0]?.TERM_CD_DISABLED ?? "",
            TRAN_DT_DISABLED: data?.[0]?.TRAN_DT_DISABLED ?? "",
            FD_NO: data?.[0]?.FD_NO ?? "",
            TERM_CD: data?.[0]?.TERM_CD ?? "",
            TERM_CD_HIDDEN: data?.[0]?.TERM_CD ?? "",
            SPL_AMT: data?.[0]?.SPL_AMT ?? "",
            DOUBLE_TRAN: data?.[0]?.DOUBLE_TRAN ?? "",
            COMP_CD: authState?.companyID ?? "",
            CATEG_CD: FDState?.acctNoData?.CATEG_CD ?? "",
            AGG_DEP_CUSTID: openNewFdForScheme
              ? FDState?.schemeSelecRowData?.MAX_IN_CUST_ID ?? ""
              : FDState?.acctNoData?.AGG_DEP_CUSTID ?? "",
            DEP_FAC: openNewFdForScheme
              ? FDState?.schemeSelecRowData?.FACTOR ?? ""
              : FDState?.acctNoData?.DEP_FAC ?? "",
            PERIOD_CD: openNewFdForScheme
              ? FDState?.schemeSelecRowData?.PERIOD_CD ?? ""
              : "",
            PERIOD_CD_HIDDEN: openNewFdForScheme
              ? FDState?.schemeSelecRowData?.PERIOD_CD ?? ""
              : "",
            PERIOD_NO: openNewFdForScheme
              ? FDState?.schemeSelecRowData?.PERIOD_NO ?? ""
              : "",
            PERIOD_NO_HIDDEN: openNewFdForScheme
              ? FDState?.schemeSelecRowData?.PERIOD_NO ?? ""
              : "",
            NOMINEE_NM: FDState?.acctNoData?.NOMINEE_NM ?? "",
            MATURITY_DT: getMatDtForScheme?.[0]?.MATURITY_DT ?? "",
          };
          updateFDDetailsFormData(iniDtlData);
          initialRenDataRef.current = iniDtlData;
          iniDtlFormDataNewFDRef.current = iniDtlData;
        },
      }
    );

    //Api for get FD renew data
    const {
      data: renewData,
      isLoading: renewDataLoading,
      isFetching: renewDataisFetching,
      isError: renewDataisError,
      error: renewDataError,
    } = useQuery<any, any>(
      ["getFDRenewData"],
      () =>
        API.getFDRenewData({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
          SCREEN_REF: docCD ?? "",
          CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
          PAID_DT: FDState?.fdSavedPaymentData?.PAID_DT ?? "",
          PAID_FD_MAT_DT: rows?.[0]?.data?.MATURITY_DT
            ? format(new Date(rows?.[0]?.data?.MATURITY_DT), "dd/MMM/yyyy")
            : "",
          PERIOD_CD: rows?.[0]?.data?.PERIOD_CD ?? "",
          PERIOD_NO: rows?.[0]?.data?.PERIOD_NO ?? "",
          PRINCIPAL_AMT:
            Number(
              FDState?.fdSavedPaymentData?.TRANSFER_TOTAL_FOR_NEXT_FORM ?? 0
            ) - Number(FDState?.renewTrnsFormData?.RENEW_AMT ?? 0),
          WORKING_DATE: authState?.workingDate ?? "",
        }),
      { enabled: Boolean(paraDtlData) && Boolean(openDepositForRenew) }
    );

    //Api for get Maturity amount and Monthly int
    const {
      data: maturityAmtData,
      isLoading: maturityAmtDataLoading,
      isError: maturityAmtDataisError,
      error: maturityAmtDataError,
    } = useQuery<any, any>(
      ["getFDRenewMaturityAmt"],
      () =>
        API.getFDRenewMaturityAmt({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
          ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
          CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
          TRAN_DT: renewData?.[0]?.TRAN_DT
            ? format(new Date(renewData?.[0]?.TRAN_DT), "dd/MMM/yyyy")
            : "",
          TRSF_AMT: Number(
            FDState?.fdSavedPaymentData?.TRANSFER_TOTAL_FOR_NEXT_FORM ?? 0
          ),
          PERIOD_CD: rows?.[0]?.data?.PERIOD_CD ?? "",
          PERIOD_NO: rows?.[0]?.data?.PERIOD_NO ?? "",
          MATURITY_DT: renewData?.[0]?.MATURITY_DT
            ? format(new Date(renewData?.[0]?.MATURITY_DT), "dd/MMM/yyyy")
            : "",
          PRE_INT_FLAG: "N",
          PRINCIPAL_AMT: Number(
            FDState?.fdSavedPaymentData?.TRANSFER_TOTAL_FOR_NEXT_FORM ?? 0
          ),
          TERM_CD: paraDtlData?.[0]?.TERM_CD ?? "",
          INT_RATE: renewData?.[0]?.INT_RATE ?? "",
        }),
      {
        enabled:
          Boolean(paraDtlData) &&
          Boolean(openDepositForRenew) &&
          Boolean(renewData),
      }
    );

    //Mutation for Validate and Update FD details
    const validAndUpdateFDDtlMutation = useMutation(API.validAndUpdateFDDtl, {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "Error",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        enqueueSnackbar(t("DataUpdatedSuccessfully"), {
          variant: "success",
        });
        CloseMessageBox();
        handleDialogClose();
      },
    });

    //Mutation for save FD Lien details
    const saveFDLienEntryDtlMutation = useMutation(API.saveFDLienEntryDtl, {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "Error",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: () => {
        isDataChangedRef.current = true;
        enqueueSnackbar(t("RecordInsertedMsg"), {
          variant: "success",
        });
        CloseMessageBox();
        handleDialogClose();
      },
    });

    const onSubmitHandler: SubmitFnType = async (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);

      let newData = {
        CR_BRANCH_CD: data?.CR_BRANCH_CD ?? "",
        CR_ACCT_TYPE: data?.CR_ACCT_TYPE ?? "",
        CR_ACCT_CD: data?.CR_ACCT_CD ?? "",
        CR_ACCT_NM: data?.CR_ACCT_NM ?? "",
        MATURE_INST: data?.MATURE_INST ?? "",
        FD_NO: data?.FD_NO ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        NOMINEE_NM: data?.NOMINEE_NM ?? "",
        FD_REMARK: data?.FD_REMARK ?? "",
      };

      let oldData = {
        ...rows?.[0]?.data,
      };
      let upd = utilFunction?.transformDetailsData(newData, oldData);

      if (defaultView === "view" && screenFlag !== "openLienForm") {
        finalSubmitDataRef.current = {
          data: {
            ...newData,
            ...upd,
            IsNewRow: defaultView === "new" ? true : false,
            SCREEN_REF: docCD ?? "",
            COMP_CD: authState?.companyID ?? "",
            PAYMENT_TYPE: rows?.[0]?.data?.INT_PAYMENT_MODE ?? "",
            ...(Number(FDState?.acctNoData?.DEP_FAC) > 0
              ? { UNIT_AMOUNT: rows?.[0]?.data?.UNIT_AMOUNT ?? "" }
              : {}),
          },
        };

        if (finalSubmitDataRef.current?.data?._UPDATEDCOLUMNS?.length === 0) {
          return {};
        } else {
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: "Proceed?",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
            icon: "CONFIRM",
          });
          if (btnName === "Yes") {
            validAndUpdateFDDtlMutation?.mutate({
              ...finalSubmitDataRef.current?.data,
            });
          }
        }
      } else {
        const btnName = await MessageBox({
          messageTitle: "confirmation",
          message: "SaveData",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
          icon: "CONFIRM",
        });
        if (btnName === "Yes") {
          saveFDLienEntryDtlMutation?.mutate({
            ...data,
            LIEN_PARA: FDState?.checkAllowFDPayApiData?.LIEN_PARA ?? "",
            SCREEN_REF: docCD ?? "",
            COMP_CD: authState?.companyID ?? "",
          });
        }
      }
    };

    useEffect(() => {
      let label = utilFunction?.getDynamicLabel(
        currentPath,
        authState?.menulistdata,
        true
      );
      const label2 = `${label} of A/c No.: ${
        FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
      }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
        FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
      } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`;
      FixDepositDetailFormMetadata.form.label = Boolean(openDepositForRenew)
        ? t("RenewDepositDetails")
        : label2;
    }, []);

    const memoizedMetaData: any = useMemo(() => {
      return {
        ...FixDepositDetailFormMetadata,
        fields: FixDepositDetailFormMetadata?.fields.map((field) =>
          field?.name === "ROW_COUNT"
            ? {
                ...field,
                label: `Editing Row: ${editingSRNORef?.current?.SR_NO ?? ""}`,
              }
            : field
        ),
      };
    }, [gridData, editingSRNORef?.current?.SR_NO]);

    useEffect(() => {
      return () => {
        queryClient.removeQueries(["getFDRenewData"]);
        queryClient.removeQueries(["getFDParaDetail"]);
        queryClient.removeQueries(["getFDRenewMaturityAmt"]);
        queryClient.removeQueries(["getMatDtForScheme"]);
      };
    }, []);

    const carryForData = async () => {
      const btnName = await MessageBox({
        messageTitle: "Confirmation",
        message: "WanttoCarryForwardDataEnteredAndCreateNewFDWithSameDetails",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        icon: "CONFIRM",
      });

      if (btnName === "Yes") {
        setGridData((prev) => {
          const newRow = prev[prev?.length - 1];
          return [
            ...prev,
            {
              ...newRow,
              FD_NO: Number(newRow?.FD_NO) + 1,
              SR_NO: prev?.length + 1,
            },
          ];
        });

        const newRow = gridData[gridData?.length - 1];
        iniDtlFormDataNewFDRef.current = {
          ...iniDtlFormDataNewFDRef?.current,
          FD_NO: Number(newRow?.FD_NO) + 2,
        };
        editingSRNORef.current = null;
        setFdDtlRefresh((prev) => prev + 1);
      }
    };

    const handleRadioChange = async (event) => {
      const value = event.target.value;

      if (selectedOption === "SF" && value === "MF") {
        const btnName = await MessageBox({
          messageTitle: "Confirmation",
          message: "IfChangeToMultipleFDLoseDataFromSingleFDMsg",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          icon: "CONFIRM",
        });

        if (btnName === "Yes") {
          setSelectedOption(value);
          setIsMultipleFD(true);
        } else {
          setSelectedOption("SF");
        }
      } else if (selectedOption === "MF" && value === "SF") {
        const btnName = await MessageBox({
          messageTitle: "Confirmation",
          message: "IfChangeToSingleFDLoseDataFromMultipleFDMsg",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          icon: "CONFIRM",
        });
        if (btnName === "Yes") {
          setSelectedOption(value);
          setIsMultipleFD(false);
          setGridData([]);
          iniDtlFormDataNewFDRef.current = {
            ...initialRenDataRef?.current,
          };
        } else {
          setSelectedOption("MF");
        }
      }
    };

    return (
      <>
        {(paraDtlDataIsError ||
          renewDataisError ||
          maturityAmtDataisError ||
          getMatDtForSchemeisError) && (
          <Alert
            severity="error"
            errorMsg={
              maturityAmtDataError?.error_msg ||
              renewDataError?.error_msg ||
              paraDtlDataError?.error_msg ||
              getMatDtForSchemeError?.error_msg ||
              t("Somethingwenttowrong")
            }
            errorDetail={
              maturityAmtDataError?.error_detail ||
              renewDataError?.error_detail ||
              paraDtlDataError?.error_detail ||
              getMatDtForSchemeError?.error_detail
            }
            color="error"
          />
        )}
        {defaultView === "view" ? (
          <FormWrapper
            key={"FixDepositDetail" + defaultView}
            metaData={
              extractMetaData(
                FixDepositDetailFormMetadata,
                defaultView
              ) as MetaDataType
            }
            initialValues={
              {
                ...rows?.[0]?.data,
                LIEN_FLAG: rows?.[0]?.data?.LEAN_FLAG ?? "N",
                LEAN_COMP_CD:
                  rows?.[0]?.data?.LEAN_FLAG === "Y"
                    ? authState?.companyID ?? ""
                    : "",
                LEAN_BRANCH_CD:
                  rows?.[0]?.data?.LEAN_FLAG === "Y"
                    ? authState?.user?.branchCode ?? ""
                    : "",
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            ref={ref}
            formState={{
              MessageBox: MessageBox,
              docCD: docCD ?? "",
              defaultView: defaultView,
              screenFlag: screenFlag,
              workingDate: authState?.workingDate ?? "",
              showMessageBox: showMessageBox,
              ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
              acctDtlReqPara: {
                CR_ACCT_CD: {
                  ACCT_TYPE: "CR_ACCT_TYPE",
                  BRANCH_CD: "CR_BRANCH_CD",
                  SCREEN_REF: docCD ?? "",
                },
                LEAN_ACCT_CD: {
                  ACCT_TYPE: "LEAN_ACCT_TYPE",
                  BRANCH_CD: "LEAN_BRANCH_CD",
                  SCREEN_REF: docCD ?? "",
                },
              },
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton onClick={handleDialogClose} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        ) : Boolean(openDepositForRenew) ? (
          paraDtlDataIsLoading || maturityAmtDataLoading || renewDataLoading ? (
            <LoaderPaperComponent />
          ) : (
            <FormWrapper
              key={"FixDepositDetail" + defaultView}
              metaData={
                extractMetaData(
                  FixDepositDetailFormMetadata,
                  defaultView
                ) as MetaDataType
              }
              initialValues={
                {
                  ...rows?.[0]?.data,
                  ...paraDtlData?.[0],
                  PERIOD_NO_HIDDEN: rows?.[0]?.data?.PERIOD_NO ?? "",
                  TERM_CD_HIDDEN: paraDtlData?.[0]?.TERM_CD ?? "",
                  TRAN_DT_HIDDEN: renewData?.[0]?.TRAN_DT ?? "",
                  ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
                  BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
                  ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
                  TRAN_DT: renewData?.[0]?.TRAN_DT ?? "",
                  MATURITY_DT: renewData?.[0]?.MATURITY_DT ?? "",
                  INT_RATE: renewData?.[0]?.INT_RATE ?? "",
                  MATURITY_AMT: maturityAmtData?.[0]?.MATURITY_AMT ?? "",
                  TRSF_AMT: FDState?.renewTrnsFormData.RENEW_AMT ?? "",
                  CASH_AMT: "",
                  PERIOD_CD: rows?.[0]?.data?.PERIOD_CD ?? "",
                  PERIOD_CD_HIDDEN: rows?.[0]?.data?.PERIOD_CD ?? "",
                } as InitialValuesType
              }
              onSubmitHandler={renewDetailsSubmitHandler}
              formStyle={{
                background: "white",
                paddingTop: "0px",
              }}
              ref={ref}
              formState={{
                MessageBox: MessageBox,
                docCD: docCD ?? "",
                defaultView: defaultView,
                screenFlag: screenFlag,
                workingDate: authState?.workingDate ?? "",
                openDepositForRenew: openDepositForRenew,
                ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                showMessageBox: showMessageBox,
                acctDtlReqPara: {
                  CR_ACCT_CD: {
                    ACCT_TYPE: "CR_ACCT_TYPE",
                    BRANCH_CD: "CR_BRANCH_CD",
                    SCREEN_REF: docCD ?? "",
                  },
                  LEAN_ACCT_CD: {
                    ACCT_TYPE: "LEAN_ACCT_TYPE",
                    BRANCH_CD: "LEAN_BRANCH_CD",
                    SCREEN_REF: docCD ?? "",
                  },
                },
              }}
            />
          )
        ) : (Boolean(openNewFdForScheme) &&
            !getMatDtForScheme &&
            !paraDtlData) ||
          paraDtlDataIsLoading ? (
          <LoaderPaperComponent />
        ) : (
          <Stack className={classes?.paperContainer}>
            <RadioGroup
              value={selectedOption}
              onChange={handleRadioChange}
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: "0 0 0 8px",
              }}
            >
              {["SF", "MF"].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={
                    <Radio
                      sx={{
                        color: (selected) =>
                          selected ? "var(--theme-color1)" : "default",
                        "&.Mui-checked": {
                          color: "blue",
                        },
                      }}
                    />
                  }
                  label={option === "SF" ? "Single FD" : "Multiple FD"}
                  disableTypography
                  className={classes?.formControl}
                />
              ))}
            </RadioGroup>

            {selectedOption === "MF" ? (
              <>
                <Paper className={classes?.paper}>
                  <FormWrapper
                    key={
                      "FixDepositDetail" +
                      defaultView +
                      fdDtlRefresh +
                      editingSRNORef?.current
                    }
                    metaData={
                      extractMetaData(
                        memoizedMetaData,
                        defaultView
                      ) as MetaDataType
                    }
                    initialValues={
                      {
                        ...iniDtlFormDataNewFDRef?.current,
                      } as InitialValuesType
                    }
                    onSubmitHandler={() => {}}
                    hideHeader={true}
                    onFormButtonClickHandel={async (flag) => {
                      if (flag === "CANCEL") {
                        const newRow = gridData[gridData?.length - 1];
                        iniDtlFormDataNewFDRef.current = {
                          ...initialRenDataRef?.current,
                          FD_NO: Number(newRow?.FD_NO) + 1,
                        };
                        editingSRNORef.current = null;
                        setFdDtlRefresh((prev) => prev + 1);
                      } else {
                        const formData = await ref?.current?.getFieldData();

                        let formatedTranDate = formData?.TRAN_DT
                          ? format(new Date(formData?.TRAN_DT), "dd/MMM/yyyy")
                          : "";
                        let formatedWorkingDate = authState?.workingDate
                          ? format(
                              new Date(authState?.workingDate),
                              "dd/MMM/yyyy"
                            )
                          : "";

                        const requiredFields = [
                          { field: "BRANCH_CD" },
                          { field: "ACCT_TYPE" },
                          { field: "ACCT_CD" },
                          { field: "TRAN_DT" },
                          { field: "PERIOD_CD" },
                          { field: "PERIOD_NO" },
                          { field: "INT_RATE" },
                          { field: "TERM_CD" },
                          { field: "MATURITY_AMT" },
                        ];
                        for (let { field } of requiredFields) {
                          if (
                            !formData[field]?.trim() ||
                            (field === "MATURITY_AMT" &&
                              parseFloat(formData[field]?.trim()) <= 0) ||
                            formatedTranDate > formatedWorkingDate ||
                            !formData ||
                            Object.keys(formData).length === 0
                          ) {
                            return;
                          }
                        }

                        if (flag === "ADDNEWROW") {
                          setGridData((prev) => {
                            return [
                              ...prev,
                              {
                                ...formData,
                                SR_NO: prev?.length + 1,
                              },
                            ];
                          });
                          iniDtlFormDataNewFDRef.current = {
                            ...initialRenDataRef?.current,
                            FD_NO:
                              Number(iniDtlFormDataNewFDRef?.current?.FD_NO) +
                              1,
                          };
                          setFdDtlRefresh((prev) => prev + 1);
                        } else if (flag === "UPDATE") {
                          const rowSRNo = editingSRNORef?.current?.SR_NO;

                          const rowIndex = gridData?.findIndex(
                            (item) => item?.SR_NO === rowSRNo
                          );
                          if (rowIndex !== -1) {
                            setGridData((prev) => {
                              const updatedGridData = [...prev];
                              updatedGridData[rowIndex] = {
                                ...updatedGridData[rowIndex],
                                ...formData,
                              };
                              return updatedGridData;
                            });
                          }
                          const newRow = gridData[gridData.length - 1];
                          iniDtlFormDataNewFDRef.current = {
                            ...initialRenDataRef?.current,
                            FD_NO: Number(newRow?.FD_NO) + 1,
                          };
                          editingSRNORef.current = null;
                        }
                      }
                      return;
                    }}
                    formStyle={{
                      background: "white",
                      paddingTop: "0px",
                    }}
                    ref={ref}
                    formState={{
                      MessageBox: MessageBox,
                      docCD: docCD ?? "",
                      defaultView: defaultView,
                      workingDate: authState?.workingDate ?? "",
                      ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                      BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                      showMessageBox: showMessageBox,
                      CloseMessageBox: CloseMessageBox,
                      editingSRNORef: editingSRNORef?.current,
                      acctDtlReqPara: {
                        CR_ACCT_CD: {
                          ACCT_TYPE: "CR_ACCT_TYPE",
                          BRANCH_CD: "CR_BRANCH_CD",
                          SCREEN_REF: docCD ?? "",
                        },
                        LEAN_ACCT_CD: {
                          ACCT_TYPE: "LEAN_ACCT_TYPE",
                          BRANCH_CD: "LEAN_BRANCH_CD",
                          SCREEN_REF: docCD ?? "",
                        },
                      },
                      openDepositForRenew: Boolean(openDepositForRenew),
                      isMultipleFD: isMultipleFD,
                    }}
                  />
                </Paper>
                <Paper className={classes?.gridPaper}>
                  <FDDetailGridForArrayField
                    gridData={gridData}
                    setGridData={setGridData}
                    editingSRNORef={editingSRNORef}
                    setFdDtlRefresh={setFdDtlRefresh}
                    iniDtlFormDataNewFDRef={iniDtlFormDataNewFDRef}
                  />
                </Paper>

                <Box className={classes?.footerContainer}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className={classes?.footerTypo}
                      sx={{ minWidth: "200px" }}
                    >
                      {t("TotalRecordsWithCol")} {gridData?.length ?? 0}
                    </Typography>
                    <Typography className={classes?.footerTypo}>
                      Total:
                      {` Cash (${formatCurrency(
                        totalCashAmount,
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}) + Transfer (${formatCurrency(
                        totalTrnsAmount,
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}) = ${formatCurrency(
                        Number(totalCashAmount) + Number(totalTrnsAmount),
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}`}
                    </Typography>
                  </Box>

                  <GradientButton
                    onClick={carryForData}
                    color={"primary"}
                    disabled={gridData?.length <= 0}
                    sx={{
                      minHeight: "20px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      minWidth: "fit-content",
                      padding: "2px 6px",
                    }}
                  >
                    Carry Forward
                  </GradientButton>
                </Box>
              </>
            ) : (
              <Paper sx={{ maxHeight: "calc(80vh - 150px)", overflow: "auto" }}>
                <FormWrapper
                  key={"FixDepositDetail" + defaultView}
                  metaData={
                    extractMetaData(
                      FixDepositDetailFormMetadata,
                      defaultView
                    ) as MetaDataType
                  }
                  initialValues={
                    {
                      ...initialRenDataRef?.current,
                    } as InitialValuesType
                  }
                  onSubmitHandler={() => {}}
                  hideHeader={true}
                  formStyle={{
                    background: "white",
                    paddingTop: "0px",
                  }}
                  ref={ref}
                  formState={{
                    MessageBox: MessageBox,
                    docCD: docCD ?? "",
                    defaultView: defaultView,
                    workingDate: authState?.workingDate ?? "",
                    ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                    BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                    showMessageBox: showMessageBox,
                    CloseMessageBox: CloseMessageBox,
                    editingSRNORef: editingSRNORef?.current,
                    acctDtlReqPara: {
                      CR_ACCT_CD: {
                        ACCT_TYPE: "CR_ACCT_TYPE",
                        BRANCH_CD: "CR_BRANCH_CD",
                        SCREEN_REF: docCD ?? "",
                      },
                      LEAN_ACCT_CD: {
                        ACCT_TYPE: "LEAN_ACCT_TYPE",
                        BRANCH_CD: "LEAN_BRANCH_CD",
                        SCREEN_REF: docCD ?? "",
                      },
                    },
                    openDepositForRenew: Boolean(openDepositForRenew),
                    isMultipleFD: isMultipleFD,
                  }}
                />
              </Paper>
            )}
          </Stack>
        )}
      </>
    );
  }
);
