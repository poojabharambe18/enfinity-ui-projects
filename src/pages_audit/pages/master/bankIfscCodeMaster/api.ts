import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getBankIfscCdData = async ({ companyID, branchCode }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBANKIFSCCODEMSTGRID", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
    });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteupdateBankIfscCodeData = async (data) => {
  const { status, message } = await AuthSDK.internalFetcher(
    "DOBANKIFSCCODEMSTDML",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};

export const updateBankIfscCodeData = async ({ data: reqdata }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOBANKIFSCCODEMSTDML",
    {
      ...reqdata,
      ALERT_TYPE: "E",
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const GetBankIfscImportDdwn = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBANKIFSCIMPORTDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      TABLE_NM: "RTGS_IFSCCODE_MST",
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DESCRIPTION, FILE_FORMAT, TRAN_CD, ...other }) => {
          return {
            ...other,
            value: `${FILE_FORMAT},${TRAN_CD}`,
            label: DESCRIPTION,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const uploadFileData = async ({ ...reqData }) => {
  try {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("IMPORTFILE", {
        ...reqData,
      });

    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};
