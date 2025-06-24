import {
  Alert,
  FormWrapper,
  GradientButton,
  LoaderPaperComponent,
  MetaDataType,
  queryClient,
  SubmitFnType,
  TextField,
  usePopupContext,
} from "@acuteinfo/common-base";
import { CircularProgress, Dialog, Grid, LinearProgress } from "@mui/material";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { reportConfigMetadata } from "./formMetadata";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface DefaultFilter {
  id?: string;
  value?: {
    columnName: string;
    type: string;
    value: string;
    condition: string;
    isDisableDelete: boolean;
  };
}

interface QueryData {
  SQL_ANSI_SYNTAX: string;
  METADATA: string;
  DEFAULT_FILTER: string;
  ENABLE_PAGINATION: string;
}

const useTypeStyles = makeStyles((theme: Theme) => ({
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
  textField: {
    width: "50%",
    height: "450px",
    marginBottom: "10px",
  },
  aceContent: {
    height: "400px",
    "&  .ace_scroller": {
      "&  .ace_content": {
        margin: "0",
      },
    },
  },
}));

export const ReportConfiguration = ({
  OpenDialogue,
  closeDialogue,
  rowData,
}: {
  OpenDialogue: boolean;
  closeDialogue: () => void;
  rowData: { DOC_CD: string; DOC_NM: string };
}) => {
  const headerClasses = useTypeStyles();

  const [metaData, setMetaData] = useState<string>("");
  // const [sqlSyntax, setSqlQuery] = useState<string>("");
  const [sqlSyntax, setSqlSyntax] = useState("");
  const mynewSqlSyntaxRef = useRef<any>("");
  const myMetadataRef = useRef<any>("");
  const [defaultFilter, setDefaultFilter] = useState<DefaultFilter | null>(
    null
  );
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();

  const formRef = useRef<any>(null);
  myMetadataRef.current = metaData;
  mynewSqlSyntaxRef.current = sqlSyntax;
  const getmetadataMutation = useMutation(API.generateReportMetadata, {
    onError: async (error: any) => {
      await MessageBox({
        messageTitle: "Error",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
    },
    onSuccess: (data) => {
      const metadata = JSON.stringify(data[0], null, 2);
      setMetaData(metadata);
    },
  });

  const savemetadataMutation = useMutation(API.saveReportConfiguration, {
    onError: async (error: any) => {
      await MessageBox({
        messageTitle: "Error",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
    },
    onSuccess: () => {
      enqueueSnackbar(t("success"), {
        variant: "success",
      });

      closeDialogue();
      queryClient.clear();
    },
  });

  const {
    data: Query,
    isLoading,
    isError,
    error,
  } = useQuery<QueryData[], any>(
    ["getSqlQuery", rowData?.DOC_CD],
    () =>
      API.getrReportSqlQuery({
        companyID: authState?.companyID,
        branchCode: authState?.user?.branchCode,
        DOC_CD: rowData?.DOC_CD,
      }),
    {
      onSuccess: (data) => {
        if (data?.length === 0) {
          enqueueSnackbar("Query Not Found", { variant: "error" });
        } else {
          setSqlSyntax(data[0]?.SQL_ANSI_SYNTAX);
          // mynewSqlSyntaxRef.current = data[0]?.SQL_ANSI_SYNTAX;
          if (data[0]?.METADATA) {
            setMetaData(data[0]?.METADATA);
          }
          const filter = data[0]?.DEFAULT_FILTER;
          if (filter && typeof filter === "string") {
            const cleanFilter = filter.replace(/^\/|\/$/g, "");
            setDefaultFilter(JSON.parse(cleanFilter)[0] || null);
          }
        }
      },
      onError: async (error: any) => {
        await MessageBox({
          messageTitle: "Error",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
      },
      enabled: Boolean(rowData?.DOC_CD),
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit
  ) => {
    endSubmit(true);
    const payload = {
      IS_UPDATE: Query?.length === 0 ? "N" : "Y",
      DOC_CD: rowData?.DOC_CD ?? "",
      SQL_ANSI_SYNTAX: mynewSqlSyntaxRef.current, // Use the current SQL query
      ENABLE_PAGINATION: data?.PAGINATION_ENABLE === true ? "Y" : "N",
      DEFAULT_FILTER:
        data?.DEFAULT_FILTER === true
          ? [
              {
                id: data?.id,
                value: {
                  value: data?.value,
                  type: data?.type,
                  isDisableDelete: data?.isDisableDelete,
                  columnName: data?.columnName,
                  condition: data?.condition,
                },
              },
            ]
          : "",
      METADATA: myMetadataRef.current,
    };

    savemetadataMutation.mutate(payload);
  };

  const handleGenerateMetadata = () => {
    if (sqlSyntax.trim() === "") {
      enqueueSnackbar("SQL Query cannot be empty", { variant: "error" });
      return;
    }
    setDefaultFilter(null);
    getmetadataMutation.mutate({
      SQL_SYNTAX: sqlSyntax, // Pass the current SQL query as part of the request
    });
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getSqlQuery"]);
    };
  }, []);

  return (
    <Fragment>
      {isLoading ? (
        <Dialog
          open={true}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            style: { width: "100%", height: "auto", padding: "7px" },
          }}
        >
          <div style={{ width: "100%", padding: "7px" }}>
            <LoaderPaperComponent />
          </div>
        </Dialog>
      ) : (
        <Dialog
          open={OpenDialogue}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            style: { width: "100%", height: "100%", padding: "7px" },
          }}
        >
          <AppBar position="relative" color="secondary">
            <Toolbar className={headerClasses.root} variant="dense">
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant="h6"
                component="div"
              >
                {`Report Configuration Form For ${rowData?.DOC_CD} ${rowData?.DOC_NM}`}
              </Typography>
              <GradientButton
                onClick={() => {
                  let event: any = { preventDefault: () => {} };
                  formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
                }}
                endIcon={
                  savemetadataMutation.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                color={"primary"}
              >
                Save
              </GradientButton>

              <GradientButton onClick={closeDialogue} color="primary">
                Close
              </GradientButton>
            </Toolbar>
          </AppBar>

          {isError && (
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
              errorDetail={error?.error_detail}
              color="error"
            />
          )}

          <Grid container>
            <Grid item xs={12}>
              <FormWrapper
                key={`reportConfigMetadata-${
                  defaultFilter ? defaultFilter.id : "null"
                  //@ts-ignore
                }-${Query[0]?.ENABLE_PAGINATION}`}
                metaData={reportConfigMetadata as MetaDataType}
                initialValues={{
                  //@ts-ignore
                  PAGINATION_ENABLE: Query[0]?.ENABLE_PAGINATION === "Y",
                  DEFAULT_FILTER: defaultFilter ? true : false,
                  id: defaultFilter?.id,
                  columnName: defaultFilter?.value?.columnName,
                  type: defaultFilter?.value?.type,
                  value: defaultFilter?.value?.value,
                  condition: defaultFilter?.value?.condition,
                  isDisableDelete: defaultFilter?.value?.isDisableDelete,
                }}
                formStyle={{ height: "auto", width: "100%" }}
                hideHeader={true}
                onSubmitHandler={onSubmitHandler}
                displayMode={"add"}
                ref={formRef}
              />
            </Grid>
            <div style={{ marginLeft: "30%" }}>
              <GradientButton
                onClick={() => {
                  handleGenerateMetadata();
                }}
                endIcon={
                  getmetadataMutation.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                color={"primary"}
              >
                Generate Metadata
              </GradientButton>
            </div>
            <Grid
              item
              xs={12}
              xl={12}
              sx={{ m: 2 }}
              style={{ padding: "10px", display: "flex" }}
            >
              <div style={{ width: "45%" }}>
                <h4>SQLQuery</h4>

                <AceEditor
                  className={headerClasses.aceContent}
                  style={{
                    height: "450px",
                    width: "100%",
                    opacity: 1,
                    border: "1px solid #a39494",
                    borderRadius: "10px",
                  }}
                  placeholder={String(t("SQLANSIQuerySyntax"))}
                  onChange={(value) => {
                    mynewSqlSyntaxRef.current = value;
                    setSqlSyntax(value);
                  }}
                  mode="mysql"
                  fontSize={14}
                  value={sqlSyntax}
                  showPrintMargin={false}
                  showGutter={false}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: false,
                    tabSize: 2,
                  }}
                />
              </div>
              <TextField
                id="metadata"
                label="Metadata"
                placeholder="Enter Metadata"
                multiline
                rows={20}
                variant="outlined"
                color="secondary"
                style={{ margin: "5px 0px 0px 10px" }}
                className={headerClasses.textField}
                InputLabelProps={{ shrink: true }}
                value={metaData || "Loading metadata..."}
                onChange={(event) => {
                  const value = event.target.value.trimStart();
                  myMetadataRef.current = value;
                  setMetaData(value); // Update state
                }}
              />
            </Grid>
          </Grid>
        </Dialog>
      )}
    </Fragment>
  );
};
