import { Dialog } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MasterDetailsForm,
  GradientButton,
  usePopupContext,
} from "@acuteinfo/common-base";
import { advConfMstFormMetadata } from "./advConfMstFormMetadata";
import { useQuery } from "react-query";
import { advConfDocdtl } from "../../../api";
import { AuthContext } from "pages_audit/auth";

export const AdvConfMstForm = ({
  closeDialog,
  setGridData,
  initialData,
  acountNum,
  gridData,
}) => {
  const myRef = useRef<any>(null);
  const { t } = useTranslation();
  const { MessageBox } = usePopupContext();
  const [formMode, setformMode] = useState<any>("new");
  const { authState } = useContext(AuthContext);

  const { isError, error, isLoading, isFetching } = useQuery<any, any>(
    ["advConfDocdtl"],
    () =>
      advConfDocdtl({
        COMP_CD: initialData?.COMP_CD,
        BRANCH_CD: initialData?.BRANCH_CD,
        ACCT_TYPE: initialData?.ACCT_TYPE,
        ACCT_CD: initialData?.ACCT_CD,
        SR_CD: initialData?.SR_CD,
      }),

    {
      enabled: Boolean(formMode === "view"),
      onSuccess(data) {
        myRef.current.setGridData(data);
      },
    }
  );
  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["advConfDocdtl"]);
  //   };
  // }, []);

  useEffect(() => {
    if (
      typeof initialData === "object" &&
      Object.keys(initialData).length &&
      !initialData?._isNewRow
    ) {
      setformMode("view");
    } else {
      setformMode("new");
    }
  }, []);

  const onSubmitHandler = ({ data, endSubmit }) => {
    setGridData((old) => {
      const updatedGridData =
        initialData?.ID_NO || initialData?.SR_CD
          ? old?.map((item) => {
              if (
                (item.ID_NO && item.ID_NO === initialData?.ID_NO) ||
                (item.SR_CD && item.SR_CD === initialData?.SR_CD)
              ) {
                return {
                  ...item,
                  ...data,
                };
              }
              return item;
            })
          : [
              ...old,
              {
                ...data,
                ID_NO: Date.now(),
                SR_CD_ID_NO: Date.now(),
                IsNewRow: true,
              },
            ];
      return updatedGridData;
    });
    closeDialog();
    //@ts-ignore
    endSubmit(true);
  };

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1450px",
          },
        }}
      >
        <>
          <MasterDetailsForm
            key={"adv-conf-mstform" + formMode}
            metaData={advConfMstFormMetadata}
            initialData={{
              ...initialData,
              DETAILS_DATA: myRef.current?.GetGirdData(),
            }}
            subHeaderLabel={`${t(
              "AdvanceConfigrationfor"
            )}\u00A0${acountNum()}`}
            displayMode={formMode}
            isNewRow={formMode === "new" ? true : false}
            isDetailHide={formMode === "new" ? true : false}
            // hideDisplayModeInTitle= {true}
            onSubmitData={onSubmitHandler}
            formState={{
              MessageBox: MessageBox,
              gridData: gridData,
              workingDate: authState?.workingDate,
            }}
            isLoading={isLoading || isFetching}
            isError={isError}
            errorObj={{
              error_msg: error?.error_msg,
              error_detail: error?.error_detail,
            }}
            onClickActionEvent={(index, id, data) => {}}
            isDetailRowRequire={false}
            ref={myRef}
            formStyle={{
              background: "white",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  {formMode !== "new" && (
                    <GradientButton
                      onClick={() =>
                        setformMode(formMode === "edit" ? "view" : "edit")
                      }
                      color={"primary"}
                    >
                      {formMode === "edit" ? t("View") : t("Edit")}
                    </GradientButton>
                  )}
                  {formMode !== "view" && (
                    <GradientButton onClick={handleSubmit} color={"primary"}>
                      {formMode === "new" ? t("Save") : t("Update")}
                    </GradientButton>
                  )}

                  <GradientButton onClick={closeDialog} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              );
            }}
          </MasterDetailsForm>
        </>
      </Dialog>
    </>
  );
};
