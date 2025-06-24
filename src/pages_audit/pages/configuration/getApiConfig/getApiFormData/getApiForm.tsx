import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApiFormMetadata } from "./getApiiFormMetadata";

import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { checkRediskeyTtl, flushRediskey, savedynamicAPIconfig } from "../api";
import { enqueueSnackbar } from "notistack";

import {
  Alert,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  CreateDetailsRequestData,
  utilFunction,
  GradientButton,
  queryClient,
  usePopupContext,
} from "@acuteinfo/common-base";
import { t } from "i18next";
import KeyValueTable from "./getFlushTime";
import i18n from "components/multiLanguage/languagesConfiguration";

const GetApiFormCustom = ({ closeDialog, refetch, defaultView, flush }) => {
  const formRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { state: rowdata }: any = useLocation();
  const mynewSqlSyntaxRef = useRef<any>("");
  const [sqlSyntax, setSqlSyntax] = useState(rowdata?.GET_QUERY ?? "");

  const { MessageBox, CloseMessageBox } = usePopupContext();
  useEffect(() => {
    mynewSqlSyntaxRef.current = sqlSyntax ?? "";
  }, [sqlSyntax]);

  const {
    data,
    refetch: refetchKey,
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery<any, any>(
    ["checkRediskeyTtl"],
    () =>
      checkRediskeyTtl({
        DISPLAY_LANGUAGE: i18n.resolvedLanguage,
        DYNAMIC_ACTION: rowdata?.ACTION,
      }),
    {
      enabled: defaultView === "edit" && rowdata?.CACHING === "Y",
    }
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["checkRediskeyTtl"]);
    };
  }, []);

  const mutation: any = useMutation(savedynamicAPIconfig, {
    onSuccess: (data, variables) => {
      if (variables?._isNewRow) {
        enqueueSnackbar(t("RecordInsertedMsg"), { variant: "success" });
      } else if (variables?._isUpdatedRow) {
        enqueueSnackbar(t("RecordUpdatedMsg"), { variant: "success" });
      }
      refetch();
      closeDialog();
    },
    onError: (error: any) => {},
  });

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    //@ts-ignore
    endSubmit(true);

    let newData = data?.requestParameters?.map((item) => {
      const newItem = {
        ...item,
        _isNewRow: true,
      };
      return newItem;
    });
    newData = CreateDetailsRequestData(newData);
    let reqData = {
      _isNewRow: true,
      ACTION: data?.ACTION.toUpperCase(),
      GET_QUERY: mynewSqlSyntaxRef.current,
      GET_TYPE: data?.GET_API_TYPE,
      DETAILS_DATA: newData,
      DOC_API_DTL: {
        COMP_CD: authState.companyID,
        _isNewRow: true,
        BRANCH_CD: authState.user.branchCode,
        DOC_CD: data?.DOC_CD,
        // API_ID: "73",
        API_ENDPOINT: `/enfinityCommonServiceAPI/GETDYNAMICDATA/${data?.ACTION.toUpperCase()}`,
      },
    };

    let updateReq = {
      _isUpdatedRow: true,
      ID: rowdata?.ID,
      IS_COMPRESSED: data?.IS_COMPRESSED,
      PAGINATION: data?.PAGINATION,
      CACHING: data?.CACHING,
      CACHING_INTERVAL: data?.CACHING_INTERVAL,
      DETAILS_DATA: {
        isNewRow: [],
        isDeleteRow: [],
        isUpdatedRow: [],
      },
      DOC_API_DTL: {},
    };

    if (Boolean(mynewSqlSyntaxRef.current)) {
      mutation.mutate(
        defaultView === "edit"
          ? { ...updateReq }
          : defaultView === "add"
          ? { ...reqData }
          : {}
      );
    } else {
      enqueueSnackbar("Please Enter SQL Syntax.", {
        variant: "warning",
      });
    }
  };
  return (
    <>
      <DialogTitle
        sx={{
          m: 1,
          p: 0,
          background: "var(--theme-color5)",
          color: "var(--theme-color2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "& .MuiTypography-body1": {
            fontSize: "1.5rem",
            paddingLeft: "10px",
            fontWeight: 500,
          },
          "& .MuiButtonBase-root": {
            color: "var(--theme-color2) !important",
          },
        }}
        id="customized-dialog-title"
      >
        <Typography>
          {utilFunction.getDynamicLabel(
            useLocation().pathname,
            authState?.menulistdata,
            true
          )}
        </Typography>
        <DialogActions>
          {defaultView === "edit" &&
            rowdata?.CACHING === "Y" &&
            data?.[0]?.STATUS !== "0" && (
              <GradientButton
                onClick={async () => {
                  let buttonName = await MessageBox({
                    messageTitle: "confirmation",
                    message: `${t("AreYouSureFlushKeys")} ${rowdata?.ACTION} `,
                    buttonNames: ["Yes", "No"],
                    icon: "CONFIRM",
                    defFocusBtnName: "Yes",
                    loadingBtnName: ["Yes"],
                  });
                  if (buttonName === "Yes") {
                    flush.mutate(
                      {
                        FLUSHALL: false,
                        DYNAMIC_ACTION: [rowdata?.ACTION],
                        FLAG: "S",
                      },
                      {
                        onSuccess() {
                          refetchKey();
                          CloseMessageBox();
                        },
                      }
                    );
                  }
                }}
              >
                {t("Flush")}
              </GradientButton>
            )}
          <GradientButton
            onClick={(event) =>
              formRef?.current?.handleSubmit(event, "BUTTON_CLICK")
            }
            endIcon={
              mutation?.isLoading ? <CircularProgress size={20} /> : null
            }
          >
            {t("Save")}
          </GradientButton>
          <GradientButton onClick={closeDialog}>{t("Close")}</GradientButton>
        </DialogActions>
      </DialogTitle>
      {mutation.isError && (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      )}
      <Grid container>
        <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
          <FormWrapper
            key={`MerchantOnboardConfig`}
            metaData={getApiFormMetadata as MetaDataType}
            initialValues={rowdata ?? {}}
            onSubmitHandler={onSubmitHandler}
            formStyle={{}}
            formState={{ formMode: defaultView }}
            hideHeader={true}
            ref={formRef}
          ></FormWrapper>

          {isLoading || isFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="secondary" size={20} />
            </div>
          ) : isError ? (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Unknow Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          ) : data?.[0]?.STATUS === "0" && data?.[0]?.MESSAGE ? (
            <AppBar position="relative" color="primary">
              <Alert
                severity="warning"
                errorMsg={data?.[0]?.MESSAGE ?? "Unknow Error"}
                sx={{
                  "& span": {
                    color: "rgb(239 122 27) !important",
                  },
                }}
              />
            </AppBar>
          ) : rowdata?.CACHING === "Y" ? (
            <KeyValueTable data={data} />
          ) : null}
        </Grid>
        <Grid
          item
          xs={5}
          sm={5}
          md={5}
          lg={5}
          xl={5}
          style={{
            padding: "10px ",
          }}
        >
          <Typography
            // sx={{ color: "rgb(0 0 0)" }}
            fontSize={15}
            variant="caption"
            component="div"
          >
            {t("SQLANSIQuerySyntax")}
          </Typography>

          <Box
            style={{
              padding: "10px ",
              border: "1px solid rgb(186 186 186)",
              borderRadius: "5px",
              maxHeight: "71vh",
              minHeight: "71vh",
              overflow: "auto",
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label=""
              multiline
              disabled={defaultView === "edit"}
              value={sqlSyntax}
              variant="standard"
              color="secondary"
              sx={{
                width: "100%",
                "& .MuiInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                mynewSqlSyntaxRef.current = event.target.value;
                setSqlSyntax(event.target.value);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export const GetApiForm = ({ closeDialog, refetch, defaultView, flush }) => {
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1375px",
        },
      }}
    >
      <GetApiFormCustom
        refetch={refetch}
        closeDialog={closeDialog}
        defaultView={defaultView}
        flush={flush}
      />
    </Dialog>
  );
};
