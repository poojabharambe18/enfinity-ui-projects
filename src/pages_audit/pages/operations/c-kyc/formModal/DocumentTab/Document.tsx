import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { AuthContext } from "pages_audit/auth";
import * as API from "../../api";
import { DocumentGridMetadata } from "./docGridmetadata";
import { CkycContext } from "../../CkycContext";
import TabNavigate from "../formDetails/formComponents/TabNavigate";
import { DocMasterDTLForm } from "./DocMasterDTLForm";
import {
  utilFunction,
  PopupMessageAPIWrapper,
  GridWrapper,
  GridMetaDataType,
} from "@acuteinfo/common-base";
import { format } from "date-fns";

const Document = () => {
  const navigate = useNavigate();
  const {
    state: ckycState,
    handleFormDataonSavectx,
    handleCurrFormctx,
    handleStepStatusctx,
    handleModifiedColsctx,
    toNextTab,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const reqCD = ckycState?.req_cd_ctx ?? "";
  const custID = ckycState?.customerIDctx ?? "";

  const [girdData, setGridData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"view" | "new" | "edit">("view");
  const [isDelConfirm, setIsDelConfirm] = useState<boolean>(false);

  const myGridRef = useRef<any>(null);
  const currRowRef = useRef<any>({}); //current grid row
  const changedRowsRef = useRef<any[]>([]); // final api payload
  const isDataChangedRef = useRef(false);

  let docTemplatePayload = {
    COMP_CD: authState?.companyID ?? "",
    BRANCH_CD: authState?.user?.branchCode ?? "",
    CUST_TYPE: ckycState?.entityTypectx,
    CONSTITUTION_TYPE: ckycState?.constitutionValuectx ?? "",
  };

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      // custDocMutation.mutate(payload);
      isDataChangedRef.current = false;
    }
    setIsOpen(false);
  };

  const DocTemplateMutation: any = useMutation(API.getKYCDocumentGridData, {
    onSuccess: (data) => {
      if (Array.isArray(data) && data.length > 0) {
        let newData: any[] = data;
        newData = newData.map((doc) => {
          return {
            ...doc,
            TRANSR_CD: `${doc.SR_CD}`,
            SUBMIT: doc.SUBMIT === "Y" ? true : false,
          };
        });
        setGridData([...newData]);
      }
    },
  });

  const actions = [
    {
      actionName: "edit-details",
      actionLabel: "View Details",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "add",
      actionLabel: "Add",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "add") {
        setFormMode("new");
        setIsOpen(true);
      } else if (data?.name === "edit-details") {
        currRowRef.current = data?.rows?.[0]?.data ?? {};
        setFormMode("view");
        setIsOpen(true);
      }
    },
    [navigate]
  );

  const onDeleteDocument = async () => {
    let mainDocDelPayload = {
      _isDeleteRow: true,
      TRAN_CD: currRowRef.current?.TRAN_CD,
      SR_CD: currRowRef.current?.SR_CD,
      REQ_CD: reqCD,
      // IS_FROM_MAIN:
      // currRowRef.current?.IS_FROM_MAIN ?? "N",
      // NEW_FLAG: "N",
      DETAILS_DATA: {
        isDeleteRow: [],
        isNewRow: [],
        isUpdatedRow: [],
      },
    };
    let newData = await myGridRef?.current?.cleanData?.();
    // console.log("wekufweyfgwef on del newData", newData, currRowRef?.current)
    if (!Array.isArray(newData)) {
      newData = [newData];
    }
    if (newData?.length > 0) {
      newData = newData?.filter(
        (row) => row.TRANSR_CD !== currRowRef?.current?.TRANSR_CD
      );
    }
    setGridData([...newData]);

    let changedRows = changedRowsRef.current;
    if (ckycState?.isFreshEntryctx) {
      // remove from payload - deleted main row - for fresh entry
      changedRows = changedRowsRef.current?.filter(
        (row) => !Boolean(row?.SR_CD === mainDocDelPayload?.SR_CD)
      );
    } else {
      // add in payload - removed existing main row
      if (Boolean(currRowRef?.current?._isNewRow)) {
        changedRows = changedRowsRef.current?.filter(
          (row) => !Boolean(row?.TRANSR_CD === currRowRef?.current?.TRANSR_CD)
        );
      } else {
        changedRows = changedRowsRef.current?.filter(
          (row) => !Boolean(row?.TRANSR_CD === currRowRef?.current?.TRANSR_CD)
        );
        changedRows = [...changedRows, mainDocDelPayload];
      }
    }
    changedRowsRef.current = [...changedRows];
    setIsDelConfirm(false);
  };

  const handleSave = async () => {
    let newGridData = await myGridRef?.current?.cleanData?.();
    // console.log("doccon save", newGridData)

    if (ckycState?.isFreshEntryctx) {
      let newGridDt = newGridData?.map((mainDocRow) => {
        let newMainDocRow = mainDocRow;
        let updateValue = utilFunction.transformDetailsData(newMainDocRow, []);

        if (typeof newMainDocRow.SUBMIT === "boolean") {
          if (Boolean(newMainDocRow.SUBMIT)) {
            newMainDocRow["SUBMIT"] = "Y";
          } else {
            newMainDocRow["SUBMIT"] = "N";
          }
        } else {
          newMainDocRow["SUBMIT"] = newMainDocRow.SUBMIT;
        }
        newMainDocRow = _.omit(newMainDocRow, [
          "SR_CD",
          "TRAN_CD",
          "docImages",
        ]);

        // console.log("doccon save 2", updateValue)
        return {
          ...newMainDocRow,
          DETAILS_DATA: {
            isNewRow: mainDocRow?.docImages ? [...mainDocRow?.docImages] : [],
            isDeleteRow: [],
            isUpdatedRow: [],
          },
          ...updateValue,
          _isNewRow: true,
          // REQ_CD: reqCD,
          // CUSTOMER_ID: custID,
          // COMP_CD: authState?.companyID ?? "",
          // BRANCH_CD: authState?.user?.branchCode ?? "",
          // REQ_FLAG: "F",
          // IsNewRow: Boolean(reqCD) ? false : true,
        };
      });
      // console.log("doccon save 3", newGridDt)

      let newTabsData = ckycState?.formDatactx;
      // newTabsData["DOC_MST"] = {
      //   DOC_MST: [...newGridDt],
      //   ...commonData
      // }
      newTabsData["DOC_MST"] = {
        doc_mst_payload: [...changedRowsRef.current],
        DOC_MST: [...newGridDt],
      };
      handleFormDataonSavectx(newTabsData);
    } else {
      let newTabsData = ckycState?.formDatactx;
      if (
        Array.isArray(changedRowsRef.current) &&
        changedRowsRef.current?.length > 0
      ) {
        changedRowsRef.current = changedRowsRef.current?.map((row) => {
          // VALID_UPTO
          let validUpto = Boolean(row?.VALID_UPTO)
            ? format(utilFunction.getParsedDate(row?.VALID_UPTO), "dd-MMM-yyyy")
            : "";
          // docImages
          if (Array.isArray(row?.docImages) && row?.docImages?.length > 0) {
          }
          let newDocImages = row?.docImages?.map((doc) => {
            let validUpto = Boolean(doc?.VALID_UPTO)
              ? format(
                  utilFunction.getParsedDate(doc?.VALID_UPTO),
                  "dd-MMM-yyyy"
                )
              : "";
            return { ...doc, VALID_UPTO: validUpto };
          });
          return {
            ...row,
            VALID_UPTO: validUpto,
            docImages: [...newDocImages],
          };
        });
      }
      // newTabsData["DOC_MST"] = [...changedRowsRef.current];
      newTabsData["DOC_MST"] = {
        doc_mst_payload: [...changedRowsRef.current],
        DOC_MST: [...newGridData],
      };
      handleFormDataonSavectx(newTabsData);

      let tabModifiedCols: any = ckycState?.modifiedFormCols;
      tabModifiedCols = {
        ...tabModifiedCols,
        DOC_MST: {
          doc_mst_payload: [...changedRowsRef.current],
          DOC_MST: [...newGridData],
        },
      };
      handleModifiedColsctx(tabModifiedCols);
    }
    handleStepStatusctx({
      status: "completed",
      coltabvalue: ckycState?.colTabValuectx,
    });
    toNextTab();
    handleCurrFormctx({
      currentFormSubmitted: true,
      isLoading: false,
    });
  };

  useEffect(() => {
    let refs = [handleSave];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: ckycState?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (ckycState?.isFreshEntryctx) {
      if (Array.isArray(ckycState?.formDatactx?.["DOC_MST"]?.["DOC_MST"])) {
        setGridData([...ckycState?.formDatactx["DOC_MST"]?.["DOC_MST"]]);
        changedRowsRef.current =
          ckycState?.formDatactx["DOC_MST"]?.["doc_mst_payload"] ?? [];
      } else {
        DocTemplateMutation.mutate(docTemplatePayload);
      }
    } else {
      if (Array.isArray(ckycState?.formDatactx?.["DOC_MST"]?.["DOC_MST"])) {
        setGridData([...ckycState?.formDatactx["DOC_MST"]?.["DOC_MST"]]);
        changedRowsRef.current =
          ckycState?.formDatactx["DOC_MST"]?.["doc_mst_payload"] ?? [];
      } else {
        let docData = ckycState?.retrieveFormDataApiRes?.["DOC_MST"];
        if (Array.isArray(docData)) {
          docData = docData?.map((docRow) => {
            if (docRow?.TRAN_CD && docRow?.SR_CD) {
              return {
                ...docRow,
                TRANSR_CD: `${docRow?.TRAN_CD}${docRow?.SR_CD}`,
              };
            } else {
              return { ...docRow };
            }
          });
          setGridData(docData ?? []);
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log(girdData, "girdData changed", changedRowsRef.current);
  }, [girdData]);

  return (
    <Grid container>
      <GridWrapper
        key={`operatorMasterGrid` + girdData + setGridData}
        finalMetaData={DocumentGridMetadata as GridMetaDataType}
        data={girdData ?? []}
        setData={setGridData}
        loading={DocTemplateMutation.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        ref={myGridRef}
        onClickActionEvent={(index, id, currentData) => {
          currRowRef.current = currentData;
          if (id === "_hidden") {
            setIsDelConfirm(true);
          } else if (id === "VIEW_DTL") {
            setFormMode("view");
            setIsOpen(true);
          }
        }}
      />
      <PopupMessageAPIWrapper
        MessageTitle="CONFIRM"
        Message="DoYouWantToDeleteThisDocument"
        onActionYes={(rowVal) => {
          onDeleteDocument();
        }}
        onActionNo={() => {
          setIsDelConfirm(false);
        }}
        rows={{}}
        open={isDelConfirm}
        // loading={mutation.isLoading}
      />
      {isOpen && (
        <DocMasterDTLForm
          isDataChangedRef={isDataChangedRef}
          ClosedEventCall={handleDialogClose}
          defaultmode={formMode ?? "new"}
          girdData={girdData}
          isOpen={isOpen}
          currentData={currRowRef}
          changedRowsRef={changedRowsRef}
          myGridRef={myGridRef}
          setGridData={setGridData}
        />
      )}

      <TabNavigate
        handleSave={handleSave}
        displayMode={ckycState?.formmodectx ?? "new"}
      />
    </Grid>
  );
};

export default Document;
