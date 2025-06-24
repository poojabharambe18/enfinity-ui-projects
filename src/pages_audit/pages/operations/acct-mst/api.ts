import { DefaultErrorObject, utilFunction } from "@acuteinfo/common-base";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getCIFCategories = async ({ COMP_CD, BRANCH_CD, ENTITY_TYPE }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCIFCATEG", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ENTITY_TYPE: ENTITY_TYPE,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CATEG_CD, CATEG_NM, ...other }) => {
        return {
          ...other,
          CATEG_CD: CATEG_CD,
          CATEG_NM: CATEG_NM,
          value: CATEG_CD,
          label: CATEG_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAcctModeOptions = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTMODEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ MODE_CD, MODE_NM, ...other }) => {
        return {
          ...other,
          MODE_CD: MODE_CD,
          CATEG_NM: MODE_NM,
          value: MODE_CD,
          label: MODE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAccountList = async ({
  A_COMP_CD,
  A_BRANCH_CD,
  SELECT_COLUMN,
}) => {
  let A_PARA: any[] = [];
  Object.keys(SELECT_COLUMN).forEach((fieldKey) => {
    A_PARA.push({
      COL_NM: fieldKey,
      COL_VAL: SELECT_COLUMN[fieldKey],
    });
  });
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SEARCHACCTNO", {
      A_COMP_CD,
      A_BRANCH_CD,
      A_PARA,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerData = async ({
  CUSTOMER_ID,
  ACCT_TYPE,
  COMP_CD,
  SCREEN_REF,
}) => {
  if (Boolean(CUSTOMER_ID)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTOMERDATA", {
        COMP_CD: COMP_CD,
        ACCT_TYPE: ACCT_TYPE,
        CUSTOMER_ID: CUSTOMER_ID,
        SCREEN_REF: SCREEN_REF,
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const getPendingAcct = async ({ A_COMP_CD, A_BRANCH_CD, A_FLAG }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETREQACCTLIST", {
      A_COMP_CD,
      A_BRANCH_CD,
      A_FLAG,
    });
  if (status === "0") {
    let responseData = data?.map((row) => {
      if (row?.CONFIRMED === "Y") {
        return { ...row, _rowColor: "rgb(9 132 3 / 51%)" };
      } else if (row?.CONFIRMED === "R") {
        return { ...row, _rowColor: "rgb(152 59 70 / 61%)" };
      } else {
        return { ...row };
      }
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTabsDetail = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_MODE,
  ALLOW_EDIT,
}) => {
  if (!ACCT_TYPE) {
    return [];
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTTAB", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_MODE: ACCT_MODE,
      ALLOW_EDIT: ALLOW_EDIT,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// export const isReadOnlyonParam320 = ({ formState }) => {
//   const PARAM320 = formState?.PARAM320;
//   if (Boolean(PARAM320)) {
//     if (PARAM320 === "Y") {
//       return true;
//     } else if (PARAM320 === "N") {
//       return false;
//     }
//   }
//   return false;
// };

export const isReadOnlyOn320Flag = (fieldName) => {
  if (Boolean(fieldName)) {
    if (fieldName === "Y") {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export const excludeFDDetailsOnFlag = ({ formState }) => {
  const OPEN_FD = formState?.OPEN_FD;
  if (Boolean(OPEN_FD) && OPEN_FD === "Y") {
    return false;
  }
  return true;
};

export const getMinorMajorAgeData = async (apiReq) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMINORMAJOR", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTypeofAccountDDW = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTTYPEOFACDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DISP_VAL, DATA_VAL }) => {
        return {
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getNomineeGuadianCustData = async ({
  COMP_CD,
  BRANCH_CD,
  CUSTOMER_ID,
  NG_CUSTOMER_ID,
  WORKING_DATE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATENOMGUACUSTID", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CUSTOMER_ID: CUSTOMER_ID,
      NG_CUSTOMER_ID: NG_CUSTOMER_ID,
      WORKING_DATE: WORKING_DATE,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validatePAN = async (columnValue) => {
  const PAN = columnValue?.value;
  if (PAN) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETPANSTATUS", {
        PAN: PAN ?? "",
      });
    if (status === "0") {
      const PAN_STATUS = data?.[0]?.PAN_STATUS;
      if (PAN_STATUS && PAN_STATUS !== "Y") {
        return "Please Enter Valid PAN Number";
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};
export const ValidateEmailId = async (columnValue) => {
  const EmailId = columnValue?.value;
  if (EmailId) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETEMAILSTATUS", {
        EMAIL_ID: EmailId ?? "",
      });
    if (status === "0") {
      const EMAIL_STATUS = data?.[0]?.EMAIL_ID_STATUS;
      if (EMAIL_STATUS && EMAIL_STATUS !== "1") {
        return "PleaseEnterValidEmailID";
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const getMortgageNoData = async ({ COMP_CD, TRAN_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEQUITABLEMORTDATA", {
      COMP_CD: COMP_CD,
      TRAN_CD: TRAN_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// export const getAreaListDDW = async (pinCode, formState, _, authState) => {
//   if (Boolean(pinCode) && pinCode?.length === 6) {
//     const { data, status, message, messageDetails } =
//       await AuthSDK.internalFetcher("GETAREADDW", {
//         COMP_CD: authState.companyID ?? "",
//         BRANCH_CD: authState?.user?.branchCode ?? "",
//       });
//     if (status == 0) {
//       let responseData = data;
//       // Filter the data based on PIN_CODE
//       if (Array.isArray(responseData)) {
//         responseData = responseData.filter((item) => item.PIN_CODE === pinCode);
//         responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
//           return {
//             ...other,
//             AREA_CD: AREA_CD,
//             AREA_NM: AREA_NM,
//             label: AREA_NM,
//             value: AREA_CD,
//           };
//         });
//       }
//       return responseData;
//     }
//   } else {
//     const { data, status, message, messageDetails } =
//       await AuthSDK.internalFetcher("GETAREADDW", {
//         COMP_CD: authState.companyID ?? "",
//         BRANCH_CD: authState?.user?.branchCode ?? "",
//       });
//     if (status === "0") {
//       let responseData = data;
//       if (Array.isArray(responseData)) {
//         responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
//           return {
//             ...other,
//             AREA_CD: AREA_CD,
//             AREA_NM: AREA_NM,
//             label: AREA_NM,
//             value: AREA_CD,
//           };
//         });
//       }
//       // formState.setDataOnFieldChange("RES_DATA", responseData);
//       return responseData;
//     } else {
//       throw DefaultErrorObject(message, messageDetails);
//     }
//   }
// };

let cachedAreaData = null;
export const fetchAreaData = async (authState) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAREADDW", {
      COMP_CD: authState.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => ({
        ...other,
        AREA_CD: AREA_CD,
        AREA_NM: AREA_NM,
        label: AREA_NM,
        value: AREA_CD,
      }));
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const filterAreaDataByPinCode = (responseData, pinCode) => {
  if (pinCode && pinCode.length === 6) {
    return responseData.filter((item) => item.PIN_CODE === pinCode);
  }
  return responseData;
};
export const getAreaListDDW = async (pinCode, formState, _, authState) => {
  if (!cachedAreaData) {
    cachedAreaData = await fetchAreaData(authState);
  }
  const filteredData = filterAreaDataByPinCode(cachedAreaData, pinCode);
  return filteredData;
};

export const getPropertyStateDDW = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTATEDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ STATE_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          value: STATE_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPropertyDistrictDDW = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDISTRICTDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DIST_CD, DIST_NM }) => {
        return {
          value: DIST_CD,
          label: DIST_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMonthlyHouseHoldIncomeDDW = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMONTHLYHOUSEHOLDINCOME", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DATA_VAL, DISP_VAL }) => {
        return {
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMachineryDtlDefaultDW = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDEFAULTDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DATA_VAL, DISP_VAL }) => {
        return {
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAccountDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTDETAILS", reqData);
  if (status === "0") {
let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map((item) => {
        const { MAIN_DETAIL, ...other } = item;
        if (MAIN_DETAIL) {
          if (
            MAIN_DETAIL.hasOwnProperty("PRIORITY_CD") &&
            typeof MAIN_DETAIL?.PRIORITY_CD === "string"
          ) {
            MAIN_DETAIL.PRIORITY_CD = MAIN_DETAIL?.PRIORITY_CD.trim();
          }
        }
        return {
          ...other,
          MAIN_DETAIL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// get data in Letter of credit button in collateral dtl tab
export const getLetterOfCntGridData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLCDPDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getNextDisbursementData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETNEXTDISBDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getInterestRate = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  CUSTOMER_ID,
  PARSE_CODE,
  WORKING_DATE,
  SANCTIONED_AMT,
  SANCTION_DT,
  SCREEN_REF,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINTERESTRATE", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      CUSTOMER_ID: CUSTOMER_ID,
      PARSE_CODE: PARSE_CODE,
      WORKING_DATE: WORKING_DATE,
      SANCTIONED_AMT: SANCTIONED_AMT,
      SANCTION_DT: SANCTION_DT,
      SCREEN_REF: SCREEN_REF,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateCurrentTabButtonData = async (apiReq) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOUPDATEMAINTABDTL",
    {
      ...apiReq,
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMortgageTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTMORTGAGEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CODE: CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAdvocateTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTADVOCATEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CODE: CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getValuerTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTVALUERNMDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CODE: CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getGuardianorRelationTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTGUARDIANDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CODE: CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getNPATypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTNPADDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ NPA_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          NPA_CD: NPA_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: NPA_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getSegmentPTSOp = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTPTSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CODE: CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPurposeTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTPURPOSEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ PURPOSE_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            PURPOSE_CD: PURPOSE_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: PURPOSE_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPrioritParentTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTPRIORITYPARENTDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ PRIORITY_CD, PRIORITY_NM, ...other }) => {
          return {
            ...other,
            PRIORITY_CD: PRIORITY_CD,
            PRIORITY_NM: PRIORITY_NM,
            value: PRIORITY_CD,
            label: PRIORITY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPrioritMainTypeOP = async ({
  COMP_CD,
  BRANCH_CD,
  dependentValue,
}) => {
  const PARENT_GROUP = dependentValue?.PARENT_GROUP?.value;
  if (Boolean(PARENT_GROUP)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACTPRIORITYMAINDDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        PARENT_GROUP: PARENT_GROUP,
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ PRIORITY_CD, DISPLAY_NM, ...other }) => {
            return {
              ...other,
              PRIORITY_CD: PRIORITY_CD,
              DISPLAY_NM: DISPLAY_NM,
              value: PRIORITY_CD,
              label: DISPLAY_NM,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else {
    return [];
  }
};

export const getPriorityWeakerTypeOP = async ({
  COMP_CD,
  BRANCH_CD,
  dependentValue,
}) => {
  const PRIO_CD = dependentValue?.PRIO_CD?.value;
  if (Boolean(PRIO_CD)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACTWEAKERSUBPRIODDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        PRIORITY_CD: PRIO_CD,
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ SUB_PRIORITY_CD, DESCRIPTION, ...other }) => {
            return {
              ...other,
              SUB_PRIORITY_CD: SUB_PRIORITY_CD,
              DESCRIPTION: `${SUB_PRIORITY_CD} ${DESCRIPTION}`,
              value: SUB_PRIORITY_CD,
              label: `${SUB_PRIORITY_CD} ${DESCRIPTION}`,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else {
    return [];
  }
};

export const getCategoryTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTCATEGORYDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CATEG_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CATEG_CD: CATEG_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: CATEG_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAgentTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTAGENTDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ AGENT_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          AGENT_CD: AGENT_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: AGENT_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getFreezeReasonDDW = async ({ COMP_CD, BRANCH_CD, STATUS }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTSTATUSREASONDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      STATUS: STATUS,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CODE: CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRecurringInstallmentDDW = async ({
  COMP_CD,
  BRANCH_CD,
  INSTALLMENT_TYPE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETRECINSTNODDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      INSTALLMENT_TYPE: INSTALLMENT_TYPE,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ INST_NO, PERIOD_NM, ...other }) => {
        return {
          ...other,
          INST_NO: INST_NO,
          PERIOD_NM: PERIOD_NM,
          value: INST_NO,
          label: INST_NO + " " + PERIOD_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCurrentTabButtonsData = async ({
  companyID,
  branchCode,
  accountType,
  accountCode,
  columnName,
  workingDate,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACMSTMISCCDTRNDATA", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
      ACCT_TYPE: accountType,
      ACCT_CD: accountCode,
      COL_NAME: columnName,
      WORKING_DATE: workingDate,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

interface RiskReqParam {
  COMP_CD: string;
  BRANCH_CD: string;
  FOR_SHARE?: string;
}
export const getRiskCategTypeOP = async (reqObj: RiskReqParam) => {
  const { COMP_CD, BRANCH_CD, FOR_SHARE } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTRISKCLASSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      FOR_SHARE: FOR_SHARE ?? "N",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CLASS_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CLASS_CD: CLASS_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: CLASS_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getIndustryTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTINDUSTRYDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ INDUSTRY_CODE, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            INDUSTRY_CODE: INDUSTRY_CODE,
            DISPLAY_NM: DISPLAY_NM,
            value: INDUSTRY_CODE,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRECRETypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTRECREDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ RENRE_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          RENRE_CD: RENRE_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: RENRE_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getBusinessypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTBUSINESSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ BUSINESS_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            BUSINESS_CD: BUSINESS_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: BUSINESS_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAdvDirectorNameTypeOP = async ({ A_ROLE_IND }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDIRECTORLIST", {
      ROLE: A_ROLE_IND,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DIRECTOR_CD, DIRECTOR_NM, ...other }) => {
          return {
            ...other,
            DIRECTOR_CD: DIRECTOR_CD,
            DIRECTOR_NM: DIRECTOR_NM,
            value: DIRECTOR_CD,
            label: DIRECTOR_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCheqSignAuthoTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTCHQSIGNAUTHODDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TRAN_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          TRAN_CD: TRAN_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: TRAN_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getIntSkipReasonTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTINSSKIPREASNDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TRAN_CD, DESCRIPTION, ...other }) => {
        return {
          ...other,
          TRAN_CD: TRAN_CD,
          DESCRIPTION: DESCRIPTION,
          value: TRAN_CD,
          label: DESCRIPTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getSecurityTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTSECURITYCDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ SECURITY_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            SECURITY_CD: SECURITY_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: SECURITY_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCollateralSecurityDataDDW = async (reqData: any) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECMSTDDDW", { ...reqData });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_NM, SECURITY_CD, ...other }) => {
          return {
            value: SECURITY_CD,
            label: DISPLAY_NM,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getJointCreditWorthinessData = async ({
  A_WORKING_DATE,
  A_COMP_CD,
  A_BRANCH_CD,
  A_ACCT_TYPE,
  A_ACCT_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTJOINTABCREDWORTH", {
      A_COMP_CD: A_COMP_CD,
      A_BRANCH_CD: A_BRANCH_CD,
      A_ACCT_TYPE: A_ACCT_TYPE,
      A_ACCT_CD: A_ACCT_CD,
      A_WORKING_DATE: A_WORKING_DATE,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// for relative dtl marital status field only
export const getMaritalStatusOP = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMARITALSTATUSDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_VALUE, DATA_VALUE, ...other }) => {
          return {
            ...other,
            DISPLAY_VALUE: DISPLAY_VALUE,
            DATA_VALUE: DATA_VALUE,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// retrieving document medatory docs in grid for new entry
export const getKYCDocumentGridData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  CONSTITUTION_TYPE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDOCTEMPLATEDTL", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CUSTOMER_TYPE: null,
      ACCT_TYPE: ACCT_TYPE ?? null,
      // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      // TRAN_CD: "42"
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DOC_DESCRIPTION, TEMPLATE_CD, ...other }) => {
          return {
            ...other,
            DOC_DESCRIPTION: DOC_DESCRIPTION,
            TEMPLATE_CD: TEMPLATE_CD,
            label: DOC_DESCRIPTION,
            value: TEMPLATE_CD,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDocumentImagesList = async ({ TRAN_CD, SR_CD, REQ_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCKYCDOCSCNHISDISP", {
      TRAN_CD: TRAN_CD,
      SR_CD: SR_CD,
      REQ_CD: REQ_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ LINE_CD, ...other }) => {
        return {
          ...other,
          LINE_CD: LINE_CD,
          LINE_ID: LINE_CD,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustDocumentOpDtl = async ({
  COMP_CD,
  BRANCH_CD,
  formState,
}) => {
  const { gridData, rowsData } = formState;
  // console.log("qekuwhdiuwehdw", formState)
  let selectedDoc: any[] = [];
  if (rowsData && rowsData.length > 0) {
    selectedDoc = rowsData.map((el) => {
      return el.data.TEMPLATE_CD ?? "";
    });
  } else if (gridData && gridData.length > 0) {
    selectedDoc = gridData.map((el) => {
      return el.TEMPLATE_CD ?? "";
    });
  }
  // console.log(gridData, "auedhniuwehdwe", formMode)
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTDOCUMENT", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (rowsData && rowsData.length > 0) {
      responseData = responseData.filter((el) =>
        selectedDoc.includes(el.SR_CD)
      );
    } else if (gridData && gridData.length > 0) {
      responseData = responseData.filter(
        (el) => !selectedDoc.includes(el.SR_CD)
      );
    }
    // console.log("auedhniuwehdwe  qwed", data)
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, SR_CD, ...other }) => {
        // if(selectedDoc.includes(SR_CD)) {

        // } else {
        return {
          ...other,
          DESCRIPTION: DESCRIPTION,
          SR_CD: SR_CD,
          label: DESCRIPTION,
          value: SR_CD,
        };
        // }
        // }
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// export const validateNewAcct = async (reqData) => {
//   const { IsNewRow, formData, SCREEN_REF } = reqData;
//   console.log(" validate reqdata", formData);

//   const jointTabs = [
//     "JOINT_HOLDER_DTL",
//     "JOINT_NOMINEE_DTL",
//     "JOINT_GUARDIAN_DTL",
//     "JOINT_GUARANTOR_DTL",
//     "JOINT_HYPOTHICATION_DTL",
//     "JOINT_SIGNATORY_DTL",
//     "JOINT_INTRODUCTOR_DTL",
//   ];
//   let JOINT_ACCOUNT_DTL: any[] = [];
//   jointTabs.forEach((jointTab) => {
//     if (Object.hasOwn(formData, jointTab)) {
//       JOINT_ACCOUNT_DTL = [...JOINT_ACCOUNT_DTL, ...formData[jointTab]];
//     }
//   });
//   // Map DOC_MST if exists
//   let docPayload = formData["DOC_MST"]?.doc_mst_payload;
//   if (docPayload) {
//     docPayload = docPayload.map((row) => ({
//       VALID_UPTO: format(new Date(row?.VALID_UPTO), "dd/MMM/yyyy") ?? "",
//       DOC_TYPE: row?.DOC_TYPE,
//       TEMPLATE_CD: row?.TEMPLATE_CD ?? "",
//       DOC_WEIGHTAGE: row?.DOC_WEIGHTAGE ?? "",
//       ACTIVE: row?.ACTIVE === true || row?.ACTIVE === "Y" ? "Y" : "N",
//       DOC_NO: row?.DOC_NO ?? "",
//       DOC_AMOUNT: row?.DOC_AMOUNT ?? "",
//       SUBMIT: row?.SUBMIT ?? "",
//     }));
//   }
//   let mainDetails = formData["MAIN_DETAIL"];
//   if (mainDetails) {
//     ["HANDICAP_FLAG", "MOBILE_REG", "SALARIED", "INT_SKIP_FLAG"].forEach(
//       (key) =>
//         (mainDetails[key] =
//           mainDetails[key] === true || mainDetails[key] === "Y" ? "Y" : "N")
//     );
//   }
//   const payload = {
//     IsNewRow,
//     SCREEN_REF,
//     JOINT_ACCOUNT_DTL,
//     MAIN_DETAIL: { ...mainDetails },
//     DOC_MST: docPayload ?? [],
//   };
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("VALIDATEACCOUNTDTL", payload);
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };
export const validateNewAcct = async (reqData) => {
  const {
    IsNewRow,
    formData,
    SCREEN_REF,
    COMP_CD,
    BRANCH_CD,
    ACCT_TYPE,
    oldData,
    oldDocData,
    oldJointData,
    updated_tab_format,
    REQ_CD,
    NEW_REQ_DATA,
    mainIntialVals,
  } = reqData;
  const jointTabs = [
    "JOINT_HOLDER_DTL",
    "JOINT_NOMINEE_DTL",
    "JOINT_GUARDIAN_DTL",
    "JOINT_GUARANTOR_DTL",
    "JOINT_HYPOTHICATION_DTL",
    "JOINT_SIGNATORY_DTL",
    "JOINT_INTRODUCTOR_DTL",
  ];
  let JOINT_ACCOUNT_DTL: any[] = [];
  jointTabs.forEach((jointTab) => {
    if (Object.hasOwn(formData, jointTab)) {
      JOINT_ACCOUNT_DTL = [
        ...JOINT_ACCOUNT_DTL,
        ...formData[jointTab].map((item: any) => ({
          ...item,
          ACTIVE_FLAG: "Y",
        })),
      ];
    }
  });
  if (Boolean(IsNewRow)) {
    let docPayload = formData["DOC_MST"]?.doc_mst_payload;
    if (docPayload) {
      docPayload = docPayload.map((row) => ({
        VALID_UPTO: Boolean(row?.VALID_UPTO)
          ? format(utilFunction.getParsedDate(row?.VALID_UPTO), "dd/MMM/yyyy")
          : "",
        DOC_TYPE: row?.DOC_TYPE,
        TEMPLATE_CD: row?.TEMPLATE_CD ?? "",
        DOC_WEIGHTAGE: row?.DOC_WEIGHTAGE ?? "",
        ACTIVE: row?.ACTIVE === true || row?.ACTIVE === "Y" ? "Y" : "N",
        DOC_NO: row?.DOC_NO ?? "",
        DOC_AMOUNT: row?.DOC_AMOUNT ?? "",
        SUBMIT: row?.SUBMIT ?? "",
        IsNewRow: row?._isNewRow ?? "",
      }));
    }
    let mainDetails = formData["MAIN_DETAIL"];
    if (mainDetails) {
      // ["HANDICAP_FLAG", "MOBILE_REG", "SALARIED", "INT_SKIP_FLAG"].forEach(
      //   (field) =>
      //     (mainDetails[field] =
      //       mainDetails[field] === true || mainDetails[field] === "Y" ? "Y" : "N")
      // );
      ["HANDICAP_FLAG", "MOBILE_REG", "SALARIED", "INT_SKIP_FLAG"].forEach(
        (field) => {
          mainDetails[field] =
            typeof mainDetails[field] === "boolean"
              ? Boolean(mainDetails[field])
                ? "Y"
                : "N"
              : Boolean(mainDetails[field])
              ? mainDetails[field]
              : "N";
        }
      );
    }
    const payload = {
      IsNewRow,
      SCREEN_REF,
      ...NEW_REQ_DATA,
      JOINT_ACCOUNT_DTL,
      MAIN_DETAIL: { ...mainIntialVals, ...mainDetails },
      DOC_MST: docPayload ?? [],
    };
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("VALIDATEACCOUNTDTL", payload);
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else if (!Boolean(IsNewRow)) {
    let jointTabPayload = oldJointData;
    if (jointTabPayload) {
      jointTabPayload = jointTabPayload.map((row) => ({
        J_TYPE: row?.J_TYPE ?? "",
        CUSTOMER_ID: row?.CUSTOMER_ID ?? "",
        REF_PERSON_NAME: row?.REF_PERSON_NAME ?? "",
        MORT_AMT: row?.MORT_AMT ?? "",
      }));
    }
    const dateFields: string[] = [
      "BIRTH_DT",
      "UDYAM_REG_DT",
      "APPLY_DT",
      "CLOSE_DT",
      "DATE_OF_DEATH",
      "DATE_OF_COMMENCEMENT",
      "DATE_OF_RETIREMENT",
      "DISBURSEMENT_DT",
      "ENTERED_DATE",
      "INST_DUE_DT",
      "INS_START_DT",
      "LAST_MODIFIED_DATE",
      "LST_STATEMENT_DT",
      "LST_INT_COMPUTE_DT",
      "LST_INT_APPLY_DT",
      "OP_DATE",
      "VERIFIED_DATE",
      "UDYAM_REG_DT",
      "SANCTION_DT",
    ];
    dateFields.forEach((field) => {
      if (Object.hasOwn(oldData, field)) {
        oldData[field] = Boolean(oldData[field])
          ? format(utilFunction.getParsedDate(oldData[field]), "dd/MMM/yyyy")
          : "";
      }
    });
    [
      "SALARIED",
      "HANDICAP_FLAG",
      "MOBILE_REG",
      "INT_SKIP_FLAG",
      "MOBILE_REG_FLAG",
      "SELF_EMPLOYED",
    ].forEach((field) => {
      oldData[field] =
        typeof oldData[field] === "boolean"
          ? Boolean(oldData[field])
            ? "Y"
            : "N"
          : Boolean(oldData[field])
          ? oldData[field]
          : "N";
    });

    let oldDocPayload = oldDocData;
    // console.log("uhwfueifhiwfewfwf myrmyr", oldDocData);
    if (oldDocPayload) {
      oldDocPayload = oldDocPayload.map((row) => ({
        DOC_AMOUNT: row?.DOC_AMOUNT ?? "",
        DOC_TYPE: row?.DOC_TYPE ?? "",
        DOC_NO: row?.DOC_NO ?? "",
        DOC_WEIGHTAGE: row?.DOC_WEIGHTAGE ?? "",
        VALID_UPTO: Boolean(row?.VALID_UPTO)
          ? format(utilFunction.getParsedDate(row?.VALID_UPTO), "dd/MMM/yyyy")
          : "",
        TEMPLATE_CD: row?.TEMPLATE_CD ?? "",
        ACTIVE: row?.ACTIVE ?? "",
        SUBMIT: row?.SUBMIT ?? "",
      }));
    }
    let newMainDetail = updated_tab_format?.MAIN_DETAIL;
    if (newMainDetail) {
      newMainDetail = updated_tab_format?.MAIN_DETAIL;
    } else {
      // Implement Empty request for main tab while update
      newMainDetail = {
        _UPDATEDCOLUMNS: [],
        _OLDROWVALUE: {},
        IsNewRow: false,
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        ACCT_TYPE: ACCT_TYPE,
        ACCT_CD: NEW_REQ_DATA?.ACCT_CD,
        REQ_CD: REQ_CD,
      };
    }
    let newDocPayload = updated_tab_format?.DOC_MST;
    if (newDocPayload) {
      newDocPayload = newDocPayload.map((row) => ({
        // ...row,
        DOC_AMOUNT: row?.DOC_AMOUNT ?? "",
        DOC_TYPE: row?.DOC_TYPE ?? "",
        DOC_NO: row?.DOC_NO ?? "",
        DOC_WEIGHTAGE: row?.DOC_WEIGHTAGE ?? "",
        VALID_UPTO: Boolean(row?.VALID_UPTO)
          ? format(utilFunction.getParsedDate(row?.VALID_UPTO), "dd/MMM/yyyy")
          : "",
        TEMPLATE_CD: row?.TEMPLATE_CD ?? "",
        ACTIVE: row?.ACTIVE ?? "",
        SUBMIT: row?.SUBMIT ?? "",
        TRAN_CD: row?.TRAN_CD ?? "",
        SR_CD: row?.SR_CD ?? "",
        REQ_CD: REQ_CD ?? "",
        IsNewRow: row?._isDeleteRow ? true : false,
        _UPDATEDCOLUMNS: row?._UPDATEDCOLUMNS,
        _OLDROWVALUE: row?._OLDROWVALUE,
        DETAILS_DATA: row?.DETAILS_DATA,
      }));
    }
    // when their is not data in doc so not share new Update requerst
    // else {
    //   newDocPayload = [
    //     {
    //       _UPDATEDCOLUMNS: [],
    //       _OLDROWVALUE: {},
    //       IsNewRow: false,
    //       COMP_CD: COMP_CD,
    //       IS_FROM_MAIN: "N",
    //       NEW_FLAG: "N",
    //       BRANCH_CD: BRANCH_CD,
    //       ACCT_TYPE: ACCT_TYPE,
    //     },
    //   ];
    // }

    let payload = {
      IsNewRow,
      SCREEN_REF,
      ...NEW_REQ_DATA,
      OLD_MAIN_DATA: oldData ?? {},
      OLD_DOCUMENT_DATA: oldDocPayload ?? [],
      OLD_JOINT_DATA: jointTabPayload ?? [],
      MAIN_DETAIL: newMainDetail,
      DOC_MST: newDocPayload, /// get an error related to IsNewRow Not found
    };
    if (Object.hasOwn(updated_tab_format, "JOINT_ACCOUNT_DTL")) {
      payload["JOINT_ACCOUNT_DTL"] = updated_tab_format?.JOINT_ACCOUNT_DTL;
    }
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("VALIDATEACCOUNTDTL", payload);
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const accountSave = async (reqData) => {
  const {
    IsNewRow,
    REQ_CD,
    REQ_FLAG,
    SAVE_FLAG,
    CUSTOMER_ID,
    ACCT_TYPE,
    ACCT_CD,
    COMP_CD,
    BRANCH_CD,
    formData,
    OP_DATE,
    SCREEN_REF,
    mainIntialVals,
  } = reqData;

  // console.log("wefhiwheifhweihf", formData)
  const jointTabs = [
    "JOINT_HOLDER_DTL",
    "JOINT_NOMINEE_DTL",
    "JOINT_GUARDIAN_DTL",
    "JOINT_GUARANTOR_DTL",
    "JOINT_HYPOTHICATION_DTL",
    "JOINT_SIGNATORY_DTL",
    "JOINT_INTRODUCTOR_DTL",
  ];

  let payload = {};

  let joint_account_dtl: any[] = [];
  if (Object.keys(formData)?.length > 0) {
    Object.keys(formData).forEach((tab: string) => {
      if (jointTabs.includes(tab)) {
        joint_account_dtl = [...joint_account_dtl, ...formData[tab]];
      } else if (tab === "DOC_MST") {
        payload[tab] = formData[tab]?.doc_mst_payload;
      } else if (tab === "MAIN_DETAIL") {
        payload["MAIN_DETAIL"] = {
          ...mainIntialVals,
          ...formData["MAIN_DETAIL"],
          COMP_CD: COMP_CD ?? "",
          BRANCH_CD: BRANCH_CD ?? "",
          OP_DATE,
        };
      } else {
        payload[tab] = formData[tab];
      }
    });
    payload["JOINT_ACCOUNT_DTL"] = joint_account_dtl?.map((row) => ({
      ...row,
      IsNewRow: IsNewRow,
      ACTIVE: row.ACTIVE === true || row.ACTIVE === "Y" ? "Y" : "N",
    }));
    payload["OTHER_ADDRESS_DTL"] = formData?.OTHER_ADDRESS_DTL?.map((row) => ({
      ...row,
      ACCT_TYPE,
    }));
    payload["MOBILE_REG_DTL"] = formData?.MOBILE_REG_DTL?.map((row) => ({
      ...row,
      MOBILE_REG_FLAG:
        row.MOBILE_REG_FLAG === true || row.MOBILE_REG_FLAG === "Y" ? "Y" : "N",
    }));
    payload["RELATIVE_DTL"] = formData?.RELATIVE_DTL?.map((row) => ({
      ...row,
      SALARIED: row.SALARIED === true || row.SALARIED === "Y" ? "Y" : "N",
      SELF_EMPLOYED:
        row.SELF_EMPLOYED === true || row.SELF_EMPLOYED === "Y" ? "Y" : "N",
    }));
    const ENTRY_TYPE = "1";
    payload = {
      ...payload,
      SCREEN_REF,
      IsNewRow,
      REQ_CD,
      REQ_FLAG,
      SAVE_FLAG,
      CUSTOMER_ID,
      ACCT_TYPE,
      ACCT_CD,
      COMP_CD,
      ENTRY_TYPE,
    };
    // console.log("AcctMSTContextwadqwdwq. woiuioehfiuwhefwef", payload)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("SAVEACCOUNTDATA", payload);
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const accountModify = async (reqData) => {
  // console.log("account-modify asdasdasd", reqData)
  const {
    IsNewRow,
    REQ_CD,
    REQ_FLAG,
    SAVE_FLAG,
    CUSTOMER_ID,
    ACCT_TYPE,
    ACCT_CD,
    COMP_CD,
    BRANCH_CD,
    formData,
    updated_tab_format,
    OP_DATE,
  } = reqData;
  let payload = {};

  const ENTRY_TYPE = "";
  payload = {
    ...payload,
    IsNewRow,
    REQ_CD,
    REQ_FLAG,
    SAVE_FLAG,
    CUSTOMER_ID,
    ACCT_TYPE,
    ACCT_CD,
    COMP_CD,
    BRANCH_CD,
    ENTRY_TYPE: ENTRY_TYPE,
    ...updated_tab_format,
  };
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVEACCOUNTDATA", payload);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const confirmAccount = async ({ REQUEST_CD, REMARKS, CONFIRMED }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFIRMACCTDATA", {
      REQUEST_CD: REQUEST_CD,
      REMARKS: REMARKS,
      CONFIRMED: CONFIRMED,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const advConfCodeDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETADVCONFIGCODEDDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            value: DATA_VALUE.trim(),
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const advConfDefDD = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETADVCONFIGDEFINITION", { ...apiReq });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VAL, DISP_VAL, ...other }) => {
        return {
          ...other,
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const advConfDocdtl = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETADVCONFIGPARADOCDTL", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getOtherSecurityBtnDetail = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMORTSECURITYDATA", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDefaultDDW = async (...req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDEFAULTDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DISP_VAL, DATA_VAL, ...others }) => {
        return {
          ...others,
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLimitSecDTL = async ({ COMP_CD, BRANCH_CD, SECURITY_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECDTLDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      SECURITY_CD: SECURITY_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DESCRIPTION, SR_CD, ...others }) => {
        return {
          ...others,
          value: SR_CD,
          label: DESCRIPTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDPIDDdw = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDPIDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DP_NAME, DP_ID, ...others }) => {
        return {
          ...others,
          value: DP_ID,
          label: DP_NAME,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getScriptDdw = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSCRIPTDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(
        ({ SCRIPT_NM, SCRIPT_CD, ...others }) => {
          return {
            ...others,
            value: SCRIPT_CD,
            label: SCRIPT_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const otherSecurityDTL = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOSECURITYTYPEDTLDML", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getShareMemCardDdw = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSHAREMEMCARDDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(
        ({ DISPLAY_VALUE, DATA_VALUE, ...others }) => {
          return {
            ...others,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateANCAMT = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  CUSTOMER_ID,
  CATEG_CD,
  PURPOSE_CD,
  PTS,
  INT_RATE_BASE_ON,
  SHARE_ACCT_TYPE,
  SHARE_ACCT_CD,
  APPLIED_AMT,
  LIMIT_AMOUNT,
  SANCTIONED_AMT,
  SANCTION_DT,
  RECOMMENED_NM,
  WORKING_DATE,
  SCREEN_REF,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATESANCAMT", {
      COMP_CD,
      BRANCH_CD,
      ACCT_TYPE,
      ACCT_CD,
      CUSTOMER_ID,
      CATEG_CD,
      PURPOSE_CD,
      PTS,
      INT_RATE_BASE_ON,
      SHARE_ACCT_TYPE,
      SHARE_ACCT_CD,
      APPLIED_AMT,
      LIMIT_AMOUNT,
      SANCTIONED_AMT,
      SANCTION_DT,
      RECOMMENED_NM,
      WORKING_DATE,
      SCREEN_REF,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// URNUAN format validation api
export const getUdyamRegNoStatus = async (UDYAMVal) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUDYAMREGNOSTATUS", {
      UDYAMNO: UDYAMVal,
    });
  if (status === "0") {
    const UDYAM_STATUS = data?.[0]?.UDYAM_STATUS;
    if (Boolean(UDYAM_STATUS)) {
      return UDYAM_STATUS;
    }
    return "";
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRecAcDetails = async (
  currField,
  dependentFields,
  auth,
  formState
) => {
  let currFieldName = currField?.name?.split("/");
  let fieldName = currFieldName[currFieldName.length - 1];
  let CategCd =
    fieldName === "CATEG_CD"
      ? currField?.value
      : dependentFields?.CATEG_CD?.value;
  let InsStartDate =
    fieldName === "INS_START_DT"
      ? currField?.value
      : dependentFields?.INS_START_DT?.value;
  let formattedInsStartDate = Boolean(InsStartDate)
    ? format(utilFunction.getParsedDate(InsStartDate), "dd/MMM/yyyy")
    : "";
  let InstallmentType =
    fieldName === "INSTALLMENT_TYPE"
      ? currField?.value
      : dependentFields?.INSTALLMENT_TYPE?.value;
  let InstNo =
    fieldName === "INST_NO"
      ? currField?.value
      : dependentFields?.INST_NO?.value;
  let InstRs =
    fieldName === "INST_RS"
      ? currField?.value
      : dependentFields?.INST_RS?.value;
  let IntRate =
    fieldName === "INT_RATE"
      ? currField?.value
      : dependentFields?.INT_RATE?.value;
  const Condition = formState?.ACCT_TYPE_CONDITION?.[0]?.TAB_NAME;
  if (Condition === "REC" || Condition === "RECD") {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETRECACDETAIL", {
        COMP_CD: auth?.companyID ?? "",
        BRANCH_CD: auth?.user?.branchCode ?? "",
        ACCT_TYPE: formState?.ACCT_TYPE ?? "",
        CATEG_CD: CategCd ?? "",
        INS_START_DT: formattedInsStartDate ?? "",
        INSTALLMENT_TYPE: InstallmentType ?? "",
        INST_NO: InstNo ?? "",
        INST_RS: InstRs ?? "",
        INT_RATE: IntRate ?? "",
        WORKING_DATE: auth?.workingDate ?? "",
      });
    if (status === "0") {
      return {
        INST_DUE_DT: {
          value: data?.[0]?.INST_DUE_DT,
          ignoreUpdate: true,
        },
        DUE_AMT: {
          value: data?.[0]?.DUE_AMT,
          ignoreUpdate: true,
        },
        INT_RATE: {
          value: data?.[0]?.INT_RATE,
          ignoreUpdate: true,
        },
        PENAL_RATE: {
          value: data?.[0]?.PENAL_RATE,
          ignoreUpdate: true,
        },
      };
    } else {
      return {
        [fieldName]: {
          value: "",
          error: message ?? "",
          ignoreUpdate: true,
        },
        INST_DUE_DT: {
          value: "",
          ignoreUpdate: true,
        },
        DUE_AMT: {
          value: "",
          ignoreUpdate: true,
        },
        INT_RATE: {
          value: "",
          ignoreUpdate: true,
        },
        PENAL_RATE: {
          value: "",
          ignoreUpdate: true,
        },
      };
    }
  } else {
    return {};
  }
};

export const validateDisbDT = async ({
  COMP_CD,
  BRANCH_CD,
  DISBURSEMENT_DT,
  SANCTION_DT,
  WORKING_DATE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEDISBDT", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
      DISBURSEMENT_DT: DISBURSEMENT_DT ?? "",
      SANCTION_DT: SANCTION_DT ?? "",
      WORKING_DATE: WORKING_DATE ?? "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateApplyDT = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEAPPLYDT", { ...req });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateSanctionDT = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATESANCTIONDT", { ...req });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getEmi = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMI", { ...req });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateInstNo = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEINSTNO", { ...req });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateShareMemAcct = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATESHAREMEMACCT", { ...reqData });
  if (status === "0") {
    let responseData = data;
    return responseData[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
