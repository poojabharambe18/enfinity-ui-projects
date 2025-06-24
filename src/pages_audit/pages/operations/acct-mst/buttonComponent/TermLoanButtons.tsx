import { useTranslation } from "react-i18next";

import {
  usePopupContext,
  GradientButton,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";
import { PropertyMetadata } from "../buttonMetadata/PropertyBtnMetadata";
import { MachineryDetailsMetadata } from "../buttonMetadata/machineryDtlMetadata";
import { VehicleDetailsMetadata } from "../buttonMetadata/vehicleDtlMetadata";

const TermLoanButtons = ({ closeDialog, buttonName }) => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  return (
    <>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            width: "70%",
            overflow: "auto",
          },
        }}
        maxWidth="md"
      >
        <FormWrapper
          key={"MachineryDetailsMetadata"}
          metaData={
            buttonName === "VEHICLE"
              ? (VehicleDetailsMetadata as MetaDataType)
              : buttonName === "MACHINERY"
              ? (MachineryDetailsMetadata as MetaDataType)
              : (PropertyMetadata as MetaDataType)
          }
          onSubmitHandler={() => {}}
          initialValues={{}}
          formStyle={{
            background: "white",
          }}
          formState={{
            MessageBox: MessageBox,
          }}
        >
          <>
            <GradientButton onClick={closeDialog} color={"primary"}>
              {t("Back")}
            </GradientButton>
          </>
        </FormWrapper>
      </Dialog>
    </>
  );
};
export default TermLoanButtons;
