import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  Box,
} from "@mui/material";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import * as API from "../../../../api";
import { corporate_control_dtl_meta_data } from "../../metadata/legal/legal_corporate_control_dtl_meta_data";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { personal_individual_detail_metadata } from "../../metadata/individual/personaldetails";
import _ from "lodash";
import TabNavigate from "../TabNavigate";

const ControllingPersonDTL = () => {
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    toNextTab,
  } = useContext(CkycContext);
  const formRef = useRef<any>("");
  const [acctName, setAcctName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const onCloseSearchDialog = () => {
    setDialogOpen(false);
  };
  useEffect(() => {
    let refs = [formRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (
      Boolean(
        state?.currentFormctx.currentFormRefctx &&
          state?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        state?.currentFormctx.currentFormRefctx.length === formStatus.length
      ) {
        let submitted;
        submitted = formStatus.filter((form) => !Boolean(form));
        if (submitted && Array.isArray(submitted) && submitted.length > 0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: state?.colTabValuectx,
          });
          toNextTab();
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        });
        setFormStatus([]);
      }
    }
  }, [formStatus]);

  const mutation: any = useMutation(API.getControllCustInfo, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
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
        ACTIVE: "Y",
      };
      if (data.RELATED_PERSON_DTL) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.RELATED_PERSON_DTL[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (state?.isFreshEntryctx || state?.isDraftSavedctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }

        let newFormatRelPerDtl = data.RELATED_PERSON_DTL.map((formRow, i) => {
          let formFields = Object.keys(formRow);
          // console.log("reltedaw formFields", formFields)
          formFields = formFields.filter(
            (field) => !field.includes("_ignoreField")
          );
          // console.log("reltedaw formFields 2", formFields)
          // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
          const formData = _.pick(data.RELATED_PERSON_DTL[i], formFields);
          // console.log("reltedaw formData", formData)
          return { ...formData, ...commonData };
        });
        console.log("reltedaw", data.RELATED_PERSON_DTL);

        // let newFormatRelPerDtl:any = []
        // if(data && data.RELATED_PERSON_DTL) {
        //     newFormatRelPerDtl = data.RELATED_PERSON_DTL?.map((el, i) => {
        //         return {...el, ...commonData,
        //             // SR_CD: i+1
        //         }
        //     })
        // }

        newData["RELATED_PERSON_DTL"] = [...newFormatRelPerDtl];
        handleFormDataonSavectx(newData);

        if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            RELATED_PERSON_DTL: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["RELATED_PERSON_DTL"] = [];
        handleFormDataonSavectx(newData);
        if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            RELATED_PERSON_DTL: [],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      }
      setFormStatus((old) => [...old, true]);
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: state?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const handleFormExpand = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  const initialVal = useMemo(() => {
    return state?.isFreshEntryctx
      ? state?.formDatactx["RELATED_PERSON_DTL"]
        ? { RELATED_PERSON_DTL: state?.formDatactx["RELATED_PERSON_DTL"] }
        : { RELATED_PERSON_DTL: [{}] }
      : state?.retrieveFormDataApiRes
      ? {
          RELATED_PERSON_DTL:
            state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"],
        }
      : {};
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [formRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };

  return (
    <Grid container rowGap={3}>
      <Grid
        sx={{
          backgroundColor: "var(--theme-color2)",
          padding: (theme) => theme.spacing(1),
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: "20px",
        }}
        container
        item
        xs={12}
        direction={"column"}
      >
        <Grid
          container
          item
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography
            sx={{ color: "var(--theme-color3)", pl: 2 }}
            variant={"h6"}
          >
            {t("ControllingPersonDTL")}
          </Typography>
          <IconButton onClick={handleFormExpand}>
            {!isFormExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Grid>

        <Collapse in={isFormExpanded}>
          <Grid item>
            <FormWrapper
              ref={formRef}
              onSubmitHandler={onSubmitHandler}
              initialValues={initialVal}
              key={
                "controlling-person-form-kyc" +
                initialVal +
                state?.retrieveFormDataApiRes["RELATED_PERSON_DTL"] +
                state?.formmodectx
              }
              metaData={corporate_control_dtl_meta_data as MetaDataType}
              displayMode={state?.formmodectx}
              formStyle={{}}
              hideHeader={true}
              onFormButtonClickHandel={(fieldID, dependentFields) => {
                if (fieldID.indexOf("CUST_DTL_BTN") !== -1) {
                  const refCustID =
                    dependentFields[
                      "RELATED_PERSON_DTL.REF_CUST_ID"
                    ]?.value?.trim();
                  if (refCustID.length > 0) {
                    if (acctName !== refCustID) {
                      setAcctName(refCustID);
                      let data = {
                        COMP_CD: authState?.companyID ?? "",
                        BRANCH_CD: authState?.user?.branchCode ?? "",
                        CUSTOMER_ID: refCustID,
                        FROM: "",
                        // CATEG_CD: state?.categoryValuectx ?? "",
                        // formIndex: null
                      };
                      mutation.mutate(data);
                    }
                    setDialogOpen(true);
                  }
                }
              }}
            />
          </Grid>
        </Collapse>
      </Grid>
      {dialogOpen && (
        <EntiyDialog
          open={dialogOpen}
          onClose={onCloseSearchDialog}
          data={mutation?.data}
          isLoading={mutation?.isLoading}
        />
      )}
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
      />
    </Grid>
  );
};

export const EntiyDialog = ({ open, onClose, data, isLoading }) => {
  const PDFormRef = useRef<any>("");
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--theme-color3)",
          color: "var(--theme-color2)",
          letterSpacing: "1.3px",
          margin: "10px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
          fontWeight: 500,
          borderRadius: "inherit",
          minWidth: "450px",
          p: 1,
        }}
        id="responsive-dialog-title"
      >
        <Box>
          {`Customer Info - Customer ID ${
            data?.[0]?.CUSTOMER_ID ? data[0].CUSTOMER_ID : ""
          }`}
        </Box>
        <Button onClick={() => onClose()}>Close</Button>
        {/* rowdata?.[0]?.data?.CUSTOMER_ID */}
      </DialogTitle>
      <FormWrapper
        ref={PDFormRef}
        initialValues={data?.[0] ?? {}} //{initialVal}
        key={"pd-form-kyc" + data}
        metaData={personal_individual_detail_metadata as MetaDataType}
        onSubmitHandler={() => {}}
        formStyle={{}}
        hideHeader={true}
        displayMode={"view"}
        controlsAtBottom={false}
      />
    </Dialog>
  );
};

export default ControllingPersonDTL;
