import React, { useCallback, useContext, useRef, useState } from "react";
import { useMutation } from "react-query";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import * as API from "./api";
import {
  retrieveAcctFormMetaData,
  retrieveAcctGridMetaData,
} from "./metadata/retrieveAcctMetadata";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import AcctModal from "./AcctModal";

import {
  usePopupContext,
  GridWrapper,
  GradientButton,
  ActionTypes,
  utilFunction,
  GridMetaDataType,
  Alert,
  SubmitFnType,
} from "@acuteinfo/common-base";
import {
  getdocCD,
  getPadAccountNumber,
} from "components/utilFunction/function";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

const RetrieveAcct = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const { MessageBox } = usePopupContext();
  const [displayGridData, setDisplayGridData] = useState(false);

  const formRef = useRef<any>(null);

  const setCurrentAction = useCallback(
    (data) => {
      const confirmed = data?.rows?.[0]?.data?.CONFIRMED ?? "";
      const maker = data?.rows?.[0]?.data?.MAKER ?? "";
      const loggedinUser = authState?.user?.id;
      let formmode = "edit";
      if (Boolean(confirmed)) {
        // P=SENT TO CONFIRMATION
        if (confirmed.includes("P")) {
          if (maker === loggedinUser) {
          } else {
            formmode = "view";
          }
        } else if (confirmed.includes("M")) {
          // M=SENT TO MODIFICATION
        } else if (confirmed.includes("Y") || confirmed.includes("R")) {
        } else {
          formmode = "view";
        }
      }
      setRowsData(data?.rows);

      if (data.name === "view-detail") {
        navigate(data?.name, {
          state: {
            rows: data?.rows ?? [{ data: null }],
            formmode: formmode,
            from: "retrieve-entry",
          },
        });
        // setComponentToShow("ViewDetail");
        // setAcctOpen(true);
        // setRowsData(data?.rows);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const mutation: any = useMutation(API.getAccountList, {
    onSuccess: () => {},
    onError: (error) => {},
  });

  const onFormSubmit: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    if (
      !Boolean(data?.BRANCH_CD) &&
      !Boolean(data?.ACCT_TYPE) &&
      !Boolean(data?.ACCT_CD) &&
      !Boolean(data?.CONTACT2) &&
      !Boolean(data?.CUSTOMER_ID) &&
      !Boolean(data?.PAN_NO)
    ) {
      //@ts-ignore
      endSubmit(true, "Please enter any value");
      setDisplayGridData(false);
    } else {
      if (
        (Boolean(data?.BRANCH_CD) ||
          Boolean(data?.ACCT_TYPE) ||
          Boolean(data?.ACCT_CD)) &&
        (!Boolean(data?.BRANCH_CD) ||
          !Boolean(data?.ACCT_TYPE) ||
          !Boolean(data?.ACCT_CD))
      ) {
        endSubmit(
          true,
          "Please enter Branch Code, Account Type and Account Code"
        );
        setDisplayGridData(false);
      } else {
        endSubmit(true);
        setDisplayGridData(true);
        let payload = {
          SELECT_COLUMN: {},
          A_COMP_CD: authState?.companyID ?? "",
          A_BRANCH_CD: authState?.user?.branchCode ?? "",
        };
        let { RETRIEVE_BTN, PADDINGNUMBER, ...others } = data;
        Object.keys(others)?.forEach((key) => {
          if (Boolean(data[key])) {
            if (key === "ACCT_CD") {
              payload["SELECT_COLUMN"]["ACCT_CD"] = getPadAccountNumber(
                data?.ACCT_CD,
                { PADDING_NUMBER: PADDINGNUMBER }
              );
            } else {
              payload["SELECT_COLUMN"][key] = data?.[key];
            }
          }
        });
        mutation.mutate(payload);
      }
    }
  };

  return (
    <>
      <FormWrapper
        key={"retrieveAcctForm"}
        metaData={retrieveAcctFormMetaData as MetaDataType}
        initialValues={{}}
        onSubmitHandler={onFormSubmit}
        formState={{
          MessageBox: MessageBox,
          docCD: docCD,
          setDisplayGridData: setDisplayGridData,
          acctDtlReqPara: {
            ACCT_CD: {
              ACCT_TYPE: "ACCT_TYPE",
              BRANCH_CD: "BRANCH_CD",
              SCREEN_REF: docCD ?? "",
            },
          },
        }}
        formStyle={{
          background: "white",
          maxHeight: "200px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={formRef}
        setDataOnFieldChange={(action, payload) => {
          if (action === "BUTTON_CLICK_ACCTCD") {
            const { ACCT_TYPE, BRANCH_CD, ACCT_CD, PADDINGNUMBER } = payload;
            setDisplayGridData(true);
            mutation.mutate({
              A_COMP_CD: authState?.companyID ?? "",
              A_BRANCH_CD: authState?.user?.branchCode ?? "",
              SELECT_COLUMN: {
                ACCT_TYPE: ACCT_TYPE,
                BRANCH_CD: BRANCH_CD,
                ACCT_CD: utilFunction.getPadAccountNumber(
                  ACCT_CD,
                  PADDINGNUMBER
                ),
              },
            });
          }
        }}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
        }}
      >
        {() => (
          <>
            <GradientButton
              onClick={() => {
                // onClose();
                navigate("new-account", {
                  state: {
                    isFormModalOpen: true,
                    // entityType: "I",
                    isFreshEntry: true,

                    rows: [{ data: {} }],
                    formmode: "new",
                    from: "new-entry",
                  },
                });
              }}
              // disabled={isSubmitting}
              color={"primary"}
            >
              NEW ACCOUNT
            </GradientButton>
          </>
        )}
      </FormWrapper>
      {mutation?.isError && (
        <Alert
          severity={mutation?.error?.severity ?? "error"}
          errorMsg={mutation?.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation?.error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"retrieveAcctGrid" + displayGridData}
        finalMetaData={retrieveAcctGridMetaData as GridMetaDataType}
        data={displayGridData ? mutation.data ?? [] : []}
        setData={() => null}
        loading={mutation.isLoading}
        actions={actions}
        setAction={setCurrentAction}
      />

      <Routes>
        <Route
          path="new-account/*"
          element={<AcctModal onClose={() => navigate(".")} />}
        />
        <Route
          path="view-detail/*"
          element={<AcctModal onClose={() => navigate(".")} />}
        />
      </Routes>
    </>
  );
};

export default RetrieveAcct;
