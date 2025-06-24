import { Fragment, forwardRef, useContext } from "react";
import { FixDepositDetailFormMetadata } from "./metaData/fdDetailMetaData";
import { FixDepositContext } from "./fixDepositContext";
import {
  usePopupContext,
  MetaDataType,
  FormWrapper,
  InitialValuesType,
  SubmitFnType,
} from "@acuteinfo/common-base";
export const FixDepositDetailForm = forwardRef<any, any>(
  ({ doFixDepositMutation }, ref) => {
    const { fdState, updateFDDetailsFormData, setActiveStep } =
      useContext(FixDepositContext);
    const { MessageBox } = usePopupContext();

    const onSubmitHandler: SubmitFnType = async (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);
      if (
        fdState?.fdParaFormData?.FD_TYPE === "E" &&
        fdState?.fdParaFormData?.TRAN_MODE === "1"
      ) {
        const buttonName = await MessageBox({
          messageTitle: "Confirmation",
          message: "Are you sure create FD?",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
        });
        if (buttonName === "Yes") {
          doFixDepositMutation.mutate({
            ...fdState?.fdParaFormData,
            FD_ACCOUNTS: data?.FDDTL ?? [],
            DR_ACCOUNTS: [],
          });
        }
      } else {
        updateFDDetailsFormData(data);
        setActiveStep(fdState.activeStep + 1);
      }
    };
    return (
      <Fragment>
        <FormWrapper
          key={"FixDepositDetail"}
          // metaData={MobileAppReviewMetaData}
          metaData={FixDepositDetailFormMetadata as MetaDataType}
          initialValues={fdState?.fdDetailFormData as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          hideHeader={true}
          formStyle={{
            background: "white",
            paddingTop: "0px",
            // height: "30vh",
            // overflowY: "auto",
            // overflowX: "hidden",
            border: "1px solid var(--theme-color4)",
            borderRadius: "10px",
          }}
          ref={ref}
          formState={{ MessageBox: MessageBox }}
        />
      </Fragment>
    );
  }
);
