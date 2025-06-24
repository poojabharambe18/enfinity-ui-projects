import { useMutation, useQueries, useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { clone, cloneDeep } from "lodash-es";
import * as API from "../api";
import { DynamicGridConfigMetaData } from "./metaData";
import { MasterDetailsMetaData } from "@acuteinfo/common-base";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
  Typography,
  Theme,
  Dialog,
  IconButton,
} from "@mui/material";
import { RetrievalParametersGrid } from "./retrievalParameters";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionFormWrapper } from "./actionsform";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { AuthContext } from "pages_audit/auth";
import { MyFullScreenAppBar } from "pages_audit/appBar/fullScreenAppbar";

import {
  CreateDetailsRequestData,
  utilFunction,
  PopupMessageAPIWrapper,
  LoaderPaperComponent,
  queryClient,
  Alert,
  MasterDetailsForm,
  GradientButton,
} from "@acuteinfo/common-base";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--primary-bg)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

interface addMasterDataType {
  data: object;
  formMode: string;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data, formMode }: addMasterDataType) => {
    return addMasterFn(data, formMode);
  };

const DynamicGridConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit" | "add";
  docCD: any;
  data: any;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  docCD,
  data: reqData,
}) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const myVerifyCntRef = useRef(0);
  const mySqlSyntaxRef = useRef<any>(defaultView === "add" ? false : true);
  const myoldSqlSyntaxRef = useRef<any>("");
  const myparameterDataRef = useRef<any>([]);
  const [isLocalLoading, setLocalLoading] = useState(false);
  const [isOpenRerieval, setIsOpenRerieval] = useState(false);
  const [formName, setformName] = useState("");
  const [sqlSyntax, setSqlSyntax] = useState("");
  const mynewSqlSyntaxRef = useRef<any>("");
  const [formMode, setFormMode] = useState(defaultView);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const [isActionsForm, setActionsForm] = useState(false);
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [errorObjData, seterrorObjData] = useState({
    isError: false,
    error: { error_msg: "", error_detail: "" },
  });

  const result = useQueries([
    {
      queryKey: ["getDynamicGridColConfigData", docCD],
      queryFn: () =>
        API.getDynamicGridColConfigData({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          docCD,
        }),
    },
    {
      queryKey: ["getDynamicParamterConfigData", docCD],
      queryFn: () =>
        API.getDynamicParamterConfigData({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          docCD,
        }),
    },
  ]);
  const loading = result[0].isLoading || result[0].isFetching;
  let isError = result[0].isError;
  //@ts-ignore
  let errorMsg = `${result[0].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  //@ts-ignore
  let error_detail = `${result[0]?.error?.error_detail}`;

  useEffect(() => {
    if (
      location.pathname ===
      "/EnfinityCore/configuration/dynamic-grid-config/view-details"
    ) {
      if (!docCD) {
        // If docCD is not available in the API response, navigate to the desired route
        navigate("/EnfinityCore/configuration/dynamic-grid-config");
      }
    } else {
      navigate(location.pathname);
    }
  }, [navigate, location.pathname, docCD]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicGridColConfigData"]);
      queryClient.removeQueries(["dynamicGridConfigDML"]);
      queryClient.removeQueries(["verifyDynGridSqlSyntax"]);
    };
  }, []);

  const mutation = useMutation(
    addMasterFormDataFnWrapper(API.dynamicGridConfigDML()),
    {
      onError: (error: any, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(false, error?.error_msg, error?.error_detail ?? "");
        onActionCancel();
      },
      onSuccess: (data) => {
        // SetLoadingOWN(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });

        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const verifySql = useMutation(API.verifyDynGridSqlSyntax, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      mySqlSyntaxRef.current = true;
      let detailData = data?.[0]?.DETAILS.map((item) => {
        return {
          ...item,
          _isNewRow: true,
        };
      });

      myRef.current?.setGridData((oldData) => {
        let existingData = oldData.map((item) => {
          let isExists = detailData.some((itemfilter) => {
            return itemfilter.COLUMN_ACCESSOR === item.COLUMN_ACCESSOR;
          });
          if (isExists) {
            return { ...item, _hidden: false };
          } else {
            return { ...item, _hidden: true };
          }
        });
        let newData = detailData.filter((itemFilter) => {
          let isExists = oldData.some((olditem) => {
            return olditem.COLUMN_ACCESSOR === itemFilter.COLUMN_ACCESSOR;
          });
          return !isExists;
        });
        let srCount = utilFunction.GetMaxCdForDetails(oldData, "SR_CD");
        newData = newData.map((newData) => {
          return { ...newData, _isNewRow: true, SR_CD: srCount++ };
        });
        // console.log(oldData, [...existingData, ...newData]);
        return [...existingData, ...newData];
      });

      myparameterDataRef.current = data?.[0]?.PARAMETERS;

      setformName("dynDetail" + myVerifyCntRef.current);
      myVerifyCntRef.current = myVerifyCntRef.current + 1;
      setLocalError(false, "", "");
      enqueueSnackbar("Query Successfully Verified.", {
        variant: "success",
      });
    },
  });

  const onPopupYes = (rows) => {
    const pageSizesString = rows?.PAGE_SIZES?.join(",");
    const modifiedRows = {
      ...rows,
      PAGE_SIZES: pageSizesString,
    };

    mutation.mutate({
      data: modifiedRows,
      formMode: "",
    });
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  const onSubmitHandler = useCallback(
    ({
      data: datares,
      resultValueObj,
      resultDisplayValueObj,
      endSubmit,
      setFieldErrors,
      actionFlag,
    }) => {
      let data = clone(datares);
      //@ts-ignore
      endSubmit(true);

      if (!mySqlSyntaxRef.current) {
        setLocalError(true, "Please Verify Query..", "");
        endSubmit(true, "Please Verify Query..");
        return;
      }
      const query = mynewSqlSyntaxRef.current;
      if (data?.DML_ACTION === "MD") {
        const tableNames = ["MST_TABLE_NM", "DET_TABLE_NM"];
        const errors = {};

        for (const tableNameKey of tableNames) {
          const tableName = data?.[tableNameKey];
          if (!tableName || !query.includes(tableName)) {
            errors[
              tableNameKey
            ] = `The ${tableNameKey} table name "${tableName}" is not included in the query.`;
          }
        }
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return;
        }
      } else {
        const tableNameKey =
          data?.DML_ACTION === "M" ? "MST_TABLE_NM" : "DET_TABLE_NM";
        const tableName = data?.[tableNameKey];

        if (!tableName || !query.includes(tableName)) {
          setFieldErrors({
            [tableNameKey]: `The ${tableNameKey} table name "${tableName}" is not included in the query.`,
          });
          return;
        }
      }
      if (
        (formMode === "add" &&
          !data?.DETAILS_DATA?.isNewRow.some(
            (item) => item?.COLUMN_ACCESSOR === data?.ROWID_COLUMN
          )) ||
        (formMode === "edit" &&
          !result[0]?.data.find(
            (item) => item.COLUMN_ACCESSOR === data?.ROWID_COLUMN
          ))
      ) {
        setFieldErrors({
          ROWID_COLUMN: "Please enter a correct ROWID_COLUMN",
        });
        return;
      }

      setLocalLoading(true);
      const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
        setLocalLoading(isLoading);
        endSubmit(isLoading, error_msg, error_detail);
      };

      // data.SQL_ANSI_SYNTAX = mynewSqlSyntaxRef.current;
      data["COMP_CD"] = authState.companyID;
      data["BRANCH_CD"] = authState.user.branchCode;
      data["DENSE"] = Boolean(data["DENSE"]) ? "Y" : "N";

      data["ALLOW_COLUMN_REORDERING"] = Boolean(data["ALLOW_COLUMN_REORDERING"])
        ? "Y"
        : "N";
      data["DISABLE_GROUP_BY"] = Boolean(data["DISABLE_GROUP_BY"]) ? "Y" : "N";
      data["ENABLE_PAGINATION"] = Boolean(data["ENABLE_PAGINATION"])
        ? "Y"
        : "N";
      data["IS_CUSRSORFOCUSED"] = Boolean(data["IS_CUSRSORFOCUSED"])
        ? "Y"
        : "N";
      data["ALLOW_ROW_SELECTION"] = Boolean(data["ALLOW_ROW_SELECTION"])
        ? "Y"
        : "N";
      data["ISDOWNLOAD"] = Boolean(data["ISDOWNLOAD"]) ? "Y" : "N";

      if (data["_OLDROWVALUE"]) {
        const oldRowValue = data["_OLDROWVALUE"];

        for (const key in oldRowValue) {
          if (oldRowValue.hasOwnProperty(key)) {
            // Convert boolean values to "Y" or "N"
            if (typeof oldRowValue[key] === "boolean") {
              oldRowValue[key] = oldRowValue[key] ? "Y" : "N";
            }
          }
        }
      }

      data["_OLDROWVALUE"] = {
        ...data["_OLDROWVALUE"],
        PAGE_SIZES: data["_OLDROWVALUE"]?.PAGE_SIZES?.join(",") ?? "",
      };
      // let finalResult = CreateDetailsRequestData(myparameterDataRef.current);
      // data.PARAMETER = {
      //   DETAILS_DATA: finalResult,
      // };
      const newSomeData = myparameterDataRef.current?.filter(
        (item) => item && !item?._isTouchedCol?.COMPONENT_TYPE === false
      );

      let updPara = utilFunction.transformDetailDataForDML(
        result[1].data ?? [],
        newSomeData ?? [],
        ["SR_CD"]
      );
      data.PARAMETER = {
        DETAILS_DATA: updPara,
      };

      data.DETAILS_DATA["isUpdatedRow"] = data?.DETAILS_DATA?.isUpdatedRow?.map(
        (item) => {
          return {
            ...item,
            IS_VISIBLE: Boolean(item?.IS_VISIBLE) ? "Y" : "N",
            _OLDROWVALUE: {
              ...item?._OLDROWVALUE,
              IS_VISIBLE: Boolean(item?._OLDROWVALUE?.IS_VISIBLE) ? "Y" : "N",
            },
          };
        }
      );

      if (mynewSqlSyntaxRef.current !== myoldSqlSyntaxRef.current) {
        data["SQL_ANSI_SYNTAX"] = mynewSqlSyntaxRef.current;
        data["_OLDROWVALUE"] = {
          ...data["_OLDROWVALUE"],
          SQL_ANSI_SYNTAX: myoldSqlSyntaxRef.current,
        };
        data["_UPDATEDCOLUMNS"] = [
          ...data["_UPDATEDCOLUMNS"],
          "SQL_ANSI_SYNTAX",
        ];
      } else {
        data["SQL_ANSI_SYNTAX"] = myoldSqlSyntaxRef.current;
      }

      if (
        data["_UPDATEDCOLUMNS"].length === 0 &&
        data.DETAILS_DATA?.isUpdatedRow?.length === 0 &&
        data?.PARAMETER?.isUpdatedRow?.length === 0
      ) {
        closeDialog();
      } else {
        isErrorFuncRef.current = {
          data,
          SetLoadingOWN,
          endSubmit,
          formMode,
          setFieldErrors,
        };
        setIsOpenSave(true);
      }
    },
    [formMode]
  );

  const setLocalError = (isError, error_msg = "", error_detail = "") => {
    seterrorObjData({
      isError: isError,
      error: { error_msg: error_msg, error_detail: error_detail },
    });
  };

  const onCloseDialog = () => {
    setIsOpenRerieval(false);
  };
  const onSaveParameters = (data) => {
    myparameterDataRef.current = data;
    setIsOpenRerieval(false);
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;

  metadata = cloneDeep(DynamicGridConfigMetaData) as MasterDetailsMetaData;

  useEffect(() => {
    setSqlSyntax(reqData?.[0]?.data?.SQL_ANSI_SYNTAX ?? "");
    myoldSqlSyntaxRef.current = reqData?.[0]?.data?.SQL_ANSI_SYNTAX ?? "";
    mynewSqlSyntaxRef.current = reqData?.[0]?.data?.SQL_ANSI_SYNTAX ?? "";
  }, [result[0].data]);

  useEffect(() => {
    myparameterDataRef.current = result[1].data ?? [];
  }, [result[1].data]);

  const dynamicLabel =
    formMode !== "add"
      ? "Flexible Grid Configuration" +
        " For " +
        (reqData?.[0]?.data?.DESCRIPTION ?? "")
      : "Flexible Grid Configuration";

  return (
    <>
      {loading ? (
        <div style={{ margin: "2rem" }}>
          <LoaderPaperComponent />
          {typeof closeDialog === "function" ? (
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <IconButton onClick={closeDialog}>
                <HighlightOffOutlinedIcon />
              </IconButton>
            </div>
          ) : null}
        </div>
      ) : isError === true ? (
        <>
          <div style={{ margin: "1.2rem" }}>
            <Alert
              severity="error"
              errorMsg={errorMsg}
              errorDetail={error_detail ?? ""}
            />
          </div>
        </>
      ) : (
        <>
          <Grid
            container
            // style={{ marginTop: "27px" }}
          >
            <MyFullScreenAppBar />
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              // style={{
              //   paddingTop: "10px",
              //   paddingLeft: "10px",
              //   paddingRight: "10px",
              // }}
            >
              <AppBar position="relative" sx={{ marginBottom: "5px" }}>
                <Toolbar className={headerClasses.root} variant={"dense"}>
                  <Typography
                    className={headerClasses.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    {dynamicLabel}
                  </Typography>
                  {formMode === "view" ? (
                    <GradientButton
                      onClick={() => {
                        setActionsForm(true);
                      }}
                    >
                      Actions
                    </GradientButton>
                  ) : formMode === "edit" ? (
                    <GradientButton
                      onClick={() => {
                        setActionsForm(true);
                      }}
                    >
                      Actions
                    </GradientButton>
                  ) : null}

                  {formMode === "edit" ? (
                    <>
                      <GradientButton
                        onClick={(event) => {
                          myRef.current?.onSubmitHandler(event);
                        }}
                        // disabled={isLocalLoading}
                        // endIcon={
                        //   isLocalLoading ? <CircularProgress size={20} /> : null
                        // }
                      >
                        Save
                      </GradientButton>
                      <GradientButton
                        onClick={moveToViewMode}
                        color={"primary"}
                      >
                        Cancel
                      </GradientButton>
                    </>
                  ) : formMode === "view" ? (
                    <>
                      <GradientButton onClick={moveToEditMode}>
                        Edit
                      </GradientButton>
                      <GradientButton onClick={closeDialog}>
                        Close
                      </GradientButton>
                    </>
                  ) : (
                    <>
                      <GradientButton
                        onClick={(event) => {
                          myRef.current?.onSubmitHandler(event);
                        }}
                        // disabled={isLocalLoading}
                        // endIcon={
                        //   isLocalLoading ? <CircularProgress size={20} /> : null
                        // }
                      >
                        Save
                      </GradientButton>
                      <GradientButton onClick={closeDialog}>
                        Close
                      </GradientButton>
                    </>
                  )}
                </Toolbar>
              </AppBar>
              {mutation?.isError ? (
                <>
                  <Alert
                    severity="error"
                    errorMsg={mutation?.error?.error_msg ?? ""}
                    errorDetail={mutation?.error?.error_detail ?? ""}
                  />
                </>
              ) : null}
            </Grid>
            <Grid item xs={8} sm={6} md={8}>
              <MasterDetailsForm
                key={"dynGridConfig" + formMode}
                formNameMaster={"dynGridConfig" + formMode}
                formName={formName + formMode}
                metaData={metadata}
                ref={myRef}
                initialData={{
                  _isNewRow: formMode === "add" ? true : false,
                  ...reqData?.[0]?.data,
                  DETAILS_DATA: result[0].data,
                }}
                displayMode={formMode === "add" ? "New" : formMode}
                isLoading={formMode === "view" ? true : isLocalLoading}
                onSubmitData={onSubmitHandler}
                isNewRow={formMode === "add" ? true : false}
                containerstyle={{
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  paddingTop: "5px",
                }}
                formStyle={{
                  background: "white",
                  height: "52vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
                hideHeader={true}
                isError={errorObjData.isError}
                errorObj={errorObjData.error}
              >
                {({ isSubmitting, handleSubmit }) => {
                  return <></>;
                }}
              </MasterDetailsForm>
            </Grid>
            <Grid item xs={4} sm={6} md={4} style={{ paddingRight: "10px" }}>
              <Grid item xs={12} sm={12} md={12}>
                {verifySql.isError ? (
                  <div style={{ marginBottom: "5px" }}>
                    <AppBar position="relative" color="primary">
                      <Alert
                        severity="error"
                        errorMsg={
                          verifySql?.error?.error_msg ??
                          "Something went to wrong.."
                        }
                        errorDetail={verifySql?.error?.error_detail}
                        color="error"
                      />
                    </AppBar>
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={12} md={12} style={{ paddingTop: "12px" }}>
                <TextField
                  id="outlined-multiline-static"
                  label="SQL ANSI Query Syntax"
                  multiline
                  rows={verifySql.isError ? 29.4 : 32}
                  // minRows={verifySql.isError ? 21 : 24}
                  value={sqlSyntax}
                  variant="outlined"
                  color="secondary"
                  style={{
                    width: "100%",
                  }}
                  disabled={formMode === "view" ? true : false}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => {
                    mynewSqlSyntaxRef.current = event.target.value;
                    setSqlSyntax(event.target.value);
                    mySqlSyntaxRef.current = false;
                  }}
                  // onBlur={(event) => {
                  //   myTextFieldPositionRef.current = event.target?.selectionStart;
                  // }}
                />
              </Grid>
              <Grid
                container
                style={{ paddingTop: "07px", placeContent: "center" }}
              >
                <Grid item xs={12} sm={12} md={3}>
                  <GradientButton
                    disabled={verifySql.isLoading}
                    endIcon={
                      verifySql.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                    onClick={() => {
                      if (Boolean(sqlSyntax)) {
                        verifySql.mutate({ sqlSyntax, detailsData: [] });
                      } else {
                        enqueueSnackbar("Please Enter SQL Syntax.", {
                          variant: "warning",
                        });
                      }
                    }}
                  >
                    Verify
                  </GradientButton>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <GradientButton
                    // style={{ marginLeft: "20px" }}
                    onClick={() => {
                      if (!Boolean(sqlSyntax)) {
                        enqueueSnackbar("Please Enter SQL Syntax.", {
                          variant: "warning",
                        });
                      } else if (!mySqlSyntaxRef.current) {
                        enqueueSnackbar("Please Verify SQL Syntax.", {
                          variant: "warning",
                        });
                      } else {
                        // createRetrievalMetaData(sqlSyntax);
                        setIsOpenRerieval(true);
                      }
                    }}
                  >
                    Parameter
                  </GradientButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      {isActionsForm ? (
        <ActionFormWrapper
          isOpen={isActionsForm}
          formView={formMode}
          onClose={() => {
            setActionsForm(false);
          }}
          data={reqData}
          docCD={docCD}
          // reqDataRef={mysubdtlRef}
        />
      ) : null}
      {isOpenRerieval ? (
        <RetrievalParametersGrid
          isOpen={isOpenRerieval}
          formMode={undefined}
          onClose={onCloseDialog}
          rowsData={myparameterDataRef.current}
          onSaveData={onSaveParameters}
          docCD={docCD}
        />
      ) : null}
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenSave}
          loading={mutation.isLoading}
        />
      ) : null}
    </>
  );
};

export const DynamicGridConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      fullScreen={true}
      PaperProps={{
        style: {
          width: "100%",
          // height: "110vh",
          overflow: "auto",
        },
      }}
      // maxWidth="lg"
    >
      <DynamicGridConfig
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        docCD={data?.[0]?.data?.DOC_CD ?? ""}
        data={data}
      />
    </Dialog>
  );
};
