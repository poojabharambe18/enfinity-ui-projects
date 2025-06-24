import {
  extractMetaData,
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { relativeDtl_tab_metadata } from "../tabMetadata/relativeDtlTabMetadata";
import TabNavigate from "../TabNavigate";
import _ from "lodash";
import { format } from "date-fns";

const RelativeDtlTab = () => {
  const {
    AcctMSTState,
    handleCurrFormctx,
    handleStepStatusctx,
    handleSavectx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
  } = useContext(AcctMSTContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let newData = AcctMSTState?.formDatactx;
      if (data?.RELATIVE_DTL) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.RELATIVE_DTL[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (AcctMSTState?.isFreshEntryctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }
        let newFormatOtherAdd = data?.RELATIVE_DTL?.map((formRow, i) => {
          let formFields = Object.keys(formRow);
          formFields = formFields.filter(
            (field) => !field.includes("_ignoreField")
          );
          const formData = _.pick(data?.RELATIVE_DTL[i], formFields);
          const dateFields: string[] = ["DATE_OF_BIRTH"];
          const allFields = Object.keys(formData);
          allFields.forEach((field) => {
            if (dateFields.includes(field)) {
              formData[field] = Boolean(formData[field])
                ? format(
                    utilFunction.getParsedDate(formData[field]),
                    "dd/MMM/yyyy"
                  )
                : "";
            }
          });
          return {
            ...formData,
            IsNewRow: !AcctMSTState?.req_cd_ctx ? true : false,
          };
        });
        newData["RELATIVE_DTL"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            RELATIVE_DTL: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["RELATIVE_DTL"] = [];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            RELATIVE_DTL: [],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      }
      setFormStatus((old) => [...old, true]);
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: AcctMSTState?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    const dateFields: string[] = ["DATE_OF_BIRTH"];
    let formData: any = [
      ...(AcctMSTState?.retrieveFormDataApiRes["RELATIVE_DTL"] ?? []),
    ];
    if (
      !Boolean(AcctMSTState?.isFreshEntryctx) &&
      !Boolean(AcctMSTState?.formDatactx["RELATIVE_DTL"])
    ) {
      formData = formData.map((row) => {
        dateFields.forEach((field) => {
          if (Object.hasOwn(row, field)) {
            row[field] = Boolean(row[field])
              ? utilFunction.getParsedDate(row[field])
              : "";
          }
        });
        return { ...row };
      });
    }
    return AcctMSTState?.isFreshEntryctx
      ? AcctMSTState?.formDatactx["RELATIVE_DTL"]?.length > 0
        ? {
            RELATIVE_DTL: [
              ...(AcctMSTState?.formDatactx["RELATIVE_DTL"] ?? []),
            ],
          }
        : { RELATIVE_DTL: [] }
      : AcctMSTState?.formDatactx["RELATIVE_DTL"]
      ? { RELATIVE_DTL: [...(AcctMSTState?.formDatactx["RELATIVE_DTL"] ?? [])] }
      : {
          RELATIVE_DTL: [...formData],
        };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes["RELATIVE_DTL"],
    AcctMSTState?.formDatactx["RELATIVE_DTL"],
  ]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [formRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };

  useEffect(() => {
    let refs = [formRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: AcctMSTState?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);
  useEffect(() => {
    if (
      Boolean(
        AcctMSTState?.currentFormctx.currentFormRefctx &&
          AcctMSTState?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        AcctMSTState?.currentFormctx.currentFormRefctx.length ===
        formStatus.length
      ) {
        setIsNextLoading(false);
        let submitted;
        submitted = formStatus.filter((form) => !Boolean(form));
        if (submitted && Array.isArray(submitted) && submitted.length > 0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: AcctMSTState?.colTabValuectx,
          });
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        });
        setFormStatus([]);
      }
    }
  }, [formStatus]);

  return (
    <Grid>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onSubmitHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={
          "acct-mst-relative-dtl-tab-form" +
          initialVal +
          AcctMSTState?.formmodectx
        }
        metaData={
          extractMetaData(
            relativeDtl_tab_metadata,
            AcctMSTState?.formmodectx
          ) as MetaDataType
        }
        formStyle={{
          height: "auto !important",
        }}
        formState={{ GPARAM155: AcctMSTState?.gparam155 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default RelativeDtlTab;
