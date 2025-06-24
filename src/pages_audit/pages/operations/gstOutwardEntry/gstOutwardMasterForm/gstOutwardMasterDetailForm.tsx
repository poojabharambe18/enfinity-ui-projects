import { AppBar, Box, CircularProgress, Dialog } from "@mui/material";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GstOutwardForm } from "./gstOutwarsMasterMetaData";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { TemplateDetail } from "../templateDetail/templateDetail";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import * as APIs from "../gstOutwardEntryConfirmation/api";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { cloneDeep } from "lodash";
import {
  Alert,
  utilFunction,
  ClearCacheContext,
  queryClient,
  ActionTypes,
  usePopupContext,
  GradientButton,
  MasterDetailsMetaData,
  MasterDetailsForm,
} from "@acuteinfo/common-base";
import { getdocCD } from "components/utilFunction/function";
const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: true,
    alwaysAvailable: true,
  },
];
export const GstOutwardMasterDetailForm = ({
  ClosedEventCall,
  defaultView,
  screenFlag,
  refetchData,
}) => {
  const [gridData, setGridData]: any = useState([]);
  const { state: rows }: any = useLocation();
  const myRef = useRef<any>(null);
  const oldDataRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [dilogueOpen, setDilogueOpen] = useState(false);
  const [totalTaxAmount, setTotalTaxAmount] = useState<number>(0);
  const [trancdjoin, setTrancdJoin] = useState("");
  const [rowsData, setRowsData] = useState([]);
  const navigate = useNavigate();
  const [disableButton, setDisableButton] = useState(false);
  const [saveButton, setSaveButton] = useState(true);
  console.log("saveButton: ", saveButton);
  const [previousValue, setPreviousValue] = useState([]);
  let currentPath = useLocation().pathname;
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const handleButtonDisable = (disable) => {
    setDisableButton(disable);
  };
  const prevPreviousValue = useRef(previousValue);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["getGstOutwardGridRetrive", rows?.[0]?.data?.REF_TRAN_CD],
    () =>
      API.getGstOutwardGridRetrive({
        comp_cd: authState?.companyID,
        branch_cd: authState?.user?.branchCode,
        ref_tran_cd: rows?.[0]?.data?.REF_TRAN_CD,
      }),
    {
      enabled: defaultView === "view" || defaultView === "edit",
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          oldDataRef.current = data;
          setGridData(data);
          const tranCdList = data.map((item) => item.TRAN_CD);
          const tranCdString = tranCdList.join(",");
          setTrancdJoin(tranCdString);
          const totalAmount = data.reduce(
            (acc, row) =>
              acc +
              (Number(row.TAXABLE_VALUE) || 0) +
              (Number(row.TAX_AMOUNT) || 0),
            0
          );
          setTotalTaxAmount(totalAmount);
        }
      },
    }
  );
  const closeDialog = () => {
    if (ClosedEventCall) ClosedEventCall();
  };
  const mutation = useMutation(API.getGstOutwardENtryDML, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      if (data?.[0]?.O_STATUS === "9") {
        const VoucherConfirmation = await MessageBox({
          messageTitle: data?.[0]?.O_MSG_TITLE,
          message: data?.[0]?.O_MESSAGE,
          buttonNames: ["Ok"],
        });
        if (VoucherConfirmation === "Ok") {
          CloseMessageBox();
          closeDialog();
          refetchData();
        }
      } else {
        CloseMessageBox();
        closeDialog();
        refetchData();
        enqueueSnackbar(t("Success"), {
          variant: "success",
        });
      }
    },
  });
  const singleDeletemutation = useMutation(API.getGstOutwardENtryDML, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      CloseMessageBox();
      refetch();
      enqueueSnackbar(t("Success"), {
        variant: "success",
      });
    },
  });
  const viewVoucherMutate = useMutation(APIs.getVoucherDetail, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      const btnName = await MessageBox({
        message: data?.[0]?.VOUCHER_MESSAGE,
        messageTitle: "Voucher",
        buttonNames: ["Ok"],
      });
      if (btnName === "Ok") {
        CloseMessageBox();
      }
    },
  });
  const confirmationAccept = useMutation(API.gstOutwardEntryConfirmation, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      CloseMessageBox();
      closeDialog();
      refetchData();
      enqueueSnackbar(t("Success"), {
        variant: "success",
      });
    },
  });
  useEffect(() => {
    if (prevPreviousValue.current !== previousValue) {
      myRef.current?.setGridData((existingData) => {
        const updatedData = existingData.map((row) => {
          if (row._isNewRow) {
            return {
              ...row,
              TEMP_DISP: "",
              TEMPLATE_CODE: "",
            };
          }
          return row;
        });
        return updatedData;
      });
    }
  }, [previousValue]);
  const getFormData = (formData, isUpdating, tranCd) => {
    myRef.current?.setGridData((existingData) => {
      if (isUpdating) {
        const updatedData = existingData?.map((data) => {
          if (tranCd === data?.TRAN_CD) {
            return { ...data, ...formData };
          }
          return data;
        });
        return updatedData;
      }
      return [...existingData, formData]?.map((data, index) => {
        return {
          ...data,
          TRAN_CD: index + 1,
          _isNewRow: true,
        };
      });
    });

    setDilogueOpen(false);
  };

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "add") {
        setRowsData(data?.rows);
        setDilogueOpen(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const onSubmitHandler = async ({
    data,
    displayData,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldError,
    actionFlag,
  }) => {
    //@ts-ignore
    endSubmit(true);
    if (defaultView === "new" && actionFlag === "Save") {
      const transformedData = {
        _isNewRow: true,
        BRANCH_CD: data?.BRANCH_CD?.trim() ?? "",
        ACCT_TYPE: data?.ACCT_TYPE?.trim() ?? "",
        ACCT_CD: data?.ACCT_CD?.trim() ?? "",
        MODE_OF_PAYMENT: data?.MODE ?? "",
        GST_DTL: data?.DETAILS_DATA?.isNewRow?.map((row: any) => ({
          TEMPLATE_CODE: row?.TEMPLATE_CODE ?? "",
          TAXABLE_VALUE: row?.TAXABLE_VALUE ?? "",
          TAX_AMOUNT: row?.TAX_AMOUNT ?? "",
          CHEQUE_NO: row?.CHEQUE_NO ? row?.CHEQUE_NO : "0",
          CHEQUE_DT: row?.CHEQUE_DT
            ? format(new Date(row?.CHEQUE_DT), "dd-MMM-yyyy")
            : "",
          REMARKS: row?.REMARKS ?? "",
        })),
        SCREEN_REF: docCD ?? "",
      };
      if (transformedData?.GST_DTL?.[0]?.TEMPLATE_CODE?.length === 0) {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: "Require value Missing For Template",
          buttonNames: ["Ok"],
          icon: "ERROR",
        });
      } else {
        const btnName = await MessageBox({
          message: "SaveData",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          icon: "CONFIRM",
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          mutation.mutate(transformedData);
        }
      }
    } else {
      const singleRowDeleteData = rows?.[0]?.data;
      if (
        new Date(singleRowDeleteData?.ENTERED_DATE).toDateString() !==
        new Date(authState?.workingDate).toDateString()
      ) {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: "CannotDeleteBackDatedEntry",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
      } else {
        const NewData = myRef?.current?.GetGirdData?.();
        const NewFilter = NewData.map((row) => ({
          ENTERED_BRANCH_CD: row.ENTERED_BRANCH_CD,
          ENTERED_COMP_CD: row.ENTERED_COMP_CD,
          TRAN_CD: row.TRAN_CD,
        }));
        const OldData = oldDataRef?.current;
        const OldFilter = OldData.map((row) => ({
          ENTERED_BRANCH_CD: row.ENTERED_BRANCH_CD,
          ENTERED_COMP_CD: row.ENTERED_COMP_CD,
          TRAN_CD: row.TRAN_CD,
        }));
        const CompareData = utilFunction.transformDetailDataForDML(
          OldFilter ?? [],
          NewFilter,
          ["TRAN_CD"]
        );
        const SingleRowdeleteDataFilter = {
          _isDeleteRow: true,
          ENTERED_BRANCH_CD: authState?.user?.branchCode,
          ENTERED_COMP_CD: authState?.companyID,
          REF_TRAN_CD: singleRowDeleteData?.REF_TRAN_CD,
          BRANCH_CD: singleRowDeleteData?.BRANCH_CD,
          ACCT_TYPE: singleRowDeleteData?.ACCT_TYPE,
          ACCT_CD: singleRowDeleteData?.ACCT_CD,
          AMOUNT: "",
          SCREEN_REF: "GST Outward Entry Screen",
          TRAN_TYPE: "Delete",
          CONFIRMED: singleRowDeleteData?.CONFIRMED,
          ENTERED_BY: singleRowDeleteData?.ENTERED_BY,
          DETAILS_DATA: { ...CompareData },
        };
        const btnName = await MessageBox({
          message: "SaveData",
          messageTitle: "Confirmation",
          icon: "CONFIRM",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          singleDeletemutation.mutate(SingleRowdeleteDataFilter);
        }
      }
    }
  };

  const handleRemove = async (event) => {
    const formDatass = rows?.[0]?.data;
    if (
      new Date(formDatass?.ENTERED_DATE).toDateString() !==
      new Date(authState?.workingDate).toDateString()
    ) {
      if (defaultView === "edit") {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: "CannotDeleteBackDatedEntry",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
      } else {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: "BackDatedEntryCantBeReject",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
      }
    } else {
      const deleteData = {
        _isDeleteRow: true,
        ENTERED_BRANCH_CD: authState?.user?.branchCode,
        ENTERED_COMP_CD: authState?.companyID,
        REF_TRAN_CD: formDatass?.REF_TRAN_CD,
        BRANCH_CD: formDatass?.BRANCH_CD,
        ACCT_TYPE: formDatass?.ACCT_TYPE,
        ACCT_CD: formDatass?.ACCT_CD,
        AMOUNT: totalTaxAmount.toString(),
        SCREEN_REF: "GST Outward Entry Screen",
        TRAN_TYPE: "Delete",
        CONFIRMED: formDatass?.CONFIRMED,
        ENTERED_BY: formDatass?.ENTERED_BY,
        DETAILS_DATA: {
          isNewRow: [],
          isDeleteRow: [],
          isUpdatedRow: [],
        },
      };
      if (screenFlag === "gstEntry") {
        const confirmation = await MessageBox({
          message: "DeleteData",
          messageTitle: "Confirmation",
          icon: "CONFIRM",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (confirmation === "Yes") {
          mutation.mutate(deleteData);
        }
      } else {
        const confirmation = await MessageBox({
          message: "RejectDeleteRecord",
          messageTitle: "Confirmation",
          icon: "CONFIRM",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (confirmation === "Yes") {
          mutation.mutate(deleteData);
        }
      }
    }
  };
  const viewVoucher = () => {
    if (
      new Date(rows?.[0]?.data?.ENTERED_DATE).toDateString() !==
      new Date(authState?.workingDate).toDateString()
    ) {
      return "";
    } else {
      viewVoucherMutate.mutate({
        ENT_COMP_CD: rows?.[0]?.data?.ENTERED_COMP_CD,
        ENT_BRANCH_CD: rows?.[0]?.data?.ENTERED_BRANCH_CD,
        GD_DATE: authState?.workingDate,
        TRAN_CD: trancdjoin,
      });
    }
  };
  const Accept = async () => {
    if (
      new Date(rows?.[0]?.data?.ENTERED_DATE).toDateString() !==
      new Date(authState?.workingDate).toDateString()
    ) {
      await MessageBox({
        messageTitle: "ValidationFailed",
        message: "BackDatedEntryCantBeConfirm",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    } else if (rows?.[0]?.data?.LAST_ENTERED_BY === authState?.user?.id) {
      await MessageBox({
        messageTitle: "InvalidConfirmation",
        message: "ConfirmTransactionRestrictionMessage",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    } else if (authState?.role < "2") {
      await MessageBox({
        messageTitle: "InvalidConfirmation",
        message: "ConfirmRightsRestrictionMessage",
        icon: "WARNING",
        buttonNames: ["Ok"],
      });
    } else {
      const confirmation = await MessageBox({
        messageTitle: "Confirmation",
        message: "ConfirmRecord",
        icon: "CONFIRM",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (confirmation === "Yes") {
        confirmationAccept.mutate({
          ENTERED_COMP_CD: rows?.[0]?.data?.ENTERED_COMP_CD,
          ENTERED_BRANCH_CD: rows?.[0]?.data?.ENTERED_BRANCH_CD,
          REF_TRAN_CD: rows?.[0]?.data?.REF_TRAN_CD,
        });
      }
    }
  };
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getGstOutwardGridRetrive"]);
    };
  }, [getEntries]);

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(GstOutwardForm) as MasterDetailsMetaData;
  const metaData = useMemo(() => {
    let myColumns = metadata.masterForm.form.label;
    if (defaultView === "view" || defaultView === "edit") {
      myColumns = `${utilFunction?.getDynamicLabel(
        currentPath,
        authState?.menulistdata,
        true
      )}  TRAN-CD: ${rows?.[0]?.data?.REF_TRAN_CD} ACCT-NM: ${
        rows?.[0]?.data?.ACCT_NM
      }`;
    } else {
      myColumns = utilFunction?.getDynamicLabel(
        currentPath,
        authState?.menulistdata,
        true
      );
    }
    return {
      ...metadata,
      masterForm: {
        ...metadata.masterForm,
        form: {
          ...metadata.masterForm.form,
          label: myColumns,
        },
      },
    };
  }, [defaultView, metadata]);
  return (
    <Fragment>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            height: "auto",
          },
        }}
        maxWidth="xl"
      >
        {isError && (
          <>
            <Box style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={error?.error_msg ?? "Something went to wrong.."}
                  errorDetail={error?.error_detail}
                  color="error"
                />
              </AppBar>
            </Box>
          </>
        )}
        <MasterDetailsForm
          key={
            "formGstOutwardEnterTemplate-" +
            defaultView +
            JSON.stringify(gridData)
          }
          metaData={metaData}
          ref={myRef}
          initialData={{
            ...rows?.[0]?.data,
            DETAILS_DATA: gridData,
          }}
          displayMode={defaultView}
          actions={defaultView === "new" ? actions : []}
          setDataOnFieldChange={(action, payload) => {
            if (action === "TemplateOpen") {
              setDilogueOpen(payload?.OPEN === "SHOW" ? true : false);
            }
            if (action === "GET_DATA") {
              setPreviousValue(payload?.MODE_VALUE);
            }
          }}
          isLoading={isLoading || isFetching}
          handelActionEvent={setCurrentAction}
          formState={{
            docCD: docCD,
            MessageBox: MessageBox,
            defaultView: defaultView,
            handleButtonDisable: handleButtonDisable,
            setDilogueOpen,
          }}
          onSubmitData={onSubmitHandler}
          onClickActionEvent={async (index, id, data) => {
            if (defaultView === "edit") {
              if (id === "DELETE_ROW") {
                const SingleRecordDelete = await MessageBox({
                  message: "DeleteData",
                  messageTitle: "Confirmation",
                  icon: "CONFIRM",
                  buttonNames: ["Yes", "No"],
                });
                if (SingleRecordDelete === "Yes") {
                  setSaveButton(false);
                  setGridData((old) => {
                    return [...old, { ...data }];
                  });
                  let newData = gridData.filter(
                    (row) => row.TRAN_CD !== data?.TRAN_CD
                  );
                  CloseMessageBox();
                  setGridData(newData);
                }
              }
            } else if (defaultView === "new") {
              if (id === "DELETE_ROW") {
                const SingleRecordDelete = await MessageBox({
                  message: "DeleteData",
                  messageTitle: "Confirmation",
                  buttonNames: ["Yes", "No"],
                  icon: "CONFIRM",
                });
                if (SingleRecordDelete === "Yes") {
                  const dataGrid = myRef?.current?.GetGirdData();
                  let newData = dataGrid.filter(
                    (row) => row.TRAN_CD !== data?.TRAN_CD
                  );
                  CloseMessageBox();
                  myRef.current?.setGridData(newData);
                }
              }
            }
          }}
          formName={"formGstOutwardEnterTemplate"}
          formNameMaster={"fromGstOutwardEnterTemplateMaster"}
          containerstyle={{
            padding: "10px",
          }}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting: ", isSubmitting);
            return (
              <>
                {defaultView === "new" ? (
                  <>
                    <GradientButton
                      onClick={(event) => handleSubmit(event, "Save")}
                      color={"primary"}
                      disabled={isSubmitting || disableButton}
                    >
                      {t("Save")}
                    </GradientButton>
                    <GradientButton onClick={closeDialog} color={"primary"}>
                      {t("Close")}
                    </GradientButton>
                  </>
                ) : defaultView === "edit" ? (
                  <>
                    <GradientButton color={"primary"} onClick={handleRemove}>
                      {t("Delete")}
                    </GradientButton>
                    <GradientButton
                      onClick={(event) => handleSubmit(event, "SingleDelete")}
                      color={"primary"}
                      disabled={isSubmitting || saveButton}
                    >
                      {t("Save")}
                    </GradientButton>
                    <GradientButton onClick={closeDialog} color={"primary"}>
                      {t("Close")}
                    </GradientButton>
                  </>
                ) : defaultView === "view" ? (
                  <>
                    <GradientButton
                      color={"primary"}
                      onClick={Accept}
                      // disabled={rows?.[0]?.data?.ALLOW_CONFIRM === "N"}
                    >
                      {t("Confirm")}
                    </GradientButton>
                    <GradientButton color={"primary"} onClick={handleRemove}>
                      {t("Reject")}
                    </GradientButton>
                    <GradientButton
                      color={"primary"}
                      onClick={viewVoucher}
                      // disabled={viewVoucherMutate.isLoading}
                      disabled={
                        new Date(
                          rows?.[0]?.data?.ENTERED_DATE
                        ).toDateString() !==
                        new Date(authState?.workingDate).toDateString()
                      }
                      endIcon={
                        viewVoucherMutate.isLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                    >
                      View Voucher
                    </GradientButton>
                    <GradientButton onClick={closeDialog} color={"primary"}>
                      Close
                    </GradientButton>
                  </>
                ) : null}
              </>
            );
          }}
        </MasterDetailsForm>
        {dilogueOpen ? (
          <TemplateDetail
            open={dilogueOpen}
            onClose={() => setDilogueOpen(false)}
            getFormData={getFormData}
            refData={myRef}
            rowsData={rowsData}
          />
        ) : null}
      </Dialog>
    </Fragment>
  );
};
