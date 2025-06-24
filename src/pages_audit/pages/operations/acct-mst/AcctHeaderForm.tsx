import React, { useContext, useEffect, useMemo, useRef } from "react";
import { AppBar, LinearProgress } from "@mui/material";
import { useQuery } from "react-query";
import { acctMSTHeaderFormMetadata } from "./metadata/acctHeaderMetadata";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { AcctMSTContext } from "./AcctMSTContext";
import {
  Alert,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  queryClient,
  usePopupContext,
} from "@acuteinfo/common-base";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";

const AcctHeaderForm = () => {
  const { MessageBox } = usePopupContext();
  const {
    AcctMSTState,
    handleHeaderFormSubmit,
    handleApiRes,
    handleFormLoading,
    handleAcctTypeValue,
    handleFormDataonSavectx,
    handleModifiedColsctx,
    handleStepStatusctx,
    handleColTabChangectx,
  } = useContext(AcctMSTContext);
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const formRef = useRef<any | null>(null);

  const onSubmitHandler = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      if (data?.ACCT_TYPE !== AcctMSTState?.accTypeValuectx) {
        if (Object.keys(AcctMSTState?.formDatactx).length > 0) {
          let buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: "YourChangesWillBeLostAreYouSure",
            buttonNames: ["Yes", "No"],
            icon: "CONFIRM",
          });
          if (buttonName === "Yes") {
            handleStepStatusctx({ reset: true });
            handleFormDataonSavectx({});
            handleModifiedColsctx({});
            handleColTabChangectx(0);
            handleHeaderFormSubmit({
              acctType: data?.ACCT_TYPE,
              parentCode: data?.PARENT_CODE,
              reqID: data?.REQ_ID,
            });
          }
        } else {
          handleHeaderFormSubmit({
            acctType: data?.ACCT_TYPE,
            parentCode: data?.PARENT_CODE,
            reqID: data?.REQ_ID,
          });
          handleColTabChangectx(0);
        }
      }
    }
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    return {
      ACCT_CD: AcctMSTState?.acctNumberctx,
      ACCT_TYPE: AcctMSTState?.accTypeValuectx,
      REQ_ID: AcctMSTState?.req_cd_ctx,
      BRANCH_CD: AcctMSTState?.rowBranchCodectx
        ? AcctMSTState?.rowBranchCodectx ?? ""
        : authState?.user?.branchCode ?? "",
    };
  }, [
    AcctMSTState?.acctNumberctx,
    AcctMSTState?.accTypeValuectx,
    AcctMSTState?.req_cd_ctx,
  ]);

  // const loader = useMemo(() => (AcctMSTState?.currentFormctx.isLoading || AcctMSTState?.isLoading) ? <LinearProgress color="secondary" /> : null, [AcctMSTState?.currentFormctx.isLoading, AcctMSTState?.isLoading])
  const loader = useMemo(
    () =>
      AcctMSTState?.isLoading ? <LinearProgress color="secondary" /> : null,
    [AcctMSTState?.isLoading]
  );

  const {
    data: TabsData,
    isSuccess,
    isLoading,
    isFetching,
    isError: isTabError,
    error: TabError,
    refetch,
  } = useQuery<any, any>(
    ["getTabsDetail", AcctMSTState?.accTypeValuectx],
    () =>
      API.getTabsDetail({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        ACCT_TYPE: AcctMSTState?.accTypeValuectx,
        ACCT_MODE: AcctMSTState?.acctModectx,
        ALLOW_EDIT: AcctMSTState?.isFreshEntryctx
          ? "NEW"
          : Boolean(AcctMSTState?.confirmFlagctx)
          ? AcctMSTState?.confirmFlagctx === "Y"
            ? "EDIT"
            : "NEW"
          : "EDIT",
        // isFreshEntry: state?.isFreshEntryctx,
      }),
    {
      enabled: Boolean(AcctMSTState?.accTypeValuectx),
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getTabsDetail",
        AcctMSTState?.accTypeValuectx,
      ]);
    };
  }, []);

  useEffect(() => {
    // if() {
    // console.log("ResultResult", TabsData)
    // setTabsApiRes(data)
    if (!isLoading && TabsData && TabsData.length > 0) {
      let newData: any[] = [];
      TabsData.forEach(async (element: { [k: string]: any }) => {
        if (element.O_STATUS !== "0") {
          let buttonName = await MessageBox({
            messageTitle:
              element.O_STATUS === "999"
                ? "ValidationFailed"
                : element.O_STATUS === "9"
                ? "Alert"
                : element.O_STATUS === "99"
                ? "Confirmation"
                : "Success",
            message: element.O_MESSAGE,
            buttonNames:
              element.O_STATUS === "999"
                ? ["Ok"]
                : element.O_STATUS === "9"
                ? ["Ok"]
                : element.O_STATUS === "99"
                ? ["Yes", "No"]
                : ["Ok"],
            icon:
              element.O_STATUS === "999"
                ? "ERROR"
                : element.O_STATUS === "9"
                ? "WARNING"
                : element.O_STATUS === "99"
                ? "CONFIRM"
                : "SUCCESS",
          });
          if (buttonName === "Ok" && element.O_STATUS === "999") {
            handleAcctTypeValue("");
          }
        } else {
          let subtitleinfo = {
            SUB_TITLE_NAME: element?.SUB_TITLE_NAME,
            SUB_TITLE_DESC: element?.SUB_TITLE_DESC,
            SUB_ICON: element?.SUB_ICON,
          };
          let index = newData.findIndex(
            (el: any) => el?.TAB_NAME === element?.TAB_NAME
          );
          if (index != -1) {
            // duplicate tab element
            let subtitles = newData[index].subtitles;
            subtitles.push(subtitleinfo);
          } else {
            // new tab element
            newData.push({
              ...element,
              subtitles: [subtitleinfo],
              isVisible: true,
            });
          }
          // console.log("filled newdata -aft", element.TAB_NAME , newData)
        }
      });
      // setTabsApiRes(newData)
      handleApiRes(newData);
    }
    // }
  }, [TabsData, isLoading]);
  useEffect(() => {
    if (isLoading || isFetching) {
      handleFormLoading(true);
    } else {
      handleFormLoading(false);
    }
  }, [isLoading, isFetching, TabsData]);

  // useEffect(() => {
  //   console.log("AcctMSTState?.isLoading iauhfuiahef", AcctMSTState?.isLoading)
  // }, [AcctMSTState?.isLoading])

  return (
    <AppBar position="sticky" style={{ marginBottom: "10px", top: "113px" }}>
      <FormWrapper
        key={"acct-header-form" + initialVal + AcctMSTState?.accTypeValuectx}
        ref={formRef}
        onSubmitHandler={onSubmitHandler}
        initialValues={initialVal}
        metaData={
          extractMetaData(
            acctMSTHeaderFormMetadata,
            AcctMSTState?.formmodectx
          ) as MetaDataType
        }
        formStyle={{}}
        formState={{ docCD: docCD }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
        }}
      ></FormWrapper>
      {loader}
      {isTabError && (
        <Alert
          severity={TabError?.severity ?? "error"}
          errorMsg={TabError?.error_msg ?? "Something went to wrong.."}
          errorDetail={TabError?.error_detail}
          color="error"
        />
      )}
    </AppBar>
  );
};

export default AcctHeaderForm;
