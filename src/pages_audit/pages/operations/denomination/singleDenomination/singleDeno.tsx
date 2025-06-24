import {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { denoTableMetadataTotal } from "./metadata";
import { AuthContext } from "pages_audit/auth";
import DailyTransTabs from "../../DailyTransaction/TRNHeaderTabs";
import { useCacheWithMutation } from "../../DailyTransaction/TRNHeaderTabs/cacheMutate";
import * as CommonApi from "../api";
import { LinearProgress } from "@mui/material";
import { useMutation } from "react-query";
import DualTableCalc from "../tellerTransaction/dualTypeTable/dualTableCalc";
import * as API from "./api";
import TellerDenoTableCalc from "../tellerTransaction/singleTypeTable/tellerDenoTableCalc";
import { format, parse } from "date-fns";
import {
  Alert,
  ClearCacheProvider,
  formatCurrency,
  utilFunction,
} from "@acuteinfo/common-base";
import {
  usePopupContext,
  FormWrapper,
  MetaDataType,
  getCurrencySymbol,
  usePropertiesConfigContext,
} from "@acuteinfo/common-base";
import ReleaseMainGrid from "./release/releaseMainGrid";
import OtherReceipt from "../otherReceipt/otherRec";
import CashPayment from "../tellerTransaction/cashPayment/cashPayment";
import { getdocCD } from "components/utilFunction/function";
import { useLocation } from "react-router-dom";
import { t } from "i18next";
import {
  DialogProvider,
  useDialogContext,
} from "../../payslip-issue-entry/DialogContext";
import { useEnter } from "components/custom/useEnter";

const SingleDenoMain = ({ screenFlag }) => {
  const myFormRef = useRef<any>(null);
  const prevCardReq = useRef<any>(null);
  const endSubmitRef = useRef<any>(null);
  const cardDtlRef = useRef<any>(null);
  const currentPath = useLocation()?.pathname;
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const customParameter = usePropertiesConfigContext();
  const [cardDetails, setCardDetails] = useState([]);
  const [cardTabsReq, setCardTabsReq] = useState({});
  const [openDenoTable, setOpenDenoTable] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [denoTablePara, setDenoTablePara] = useState({
    DENO_VALIDATION: "",
    DENO_WINDOW: "",
  });
  const [singleDenoRows, setSingleDenoRows] = useState({
    singleDenoRow: [
      {
        BRANCH_CD: authState?.user?.branchCode,
      },
    ],
  });
  const [arrFieldData, setArrFieldData] = useState<any>({});
  const [openGrid, setOpenGrid] = useState<any>(false);
  const [openOthRec, setOpenOthRec] = useState<any>(false);
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    setData: setTabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  }: any = useCacheWithMutation(
    "getTabsByParentTypeKeySingleDeno",
    CommonApi.getTabsByParentType
  );
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;
  const docCD = getdocCD(useLocation()?.pathname, authState?.menulistdata);
  const handleCardDetails = (cardDetails) => {
    cardDtlRef.current = cardDetails;
  };
  useEffect(() => {
    if (cardDtlRef.current) setCardDetails(cardDtlRef.current);
  }, [cardDtlRef.current]);

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setCardDetails(data);
    },
    onError: (error: any) => {},
  });
  useEffect(() => {
    if (Boolean(arrFieldData)) {
      if (
        Boolean(authState?.companyID) &&
        Boolean(arrFieldData?.BRANCH_CD) &&
        Boolean(arrFieldData?.ACCT_TYPE)
      ) {
        const req = {
          COMP_CD: authState?.companyID,
          BRANCH_CD: arrFieldData?.BRANCH_CD,
          ACCT_TYPE: arrFieldData?.ACCT_TYPE,
        };
        fetchTabsData({
          cacheId: req,
          reqData: req,
        });
      }
      if (
        Boolean(authState?.companyID) &&
        Boolean(arrFieldData?.BRANCH_CD) &&
        Boolean(arrFieldData?.ACCT_TYPE) &&
        Boolean(arrFieldData?.ACCT_CD)
      ) {
        const req = {
          COMP_CD: authState?.companyID,
          BRANCH_CD: arrFieldData?.BRANCH_CD,
          ACCT_TYPE: arrFieldData?.ACCT_TYPE,
          ACCT_CD: arrFieldData?.ACCT_CD,
          PARENT_TYPE: "",
        };
        if (JSON.stringify(req) !== JSON.stringify(prevCardReq?.current)) {
          getCarousalCards?.mutate({ reqData: req });
          prevCardReq.current = req;
        }
      }
    }
  }, [arrFieldData]);
  const handleSubmit = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmitRef.current = { endSubmit };
    if (Object?.keys(data)?.length > 0) {
      if (
        (Boolean(data?.FINAL_AMOUNT) &&
          Boolean(Number(data?.FINAL_AMOUNT) > 0)) ||
        (Boolean(data?.FINAL_AMOUNT) && Boolean(Number(data?.FINAL_AMOUNT) < 0))
      ) {
        setFormData(data);
        const formattedDate = format(
          parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
          "dd/MMM/yyyy"
        ).toUpperCase();
        getData?.mutate({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          TRAN_DT: formattedDate,
          endSubmit: endSubmit,
        });
      } else {
        endSubmitRef?.current?.endSubmit(true);
      }
    }
  };

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any, variables?: any) => {
      setOpenDenoTable(true);
    },
    onError: (error: any) => {},
  });

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return [...getData.data];
    }
  }, [getData.data]);

  const getFomattedCurrency = (values) => {
    const formatedValue = formatCurrency(
      parseFloat(values || "0"),
      getCurrencySymbol(dynamicAmountSymbol),
      currencyFormat,
      decimalCount
    );
    return formatedValue;
  };

  useEffect(() => {
    if (!getData?.isLoading) {
      endSubmitRef?.current?.endSubmit(true);
    }
  }, [getData?.isLoading]);

  const getCardColumnValue = () => {
    const keys = [
      "WITHDRAW_BAL",
      "TRAN_BAL",
      "LIEN_AMT",
      "CONF_BAL",
      "UNCL_BAL",
      "DRAWING_POWER",
      "LIMIT_AMOUNT",
      "HOLD_BAL",
      "AGAINST_CLEARING",
      "MIN_BALANCE",
      "OD_APPLICABLE",
      "INST_NO",
      "INST_RS",
      "OP_DATE",
      "PENDING_AMOUNT",
      "STATUS",
      "INST_DUE_DT",
      "SHADOW_CLEAR",
    ];

    const cardValues = keys?.reduce((acc, key) => {
      const item: any = cardDtlRef?.current?.find(
        (entry: any) => entry?.COL_NAME === key
      );
      acc[key] = item?.COL_VALUE;
      return acc;
    }, {});
    return cardValues;
  };

  useEffect(() => {
    if (cardDetails?.length) {
      cardDtlRef.current = cardDetails;
    }
  }, [cardDetails]);

  const handleResetForm = () => {
    let event: any = { preventDefault: () => {} };
    myFormRef?.current?.handleFormReset(event, "Reset");
  };
  const { trackDialogClass, dialogClassNames } = useDialogContext();
  const [dataClass, setDataClass] = useState("");
  let className = localStorage.getItem("commonClass");
  useEffect(() => {
    const newData =
      className !== null
        ? className
        : dialogClassNames
        ? `${dialogClassNames}`
        : "main";

    setDataClass(newData);
  }, [className, dialogClassNames]);

  useEnter(`${dataClass}`);
  return (
    <>
      {getCarousalCards?.isError &&
      (!getCarousalCards?.error?.error_msg?.includes("Timeout") ||
        !getCarousalCards?.error?.error_msg?.includes("AbortError")) ? (
        <Fragment>
          <Alert
            severity={getCarousalCards?.error?.severity ?? "error"}
            errorMsg={getCarousalCards?.error?.error_msg ?? "Error"}
            errorDetail={getCarousalCards?.error?.error_detail ?? ""}
          />
        </Fragment>
      ) : null}
      {isTabsError ? (
        <Fragment>
          <Alert
            severity={tabsErorr?.severity ?? "error"}
            errorMsg={tabsErorr?.error_msg ?? "Error"}
            errorDetail={tabsErorr?.error_detail ?? ""}
          />
        </Fragment>
      ) : null}
      {getData?.isError ? (
        <Fragment>
          <Alert
            severity={getData?.error?.severity ?? "error"}
            errorMsg={getData?.error?.error_msg ?? "Error"}
            errorDetail={getData?.error?.error_detail ?? ""}
          />
        </Fragment>
      ) : null}
      {Boolean(openGrid) ? (
        <ReleaseMainGrid setOpenGrid={setOpenGrid} />
      ) : Boolean(openOthRec) ? (
        <OtherReceipt
          screenFlag={"MULTIOTHREC"}
          setCloseOthRec={setOpenOthRec}
        />
      ) : Boolean(openPayment) ? (
        <CashPayment screenFlag={"MULTIPAY"} setNormalEntry={setOpenPayment} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "91vh",
            }}
          >
            <DailyTransTabs
              heading={utilFunction.getDynamicLabel(
                currentPath,
                authState?.menulistdata,
                true
              )}
              cardsData={cardDetails}
              reqData={cardTabsReq}
              tabsData={tabsDetails}
            />
            {isTabsLoading ||
            getCarousalCards?.isLoading ||
            getData?.isLoading ? (
              <LinearProgress
                color="secondary"
                sx={{ margin: "0px 10px 0px 10px" }}
              />
            ) : null}
            <div style={{ overflowY: "auto", flex: 0.3 }}>
              <FormWrapper
                onSubmitHandler={handleSubmit}
                initialValues={singleDenoRows ?? {}}
                key={"single-deno" + denoTableMetadataTotal + singleDenoRows}
                metaData={denoTableMetadataTotal as MetaDataType}
                formStyle={{}}
                hideHeader={true}
                formState={{
                  MessageBox: MessageBox,
                  setCardDetails,
                  setTabsDetails,
                  fetchTabsData,
                  docCD: docCD,
                  getCardColumnValue,
                  CloseMessageBox,
                  isLoading: getData?.isLoading,
                  setDenoTablePara,
                  setCardTabsReq,
                  acctDtlReqPara: {
                    ACCT_CD: {
                      ACCT_TYPE: "singleDenoRow.ACCT_TYPE",
                      BRANCH_CD: "singleDenoRow.BRANCH_CD",
                      SCREEN_REF: docCD ?? "",
                    },
                  },
                  handleCardDetails,
                }}
                onFormButtonClickHandel={(buttonId) => {
                  if (buttonId === "DENOBTN") {
                    let event: any = { preventDefault: () => {} };
                    myFormRef?.current?.handleSubmit(event, "SAVE");
                  } else if (buttonId === "RELEASE") {
                    setOpenGrid(true);
                  } else if (buttonId === "OTHER_REC") {
                    setOpenOthRec(true);
                  } else if (buttonId === "OTHER_PAY") {
                    setOpenPayment(true);
                  }
                  // else if (id === "ADDNEWROW") {
                  //   //@ts-ignore
                  //   setSingleDenoRows((oldRow) => {
                  //     return {
                  //       ...oldRow,
                  //       singleDenoRow: [
                  //         ...oldRow?.singleDenoRow,
                  //         {
                  //           ...oldRow?.singleDenoRow[0],
                  //           BRANCH_CD: authState?.user?.branchCode,
                  //         },
                  //       ],
                  //     };
                  //   });
                  // }
                }}
                ref={myFormRef}
              />
            </div>
          </div>
        </>
      )}
      {openDenoTable && denoTablePara?.DENO_WINDOW === "Y" && (
        <div className="denoTable">
          <DualTableCalc
            data={data ?? []}
            displayTableDual={openDenoTable}
            formData={formData}
            initRemainExcess={Math.abs(formData?.FINAL_AMOUNT ?? "0")}
            gridLable={
              formData?.FINAL_AMOUNT > 0
                ? t("MultipleReceipt", {
                    totalAmount: getFomattedCurrency(
                      Math.abs(formData?.FINAL_AMOUNT ?? "0")
                    ),
                  })
                : t("MultiplePayment", {
                    totalAmount: getFomattedCurrency(
                      Math.abs(formData?.FINAL_AMOUNT ?? "0")
                    ),
                  })
            }
            onCloseTable={() => setOpenDenoTable(false)}
            screenFlag={"MULTIRECPAY"}
            typeCode={formData?.FINAL_AMOUNT > 0 ? "1" : "4"}
            setOpenDenoTable={setOpenDenoTable}
            resetForm={handleResetForm}
            denoValidPara={denoTablePara?.DENO_VALIDATION}
          />
        </div>
      )}
      {openDenoTable && denoTablePara?.DENO_WINDOW !== "Y" && (
        <div className="denoTable">
          <TellerDenoTableCalc
            data={data ?? []}
            displayTable={openDenoTable}
            setOpenDenoTable={setOpenDenoTable}
            formData={formData}
            initRemainExcess={Math.abs(formData?.FINAL_AMOUNT ?? "0")}
            gridLable={
              formData?.FINAL_AMOUNT > 0
                ? t("MultipleReceipt", {
                    totalAmount: getFomattedCurrency(
                      Math.abs(formData?.FINAL_AMOUNT ?? "0")
                    ),
                  })
                : t("MultiplePayment", {
                    totalAmount: getFomattedCurrency(
                      Math.abs(formData?.FINAL_AMOUNT ?? "0")
                    ),
                  })
            }
            onCloseTable={() => setOpenDenoTable(false)}
            screenFlag={"MULTIRECPAY"}
            typeCode={formData?.FINAL_AMOUNT > 0 ? "1" : "4"}
            resetForm={handleResetForm}
            denoValidPara={denoTablePara?.DENO_VALIDATION}
          />
        </div>
      )}
    </>
  );
};
export const SingleDeno = ({ screenFlag }) => {
  return (
    <ClearCacheProvider>
      <DialogProvider>
        <div className="main">
          <SingleDenoMain screenFlag={screenFlag} />
        </div>
      </DialogProvider>
    </ClearCacheProvider>
  );
};
