import { Button, Dialog } from "@mui/material";
import { t } from "i18next";
import { useRef, useState } from "react";
import { TemplateDetailMetadata } from "./templateMetadata";
import { useLocation } from "react-router-dom";
import {
  SubmitFnType,
  usePopupContext,
  FormWrapper,
  MetaDataType,
  GradientButton,
} from "@acuteinfo/common-base";

export const TemplateDetail = ({
  getFormData,
  refData,
  onClose,
  open,
  rowsData,
}) => {
  const [optionData, setOptionData] = useState([]);
  const optionRef = useRef<any>(optionData);
  optionRef.current = optionData;
  const { MessageBox } = usePopupContext();
  const [disableButton, setDisableButton] = useState(false);
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit
  ) => {
    // @ts-ignore
    endSubmit(true);
    getFormData(
      { ...data, TEMP_DISP: optionRef?.current },
      Boolean(rowsData?.length),
      rowsData?.[0]?.data?.TRAN_CD
    );
  };
  const handleButtonDisable = (disable) => {
    setDisableButton(disable);
  };
  return (
    <Dialog
      open={open}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1004px",
          padding: "5px",
        },
      }}
    >
      <FormWrapper
        key={"gst-template-detail"}
        metaData={TemplateDetailMetadata as MetaDataType}
        initialValues={rowsData?.[0]?.data ?? []}
        formState={{
          MessageBox: MessageBox,
          REFDATA: refData,
          optionRef: setOptionData,
          handleButtonDisable: handleButtonDisable,
        }}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              color={"primary"}
              disabled={isSubmitting || disableButton}
            >
              {rowsData?.[0]?.data ? t("Update") : t("Add")}
            </GradientButton>

            <GradientButton onClick={onClose} color={"primary"}>
              {t("Close")}
            </GradientButton>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
