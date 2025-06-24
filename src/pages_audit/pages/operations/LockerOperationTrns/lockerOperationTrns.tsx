import {
  ClearCacheProvider,
  GradientButton,
  LoaderPaperComponent,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import { AppBar, Grid, Toolbar, Typography, Box, Alert } from "@mui/material";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "pages_audit/auth";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";
import { LockerTrnsFormView } from "./lockerTrnsForm";
import { LockerViewDetailsGrid } from "./lockerViewDetailsGrid";
import JointDetails from "../DailyTransaction/TRNHeaderTabs/JointDetails";
import { useMutation, useQuery } from "react-query";
import { getLockerOperationTrnsData, getLockerViewMst } from "./api";
import { LockerTrnsEntry } from "./lockerTrnsEntry";
export const dataContext = createContext<any>(null);

export const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "auto",
  },
  activeView: {
    height: "410px",
    overflowY: "auto",
  },
  entry: {
    height: "auto",
    overflowY: "scroll",
  },
}));

const LockerOperationTrns = () => {
  let currentPath = useLocation().pathname;
  const headerClasses = useTypeStyles();
  const { authState } = useContext(AuthContext);
  const [payload, setPayload] = useState<any>({});
  const { MessageBox } = usePopupContext();
  const [activeView, setActiveView] = useState<string>("master");
  const childRef = useRef<any>();
  const formData = useRef<any>([]);
  const gridData = useRef<any>([]);

  const handleSubmit = () => {
    childRef.current.saveEntry(formData, gridData);
  };
  const saveData = (values) => {
    setPayload(values);
  };

  const viewMasterMutation = useMutation(getLockerViewMst, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      const btnName = await MessageBox({
        message: errorMsg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      setActiveView("master");
      formData.current = data;
    },
  });

  const reqData: any = {
    COMP_CD: authState?.companyID ?? "",
    BRANCH_CD: authState?.user?.branchCode ?? "",
    ACCT_CD: payload?.ACCT_CD ?? "",
    ACCT_TYPE: payload?.ACCT_TYPE ?? "",
    WORKING_DATE: authState?.workingDate ?? "",
  };
  useEffect(() => {
    if (Boolean(payload?.ACCT_CD && payload?.ACCT_TYPE)) {
      viewMasterMutation.mutate({
        ...reqData,
      });
    }
  }, [payload]);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["getLockerDetails"],
    () =>
      getLockerOperationTrnsData({
        ...reqData,
      }),
    {
      enabled:
        activeView === "detail" &&
        payload?.ACCT_CD !== undefined &&
        payload?.ACCT_TYPE !== undefined,
      onSuccess: (data) => {
        gridData.current = data;
      },
    }
  );
  const getButtonStyle = (view) => ({
    border: activeView === view ? "2px solid white" : "none",
  });
  return (
    <Fragment>
      <dataContext.Provider value={{ payload, saveData, formData, gridData }}>
        <div>
          <AppBar position="relative" color="secondary">
            <Toolbar className={headerClasses.root} variant="dense">
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant="h6"
                component="div"
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    {utilFunction.getDynamicLabel(
                      currentPath,
                      authState?.menulistdata,
                      true
                    )}
                  </Grid>
                  <Grid item>
                    <GradientButton
                      onClick={() => setActiveView("master")}
                      style={getButtonStyle("master")}
                    >
                      {t("ViewMaster")}
                    </GradientButton>
                    <GradientButton
                      onClick={() => setActiveView("detail")}
                      style={getButtonStyle("detail")}
                    >
                      {t("ViewDetails")}
                    </GradientButton>
                    <GradientButton
                      onClick={() => setActiveView("joint")}
                      style={getButtonStyle("joint")}
                    >
                      {t("JointDetail")}
                    </GradientButton>
                  </Grid>
                </Grid>
              </Typography>

              <GradientButton onClick={() => handleSubmit()}>
                {t("Save")}
              </GradientButton>
            </Toolbar>
          </AppBar>
          <Box className={headerClasses.mainContent}>
            <Box className={headerClasses.activeView}>
              {activeView === "master" ? (
                viewMasterMutation.isLoading ? (
                  <LoaderPaperComponent />
                ) : (
                  <LockerTrnsFormView data={viewMasterMutation?.data} />
                )
              ) : null}

              {activeView === "detail" && (
                <>
                  {isError ||
                    (viewMasterMutation?.isError && (
                      <Alert
                        severity="error"
                        //@ts-ignore
                        errorMsg={
                          //@ts-ignore
                          (error?.error_msg ||
                            viewMasterMutation?.error?.error_detail) ??
                          t("Somethingwenttowrong")
                        }
                        errorDetail={
                          //@ts-ignore
                          error?.error_detail ||
                          viewMasterMutation?.error?.error_detail
                        }
                        color="error"
                      />
                    ))}
                  <LockerViewDetailsGrid
                    data={gridData.current}
                    refetch={refetch}
                    loading={isLoading || isFetching}
                  />
                </>
              )}
              {activeView === "joint" && (
                <JointDetails
                  hideHeader={true}
                  reqData={{
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD: authState?.user?.branchCode ?? "",
                    ACCT_CD: payload?.ACCT_CD ?? "",
                    ACCT_TYPE: payload?.ACCT_TYPE ?? "",
                    ACCT_NM: payload?.ACCT_NM ?? "",
                    BTN_FLAG: "N",
                  }}
                  height={"350px"}
                />
              )}
            </Box>

            <Box className={headerClasses.entry}>
              <LockerTrnsEntry ref={childRef} />
            </Box>
          </Box>
        </div>
      </dataContext.Provider>
    </Fragment>
  );
};

export const LockerOperationTrnsMain = () => {
  return (
    <Fragment>
      <ClearCacheProvider>
        <LockerOperationTrns />
      </ClearCacheProvider>
    </Fragment>
  );
};
