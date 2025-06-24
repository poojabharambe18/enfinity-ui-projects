import { useContext, useState, useEffect, useMemo, useRef } from "react";
import { Grid, Typography } from "@mui/material";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { other_address_meta_data } from "../../metadata/individual/otheraddressdetails";
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import { AuthContext } from "pages_audit/auth";
import _ from "lodash";
import TabNavigate from "../TabNavigate";

const OtherAddressDetails = () => {
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const {
    state,
    handleFormDataonSavectx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleSavectx,
    handleCurrFormctx,
    toNextTab,
  } = useContext(CkycContext);
  const OtherAddDTLFormRef = useRef<any>("");
  const [formStatus, setFormStatus] = useState<any[]>([]);
  useEffect(() => {
    let refs = [OtherAddDTLFormRef];
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

  const OtherAddDTLSubmitHandler = (
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
      };
      if (data.OTHER_ADDRESS) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.OTHER_ADDRESS[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (state?.isFreshEntryctx || state?.isDraftSavedctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }

        let newFormatOtherAdd = data.OTHER_ADDRESS.map((formRow, i) => {
          let formFields = Object.keys(formRow);
          // console.log("reltedaw formFields", formFields)
          formFields = formFields.filter(
            (field) => !field.includes("_ignoreField")
          );
          // console.log("reltedaw formFields 2", formFields)
          // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
          const formData = _.pick(data.OTHER_ADDRESS[i], formFields);
          // console.log("reltedaw formData", formData)
          return { ...formData, ...commonData };
        });
        console.log("reltedaw", data.OTHER_ADDRESS);

        // let newFormatOtherAdd = data?.OTHER_ADDRESS.map((el, i) => {
        //     return {...el, ...commonData
        //         // , SR_CD: i+1
        //     }
        // })
        // data["OTHER_ADDRESS"] = newFormatOtherAdd

        newData["OTHER_ADDRESS"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);

        if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            OTHER_ADDRESS: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["OTHER_ADDRESS"] = [];
        handleFormDataonSavectx(newData);
        if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            OTHER_ADDRESS: [],
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

  const initialVal = useMemo(() => {
    return state?.formDatactx["OTHER_ADDRESS"]
      ? { OTHER_ADDRESS: state?.formDatactx["OTHER_ADDRESS"] }
      : !state?.isFreshEntryctx && !state?.isDraftSavedctx
      ? state?.retrieveFormDataApiRes["OTHER_ADDRESS"]
        ? { OTHER_ADDRESS: state?.retrieveFormDataApiRes["OTHER_ADDRESS"] }
        : {}
      : { OTHER_ADDRESS: [] };
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [OtherAddDTLFormRef.current.handleSubmit(e, "save", false)];
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
            sx={{ color: "var(--theme-color3)", pl: 2, pt: "6px" }}
            variant={"h6"}
          >
            {t("OtherAddress")}
          </Typography>
        </Grid>
        <Grid item>
          <FormWrapper
            ref={OtherAddDTLFormRef}
            onSubmitHandler={OtherAddDTLSubmitHandler}
            initialValues={initialVal}
            displayMode={state?.formmodectx}
            key={
              "other-address-form-kyc" +
              initialVal +
              state?.retrieveFormDataApiRes["OTHER_ADDRESS"] +
              state?.formmodectx
            }
            metaData={other_address_meta_data as MetaDataType}
            formStyle={{}}
            hideHeader={true}
          />
        </Grid>
      </Grid>
      <TabNavigate
        handleSave={handleSave}
        displayMode={state?.formmodectx ?? "new"}
      />
    </Grid>
  );
};

export default OtherAddressDetails;
