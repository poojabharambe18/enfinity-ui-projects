import { DefaultErrorObject, utilFunction } from "@acuteinfo/common-base";
import i18n from "components/multiLanguage/languagesConfiguration";
import { AuthSDK } from "registry/fns/auth";

/**
 * This function is used for dynamic screen ref for menu list API.
 * @param path Screen's main url (useLocation().pathname)
 * @param data Pass authState?.menulistdata
 * @returns Screen ref of perticular screen
 */
export const getdocCD = (path: string, data: any) => {
  const relativePath = path.replace("/EnfinityCore/", "");
  let cleanedPath;

  if (relativePath.includes("/")) {
    cleanedPath = relativePath.split("/").slice(0, 2).join("/");
  } else {
    cleanedPath = relativePath;
  }
  let screenList = utilFunction?.GetAllChieldMenuData(data, true);
  const matchingPath = screenList.find((item) => item.href === cleanedPath);

  if (matchingPath) {
    return `${matchingPath.user_code.trim()}`;
  }
  return "";
};

/**
 * This function is used to validate the branch code when selecting the HO branch from another branch.
 * @param currentField pass currentField
 * @param messageBox pass formState?.MessageBox
 * @param authState pass authState
 * @returns Boolean value
 */
export const validateHOBranch = async (
  currentField: any,
  messageBox: any,
  authState: any,
  errorMessage?: any
) => {
  if (!Boolean(currentField?.value)) return;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBRANCHVALIDATE", {
      LOGIN_BRANCH_CD: authState?.user?.branchCode ?? "",
      BASE_BRANCH_CD: authState?.user?.baseBranchCode ?? "",
      BRANCH_CD: currentField?.value ?? "",
      COMP_CD: authState?.companyID ?? "",
      LANG: i18n.resolvedLanguage ?? "",
    });
  if (status === "0") {
    if (data?.[0]?.ALLOW_HO !== "Y") {
      const buttonName = await messageBox({
        messageTitle: "HOBranchValidMessageTitle",
        message: data?.[0]?.ALLOW_HO ?? "HOBranchValidMessage",
        buttonNames: ["Ok"],
        icon: "ERROR",
      });
      if (buttonName === "Ok") {
        return true;
      }
    }
    return false;
  } else {
    if (errorMessage) {
      const buttonName = await messageBox({
        messageTitle: messageDetails?.trim()
          ? messageDetails?.trim()
          : "ValidationFailed",
        message: message ?? "Somethingwenttowrong",
        buttonNames: ["Ok"],
        icon: "ERROR",
      });
      if (buttonName === "Ok") {
        return true;
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const getPadAccountNumber = (accountNo, optionData) => {
  return accountNo
    ?.trim()
    ?.padStart(optionData?.PADDING_NUMBER ?? 6, "0")
    .padEnd(20, " ");
};

export const isBase64 = (str = ""): boolean => {
  if (typeof str !== "string") {
    return false;
  }
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  return base64Regex.test(str);
};
