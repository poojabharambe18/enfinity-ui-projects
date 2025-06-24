import { usePopupContext } from "@acuteinfo/common-base";

export const useCommonFunctions = () => {
  const { MessageBox } = usePopupContext();

  //Function for display Messages
  const showMessageBox = async (obj) => {
    if (
      obj?.O_STATUS === "999" ||
      obj?.O_STATUS === "99" ||
      obj?.O_STATUS === "9"
    ) {
      const buttonName = await MessageBox({
        messageTitle: obj?.O_MSG_TITLE?.length
          ? obj?.O_MSG_TITLE
          : obj?.O_STATUS === "9"
          ? "Alert"
          : obj?.O_STATUS === "99"
          ? "Confirmation"
          : "ValidationFailed",
        message: obj?.O_MESSAGE ?? "",
        buttonNames: obj?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"],
        loadingBtnName: ["Yes"],
        icon:
          obj?.O_STATUS === "999"
            ? "ERROR"
            : obj?.O_STATUS === "99"
            ? "CONFIRM"
            : obj?.O_STATUS === "9"
            ? "WARNING"
            : "INFO",
      });

      if (obj?.O_STATUS === "99" && buttonName === "No") {
        return false;
      }
    }
    return true;
  };

  return { showMessageBox };
};
