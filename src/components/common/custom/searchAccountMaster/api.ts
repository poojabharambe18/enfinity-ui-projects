import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getAccountsOnF5 = async ({ COMP_CD, BRANCH_CD, ACCT_TYPE }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTONF5", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
    });

  if (status === "0") {
    let responseData = data;

    if (Array.isArray(responseData)) {
      responseData = responseData.map((items, index) => ({
        ...items,
        _rowColor: items.STATUS === "C" ? "rgb(255, 0, 0)" : undefined,

        INDEX: `${index}`,
      }));
    }

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
