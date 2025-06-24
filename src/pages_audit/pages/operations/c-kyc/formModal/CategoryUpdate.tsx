import { useContext, useMemo, useRef, useState } from "react";
import * as API from "../api";
import { Button, Dialog } from "@mui/material";
import { update_categ_meta_data } from "./updateCategFormMetadata";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { CkycContext } from "../CkycContext";
import {
  CreateDetailsRequestData,
  Alert,
  FormWrapper,
  MetaDataType,
  LoaderPaperComponent,
  GradientButton,
} from "@acuteinfo/common-base";
import { t } from "i18next";

const CategoryUpdate = ({ open, setChangeCategDialog }) => {
  const { authState } = useContext(AuthContext);
  const { state } = useContext(CkycContext);
  const formRef = useRef<any>(null);
  const [categCD, setCategCD] = useState<any>("");

  const {
    data: categoryData,
    isError: isCategDTLError,
    isFetching: isCategDTLFetching,
    isLoading: isCategDTLLoading,
    error: CategDTLError,
    refetch: categDTLRefetch,
  } = useQuery<any, any>(["getCategDTL", state?.customerIDctx], () =>
    API.getCategoryDTL({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      CUSTOMER_ID: state?.customerIDctx ?? "",
    })
  );

  const mutation: any = useMutation(API.saveCategUpdate, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const initialVal = useMemo(() => {
    let CategData: any[] = [];
    if (Array.isArray(categoryData)) {
      CategData = categoryData?.map((row) => {
        return {
          ...row,
          APIDATA: { ...row },
          COMBINED_ACCT_NO: `${row?.COMP_CD}${row?.BRANCH_CD}${row?.ACCT_TYPE}${row?.ACCT_CD}`,
          NEW_CATEG_CD: categCD ?? row?.NEW_CATEG_CD,
          UPD_FLAG: row?.UPD_FLAG === "Y" ? true : false,
        };
      });

      return Array.isArray(CategData) && CategData?.length > 0
        ? {
            OLD_CATEG_CD: CategData?.[0]?.OLD_CATEG_CD ?? "",
            NEW_CATEG_CD: categCD ?? CategData?.[0]?.NEW_CATEG_CD,
            MAPPED_ACCOUNTS: [...CategData],
          }
        : { OLD_CATEG_CD: "", NEW_CATEG_CD: "", MAPPED_ACCOUNTS: [{}] };
    }
  }, [categoryData, categCD]);

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    endSubmit(true);
    const newData = data?.MAPPED_ACCOUNTS?.map((row) => {
      const { APIDATA, COMBINED_ACCT_NO, UPD_FLAG, ...others } = row;
      const {
        ACCT_CD,
        ACCT_TYPE,
        COMP_CD,
        BRANCH_CD,
        NEW_DUE_AMT,
        OLD_DUE_AMT,
        NEW_INST_RS,
        OLD_INST_RS,
      } = APIDATA;
      return {
        ...others,
        ACCT_CD: ACCT_CD,
        ACCT_TYPE: ACCT_TYPE,
        UPD_FLAG: Boolean(UPD_FLAG) ? "Y" : "N",
        NEW_DUE_AMT,
        OLD_DUE_AMT,
        NEW_INST_RS: data?.NEW_INST_RS ? data?.NEW_INST_RS : NEW_INST_RS,
        OLD_INST_RS: data?.OLD_INST_RS ? data?.OLD_INST_RS : OLD_INST_RS,
        _isNewRow: true,
      };
    });
    const finalResult = CreateDetailsRequestData(newData);
    mutation.mutate({
      CUSTOMER_ID: state?.customerIDctx ?? "",
      CONFIRMED: "Y",
      DETAILS_DATA: finalResult,
    });
  };

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
          // maxWidth: "90%",
        },
      }}
    >
      {isCategDTLLoading ? (
        <LoaderPaperComponent />
      ) : (
        <>
          {isCategDTLError && (
            <Alert
              severity={CategDTLError?.severity ?? "error"}
              errorMsg={CategDTLError?.error_msg ?? "Something went to wrong.."}
              errorDetail={CategDTLError?.error_detail}
              color="error"
            />
          )}
          <FormWrapper
            ref={formRef}
            key={"pod-form-kyc" + initialVal + categCD}
            metaData={update_categ_meta_data as MetaDataType}
            initialValues={initialVal}
            hideTitleBar={false}
            hideHeader={false}
            displayMode={state?.formmodectx}
            formStyle={{}}
            onSubmitHandler={onSubmitHandler}
            formState={{
              ENTITY_TYPE: state?.entityTypectx,
              setCategCD: setCategCD,
              CUSTOMER_ID: state?.customerIDctx,
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    setChangeCategDialog(false);
                  }}
                  color={"primary"}
                  // disabled={isSubmitting}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </>
      )}
    </Dialog>
  );
};

export default CategoryUpdate;
