import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getFDAccountsDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERFDACCOUNTS", { ...Apireq });
  // if (status === "0") {
  //   return data;
  // } else {
  return { data, status, message, messageDetails };
  // }
};

export const validateAccountAndGetDetail = async (
  companyCode,
  branchCode,
  accountType,
  accountCode,
  screenReference
) => {
  if (!Boolean(companyCode)) return { status: "-1" };
  if (!Boolean(branchCode)) return { status: "-1" };
  if (!Boolean(accountType)) return { status: "-1" };
  if (!Boolean(accountCode)) return { status: "-1" };
  if (!Boolean(screenReference)) return { status: "-1" };
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEACCOUNT", {
      COMP_CD: companyCode,
      BRANCH_CD: branchCode,
      ACCT_TYPE: accountType,
      ACCT_CD: accountCode,
      SCREEN_REF: screenReference,
    });
  return { data, status, message, messageDetails };
};

export const valiateFDAccounts = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEFDACCOUNTS", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const doFixDepositCreation = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOFDDEPOSIT", { ...Apireq });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDSchemeData = async (fdTranCode, categCode) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDSCHEMELIST", {
      FD_DOUBLE_TRAN_CD: fdTranCode,
      CATEG_CD: categCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
