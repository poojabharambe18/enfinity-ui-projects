import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { useMutation, useQuery } from "react-query";
import { DocumentGridMetadata } from "./documentGridMetadata";
import { useNavigate } from "react-router-dom";
import KYCDocumentMasterDetails from "./KYCDocumentMasterDetails";
import { Button, Grid } from "@mui/material";
import { t } from "i18next";
import { addMonths, format } from "date-fns";
import _ from "lodash";
import {
  utilFunction,
  GridWrapper,
  GridMetaDataType,
} from "@acuteinfo/common-base";
import TabNavigate from "../TabNavigate";
const Document = () => {
  const { authState } = useContext(AuthContext);
  const {
    state,
    handleColTabChangectx,
    handleStepStatusctx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
    handleCurrFormctx,
  } = useContext(CkycContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [data, setData] = useState<any>([]);
  const dataRef = useRef<any[]>([]);
  const [formMode, setFormMode] = useState<any>("");
  const [isNextLoading, setIsNextLoading] = useState(false);
  const isDataChangedRef = useRef(false);
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      // isDataChangedRef.current = true;
      // refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  const myGridRef = useRef<any>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data, setData]);

  // useEffect(() => {
  //   console.log('rowsData change', rowsData)
  // }, [rowsData])

  const initValues = useMemo(() => {
    return state?.isFreshEntryctx
      ? state?.formDatactx["DOC_MST"]
        ? state?.formDatactx["DOC_MST"]
        : []
      : state?.retrieveFormDataApiRes
      ? state?.retrieveFormDataApiRes["DOC_MST"]
      : [];
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);
  useEffect(() => {
    setData(initValues);
  }, [initValues]);

  const mutation: any = useMutation(API.getKYCDocumentGridData, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error: any) => {},
  });

  useEffect(() => {
    let refs = state?.formmodectx !== "new" ? [onUpdate] : [onSave];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    // console.log(state?.formDatactx["DOC_MST"], "wadqwdwq. doc", state?.retrieveFormDataApiRes["DOC_MST"])
    if (
      state?.isFreshEntryctx &&
      !(
        Boolean(state?.formDatactx["DOC_MST"]) ||
        Boolean(state?.retrieveFormDataApiRes["DOC_MST"])
      )
    ) {
      let payload = {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        CUST_TYPE: state?.entityTypectx,
        CONSTITUTION_TYPE: state?.constitutionValuectx ?? "",
      };
      mutation.mutate(payload);
    }
  }, []);

  const afterFormSubmit = (formData, submitFormMode) => {
    // console.log(formData, "wadqwdwq. doc afterFormSubmit", submitFormMode)
    if (submitFormMode === "new") {
      setData((old) => {
        // console.log(formData, "wadqwdwq. doc afterFormSubmit new",old)
        if (!Array.isArray(old)) {
          return [
            {
              ...formData,
              SR_CD: 1,
              IsNewRow: true,
            },
          ];
        } else {
          let srCount = utilFunction.GetMaxCdForDetails(old, "SR_CD");
          const myNewRowObj = {
            ...formData,
            SR_CD: String(srCount),
            // _isNewRow: true,
            IsNewRow: true,
          };
          return [...old, myNewRowObj];
        }
      });
    } else {
      setData((old) => {
        // console.log(formData, "wadqwdwq. doc afterFormSubmit old",old)
        return old.map((item) => {
          if (item.SR_CD === formData.SR_CD) {
            let { SR_CD, ...other } = formData;
            return { ...item, ...other };
          } else {
            return item;
          }
        });
      });
    }

    setOpen(false);
  };

  const actions = [
    {
      actionName: "view-details",
      actionLabel: "View Details",
      multiple: false,
      rowDoubleClick: true,
    },
    // {
    //   actionName: "delete",
    //   actionLabel: "Delete",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    {
      actionName: "add",
      actionLabel: "Add",
      multiple: undefined,
      rowDoubleClick: true,
      alwaysAvailable: true,
    },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "add") {
        setOpen(true);
        setFormMode("new");
        setRowsData(data?.rows);
      } else if (data.name === "delete") {
        setOpen(true);
        // setComponentToShow("Delete")
        setRowsData(data?.rows);
      } else if (data.name === "view-details") {
        // setComponentToShow("view-details")
        setFormMode("edit");
        setRowsData(data?.rows);
        setOpen(true);
      }
      // navigate(data?.name, {
      //   state: data?.rows,
      // });
    },
    [navigate]
  );

  const onSave = () => {
    // console.log("on save doc data", data, dataRef.current)
    // console.log("wadqwdwq. doc save", data)
    if (dataRef.current && dataRef.current.length > 0) {
      let newDocData: any[] = [];

      newDocData = dataRef.current.map((doc) => {
        // console.log("wadqwdwq. doc save newdoc", doc);
        const {
          TEMPLATE_CD,
          SUBMIT,
          VALID_UPTO,
          DOC_NO,
          DOC_IMAGE,
          DOC_DESCRIPTION,
          SR_CD,
          DOC_WEIGHTAGE,
        } = doc;
        let newObj = {
          _isNewRow: true,
          TEMPLATE_CD: TEMPLATE_CD,
          // SUBMIT: Boolean(SUBMIT) ? "Y" : "N",
          SUBMIT: SUBMIT === true ? "Y" : "N",
          VALID_UPTO: VALID_UPTO ?? "",
          // VALID_UPTO: VALID_UPTO
          //   ? format(new Date(doc?.VALID_UPTO ?? ""), "dd-MMM-yyyy")
          //   : format(new Date(addMonths(new Date(), 9999)), "dd-MMM-yyyy"),
          DOC_NO: DOC_NO ?? "",
          DOC_DESCRIPTION: DOC_DESCRIPTION,
          DOC_IMAGE: DOC_IMAGE ?? "",
          DOC_TYPE: "KYC",
          DOC_AMOUNT: "",
          DOC_WEIGHTAGE: DOC_WEIGHTAGE ?? "",
          SR_CD: SR_CD ?? "",
          // ACTIVE : "Y",
        };
        // console.log("wadqwdwq. doc save newdoc --after", newObj);
        return newObj;
      });

      let newData = state?.formDatactx;
      newData["DOC_MST"] = [...newDocData];
      handleFormDataonSavectx(newData);
      // handleStepStatusctx({
      //   status: "completed",
      //   coltabvalue: state?.colTabValuectx,
      // });
      // handleColTabChangectx(state?.colTabValuectx + 1);
    } else {
      let newData = state?.formDatactx;
      newData["DOC_MST"] = [];
      handleFormDataonSavectx(newData);
    }
    handleStepStatusctx({
      status: "completed",
      coltabvalue: state?.colTabValuectx,
    });
    handleCurrFormctx({
      currentFormSubmitted: true,
      isLoading: false,
    });
    // handleColTabChangectx(state?.colTabValuectx + 1);
  };

  const onUpdate = () => {
    // console.log("on update doc data", data, dataRef.current)

    setIsNextLoading(true);
    // console.log("qweqweqweo", data, data.OTHER_ADDRESS)
    if (dataRef.current) {
      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
      // console.log("wadqwdwq. doc update data", data);
      let newData = state?.formDatactx;
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
      if (dataRef.current && dataRef.current.length > 0) {
        let filteredCols: any[] = [
          "VALID_UPTO",
          "DOC_IMAGE",
          "SUBMIT",
          "TEMPLATE_CD",
          "DOC_NO",
          "DOC_DESCRIPTION",
          "SR_CD",
          "TRAN_CD",
        ];

        let newFormatOtherAdd = dataRef.current.map((formRow, i) => {
          // console.log("wadqwdwq. doc update formRow", formRow)
          return {
            ...dataRef.current[i],
            ...commonData,
            SUBMIT: Boolean(formRow?.SUBMIT) ? "Y" : "N",
          };
        });
        // console.log("new", newFormatOtherAdd, "wadqwdwq. doc update old", data)

        newData["DOC_MST"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);

        if (!state?.isFreshEntryctx) {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            DOC_MST: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["DOC_MST"] = [];
        handleFormDataonSavectx(newData);
        if (!state?.isFreshEntryctx) {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            DOC_MST: [],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      }

      // newData["OTHER_ADDRESS"] = {...newData["OTHER_ADDRESS"], ...newFormatOtherAdd}
      handleStepStatusctx({
        status: "completed",
        coltabvalue: state?.colTabValuectx,
      });
      handleCurrFormctx({
        currentFormSubmitted: true,
        isLoading: false,
      });
      // handleColTabChangectx(state?.colTabValuectx+1)
    }
    //  else {
    //     handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
    // }
    setIsNextLoading(false);
  };

  const SaveUpdateBTNs = useMemo(() => {
    if (state?.formmodectx) {
      return state?.formmodectx == "new" ? (
        <Fragment>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={onSave}
          >
            {t("Next")}
            {/* {t("Save & Next")} */}
          </Button>
        </Fragment>
      ) : state?.formmodectx == "edit" ? (
        <Fragment>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={onUpdate}
          >
            {t("Update & Next")}
          </Button>
        </Fragment>
      ) : (
        state?.formmodectx == "view" && (
          <Fragment>
            <Button
              sx={{ mr: 2, mb: 2 }}
              color="secondary"
              variant="contained"
              disabled={isNextLoading}
              onClick={(e) => {
                handleStepStatusctx({
                  status: "completed",
                  coltabvalue: state?.colTabValuectx,
                });
                handleColTabChangectx(state?.colTabValuectx + 1);
              }}
            >
              {t("Next")}
            </Button>
          </Fragment>
        )
      );
    }
  }, [state?.formmodectx, data]);

  return (
    <Grid
      container
      style={{
        position: "absolute",
        paddingRight: !state?.isFreshEntryctx ? "113px" : "12px",
      }}
    >
      <GridWrapper
        key={`operatorMasterGrid` + data + setData}
        finalMetaData={DocumentGridMetadata as GridMetaDataType}
        data={data ?? []}
        setData={setData}
        loading={mutation.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        // refetchData={() => refetch()}
        ref={myGridRef}
        onClickActionEvent={(index, id, currentData) => {
          // console.log(data, "qjwkdjbiqwudqd", index, id, currentData)
          let newData: any[] = [];
          newData =
            data.length > 0 &&
            data.filter((row) => row.SR_CD !== currentData.SR_CD);
          setData([...newData]);
        }}
      />
      <TabNavigate
        handleSave={state?.formmodectx !== "new" ? onUpdate : onSave}
        displayMode={state?.formmodectx ?? "new"}
      />

      {open ? (
        <KYCDocumentMasterDetails
          isDataChangedRef={isDataChangedRef}
          ClosedEventCall={handleDialogClose}
          formMode={formMode}
          afterFormSubmit={afterFormSubmit}
          open={open}
          onClose={() => setOpen(false)}
          gridData={data}
          rowsData={rowsData}
        />
      ) : null}
    </Grid>
  );
};

export default Document;
