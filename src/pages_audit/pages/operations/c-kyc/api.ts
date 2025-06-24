import { DefaultErrorObject, utilFunction } from "@acuteinfo/common-base";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const TodaysTransactionTableGrid = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
      COMP_CD: COMP_CD,
      // BASE_BRANCH_CD: BASE_BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const GetCategoryOptions = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CATEGORYNAME", {
      // COMP_CD: COMP_CD,
      // BASE_BRANCH_CD: BASE_BRANCH_CD,
      // BRANCH_CD: BRANCH_CD,
      // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      // CUST_TYPE: CUST_TYPE
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const GetAreaOptions = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAREA", {
      // COMP_CD: COMP_CD,
      // BASE_BRANCH_CD: BASE_BRANCH_CD,
      // BRANCH_CD: BRANCH_CD,
      // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      // CUST_TYPE: CUST_TYPE
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerDetails = async ({
  COMP_CD,
  CUST_ID,
  CONTACT_NO,
  PAN_NO,
  ACCT_NM,
  UNIQ_ID,
  E_MAIL_ID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERDTL", {
      COMP_CD: "132",
      CUST_ID: "211562",
      CONTACT_NO: " ",
      PAN_NO: " ",
      ACCT_NM: " ",
      UNIQ_ID: " ",
      E_MAIL_ID: " ",
      // BASE_BRANCH_CD: BASE_BRANCH_CD,
      // BRANCH_CD: BRANCH_CD,
      // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      // CUST_TYPE: CUST_TYPE
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTabsDetail = async ({
  COMP_CD,
  ENTITY_TYPE,
  CATEGORY_CD,
  CONS_TYPE,
  isFreshEntry,
  CONFIRMFLAG,
}) => {
  if (Boolean(isFreshEntry && !CATEGORY_CD)) {
    return [];
  }
  const entry_mode = isFreshEntry
    ? "NEW"
    : Boolean(CONFIRMFLAG)
    ? CONFIRMFLAG === "Y"
      ? "EDIT"
      : "NEW"
    : "EDIT";
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCIFTABDTL", {
      COMP_CD: COMP_CD,
      ENTITY_TYPE: ENTITY_TYPE,
      // CATEGORY_CD: CATEGORY_CD,
      // CONS_TYPE: CONS_TYPE,
      ENTRY_MODE: entry_mode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerDetailsonEdit = async (reqData) => {
  // console.log("iuehfiwuehfwef", reqData)
  // COMP_CD, CUSTOMER_ID?, REQUEST_CD?}
  // const {COMP_CD, CUSTOMER_ID, REQUEST_CD} = reqData
  // let payload = {}
  // // console.log("req. dataaa COMP_CD", COMP_CD, CUSTOMER_ID, REQUEST_CD)
  // if(CUSTOMER_ID) {
  //   payload = {
  //     COMP_CD: COMP_CD,
  //     CUSTOMER_ID: CUSTOMER_ID
  //   }
  // } else {
  //   payload = {
  //     COMP_CD: COMP_CD,
  //     REQUEST_CD: REQUEST_CD
  //   }
  // }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERDETAILS", reqData);
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

export const updateExtDocument = async (payload) => {
  // console.log("updateExtDocument payload", payload)
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CUSTDOCUMENTDATADML", payload);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

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
      responseData = responseData.map(
        ({ CATEG_CD, CATEG_NM, CONSTITUTION_NAME, ...other }) => {
          return {
            ...other,
            CATEG_CD: CATEG_CD,
            CATEG_NM: CATEG_NM,
            CONSTITUTION_NAME: CONSTITUTION_NAME,
            value: CATEG_CD,
            label: `${CATEG_NM} - ${CONSTITUTION_NAME}`,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getOccupationDTL = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOCCUPATIONLIST", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
      CONSTITUTION_TYPE: "I",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TRADE_CD, TRADE_NM, ...other }) => {
        return {
          ...other,
          TRADE_CD: TRADE_CD,
          TRADE_NM: TRADE_NM,
          value: TRADE_CD,
          label: TRADE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRatingOpDTL = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTRATELIST", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ RATE_CD, RATE_NM, ...other }) => {
        return {
          ...other,
          RATE_CD: RATE_CD,
          RATE_NM: RATE_NM,
          value: RATE_CD,
          label: RATE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLegalCompanyTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTRATELIST", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ RATE_CD, RATE_NM, ...other }) => {
        return {
          ...other,
          RATE_CD: RATE_CD,
          RATE_NM: RATE_NM,
          value: RATE_CD,
          label: RATE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPMISCData = async (CATEGORY_CD, otherParam?) => {
  let payload = {
    CATEGORY_CD: CATEGORY_CD,
  };
  if (CATEGORY_CD === "TDS_EXEMPTION") {
    const { dependentValue, formState } = otherParam;
    const formMode = formState?.formMode;
    if (formMode === "edit") {
      payload["FORM_TYPE"] = dependentValue?.FORM_TYPE?.value ?? "";
    }
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPMISCDATA", payload);
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      // console.log("qweqwerr", responseData) // checked for pass, dr - expiry date

      if (CATEGORY_CD == "CKYC_RELAT_PERS" && otherParam?.CUST_TYPE) {
        let resOp: any = [];
        responseData.map((element, i) => {
          if (element?.REMARKS === "I") {
            resOp.push(element);
          }
        });
        if (resOp && resOp.length > 0) {
          // return resOp;
          responseData = resOp;
        }
      }

      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
          return {
            ...other,
            DATA_VALUE: DATA_VALUE,
            DISPLAY_VALUE: DISPLAY_VALUE,
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

export const GetDynamicSalutationData = async (CATEGORY_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSALUTATIONDATA", {
      CATEGORY: CATEGORY_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
          return {
            ...other,
            DATA_VALUE: DATA_VALUE,
            DISPLAY_VALUE: DISPLAY_VALUE,
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

export const getGenderOp = (dependentValue) => {
  const opString = dependentValue?.PREFIX_CD?.optionData?.[0]?.GENDER ?? "";
  const opArr: any[] =
    opString.indexOf(",") === -1
      ? [opString]
      : opString.split(",")?.map((el) => el.trim()); // [M,F,O]
  let allOptions = [
    { label: "MALE", value: "M" },
    { label: "FEMALE", value: "F" },
    { label: "OTHER", value: "O" },
    { label: "TRANSGENDER", value: "T" },
  ];
  if (Boolean(opString && Array.isArray(opArr))) {
    let options: any[] = [];
    allOptions.forEach((op) => {
      if (opArr.includes(op.value)) {
        options.push(op);
      }
    });
    if (options && options.length > 0) {
      allOptions = options;
    }
  }
  return allOptions;
};

export const getCountryOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCOUNTRYLIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      // console.log("qweqwerr", responseData)
      responseData = responseData.map(
        ({ COUNTRY_CD, COUNTRY_NM, ...other }) => {
          return {
            ...other,
            COUNTRY_CD: COUNTRY_CD,
            COUNTRY_NM: COUNTRY_NM,
            value: COUNTRY_CD,
            label: COUNTRY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerGroupOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTGROUPLIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ GROUP_CD, DESCRIPTION, ...other }) => {
        return {
          ...other,
          GROUP_CD: GROUP_CD,
          DESCRIPTION: DESCRIPTION,
          value: GROUP_CD,
          label: DESCRIPTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCommunityList = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTCOMMULIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CONSTITUTION_TYPE: "I",
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
export const getParentAreaOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARENTAREALIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ P_AREA_NM, P_AREA_CD, ...other }) => {
        return {
          ...other,
          P_AREA_NM: P_AREA_NM,
          P_AREA_CD: P_AREA_CD,
          value: P_AREA_CD,
          label: P_AREA_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateEmailID = async (columnValue) => {
  const EMAIL_ID = columnValue.value;
  if (EMAIL_ID) {
    // console.log("ewqkudiwqehid", EMAIL_ID)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETEMAILSTATUS", {
        EMAIL_ID: EMAIL_ID,
      });
    if (status === "0") {
      // const responseData = data
      const EMAIL_ID_STATUS = data?.[0]?.EMAIL_ID_STATUS;
      if (EMAIL_ID_STATUS) {
        // console.log("dataawdawd", EMAIL_ID_STATUS)
        if (EMAIL_ID_STATUS === "0") {
          return "Please Enter Valid Email ID";
        } else return "";
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const validateMobileNo = async (columnValue, allField, formState) => {
  // console.log("columnValue, allField, flag", columnValue, allField, formState)
  const MOBILE_NO = columnValue.value;
  const SCREEN = formState?.docCD;
  const STD_CD = allField.STD_2.value;
  const FLAG = "Y";

  if (MOBILE_NO) {
    // console.log("ewqkudiwqehid", EMAIL_ID)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETMOBILESTATUS", {
        // EMAIL_ID: EMAIL_ID
        MOBILE_NO: MOBILE_NO,
        SCREEN: SCREEN,
        STD_CD: STD_CD,
        FLAG: FLAG,
      });
    if (status === "0") {
      // console.log("columnValue, allField, flag data", data)
      const message = data?.[0]?.MOBILE_STATUS;
      if (message) {
        return message;
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const validateUniqueId = async (columnValue, allField?, formState?) => {
  // console.log("validateUniqueId", columnValue)
  const UNIQUEID = columnValue.value;

  if (UNIQUEID) {
    // console.log("ewqkudiwqehid", EMAIL_ID)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETUNIQUEIDSTATUS", {
        UNIQUEID: UNIQUEID,
      });
    if (status === "0") {
      // console.log("validateUniqueId data", data)
      const UID_STATUS = data?.[0]?.UID_STATUS;
      // console.log("wekjfhiweufhw",UID_STATUS)
      if (UID_STATUS) {
        if (UID_STATUS === "I") {
          return "PleaseEnterValidUniqueID";
        } else if (UID_STATUS === "N") {
          return "UniqueIDLength";
        }
      } else return "";
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const validateGSTIN = async (columnValue, allField, flag) => {
  // console.log("validateGSTIN", columnValue)
  const GSTIN = columnValue.value;

  if (GSTIN) {
    // console.log("ewqkudiwqehid", EMAIL_ID)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETGSTINSTATUS", {
        GSTIN: GSTIN,
      });
    if (status === "0") {
      // console.log("validateGSTIN data", data)
      const GSTIN_STATUS = data?.[0]?.GSTIN_STATUS;
      // const UID_STATUS = data?.[0]?.UID_STATUS
      if (GSTIN_STATUS) {
        return GSTIN_STATUS;
      } else return "";
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const validatePAN = async (columnValue, allField?, formState?) => {
  // console.log(columnValue, "validatePAN", allField, formState)
  const PAN = columnValue.value;

  if (PAN) {
    // console.log("ewqkudiwqehid", EMAIL_ID)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETPANSTATUS", {
        PAN: PAN,
      });
    if (status === "0") {
      // console.log("validatePAN data", data)
      const PAN_STATUS = data?.[0]?.PAN_STATUS;
      if (PAN_STATUS && PAN_STATUS !== "Y") {
        return "PleaseEnterValidPAN";
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const DuplicationValidate = async (
  columnValue,
  allField,
  formState,
  fieldValue?
) => {
  // console.log("ewoiejfowieijfowiejfwoiejf", columnValue, allField, formState, fieldValue)
  const { COMP_CD, BRANCH_CD, CATEG_CD, CUSTOMER_ID } = formState;
  // export const DuplicationValidate = async (field, formState, authState, dependentFieldsValues, fieldObj) => {
  // if (fieldValue && typeof fieldValue === "object") {
  if (
    columnValue?.value &&
    fieldValue &&
    typeof fieldValue === "object" &&
    Object.hasOwn(fieldValue, "CHECK_FOR")
  ) {
    const { fieldNm, CHECK_FOR } = fieldValue;
    let keys = Object.keys(fieldValue);
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("CHECKCUSTDUPLICATEDATA", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        CATEG_CD: CATEG_CD,
        CUSTOMER_ID: CUSTOMER_ID,
        DATAVALUE: columnValue.value,
        CHECK_FOR: CHECK_FOR,
      });
    if (status === "0") {
      // console.log("waefdwdqwedqwd data success..", data)
      if (Array.isArray(data) && data?.length > 0) {
        const messagebox = async (msgTitle, msg, buttonNames, status) => {
          let buttonName = await formState.MessageBox({
            messageTitle: msgTitle,
            message: msg,
            buttonNames: buttonNames,
            icon:
              status === "9"
                ? "WARNING"
                : status === "99"
                ? "CONFIRM"
                : status === "999"
                ? "ERROR"
                : status === "0" && "SUCCESS",
          });
          return { buttonName, status };
        };

        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS !== "0") {
            let btnName = await messagebox(
              data[i]?.O_MSG_TITLE ?? data[i]?.O_STATUS === "999"
                ? data[i]?.O_MSG_TITLE || "ValidationFailed"
                : data[i]?.O_STATUS === "99"
                ? data[i]?.O_MSG_TITLE || "Confirmed"
                : data[i]?.O_STATUS === "9"
                ? data[i]?.O_MSG_TITLE || "Alert"
                : "Alert",
              data[i]?.O_MESSAGE,
              data[i]?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"],
              data[i]?.O_STATUS
            );
            if (btnName?.status === "999" || btnName?.buttonName === "No") {
              return {
                [fieldNm]: { value: "" },
              };
            } else {
              if (CHECK_FOR === "1") {
                return { otherData: data };
              }
            }
          }
        }
      }
      return {};
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};
// export const getSubAreaOptions = async (dependentValue, COMP_CD, BRANCH_CD) => {
//   console.log("getSubAreaOptions called", dependentValue)
//   // let Parent_Area = ""
//   // let apiData:any[] = []
//   // if(dependentValue?.PAR_AREA_CD?.value) {
//   //   let resData:any[] = []
//   //   Parent_Area = dependentValue.PAR_AREA_CD.value
//   //   resData = apiData.filter(d => d?.PARENT_AREA == Parent_Area)
//   //   return resData;
//   // }

//   if(!Boolean(dependentValue.PAR_AREA_CD.value)) {
//     const { data, status, message, messageDetails } =
//       await AuthSDK.internalFetcher("GETAREALIST", {
//         COMP_CD: COMP_CD,
//         BRANCH_CD: BRANCH_CD,
//       });
//     if (status === "0") {
//       let responseData = data;
//       // responseData = data.filter(d => d?.PARENT_AREA == Parent_Area);
//       // console.log(responseData, "subarea", responseData.length, data.length )
//       if (Array.isArray(responseData)) {

//         // if(dependentValue?.PAR_AREA_CD?.value) {
//         //   // let resData:any[] = []
//         //   // Parent_Area = dependentValue.PAR_AREA_CD.value
//         //   // resData = apiData.filter(d => d?.PARENT_AREA == Parent_Area)
//         //   // return resData;
//         //   let Parent_Area = dependentValue.PAR_AREA_CD.value
//         //   responseData = responseData.filter(d => d?.PARENT_AREA == Parent_Area)
//         // }

//         responseData = responseData.map(({ AREA_NM, AREA_CD, ...other }) => {
//             return {
//               ...other,
//               AREA_NM: AREA_NM,
//               AREA_CD: AREA_CD,
//               value: AREA_CD,
//               label: AREA_NM,
//             };
//           }
//         );
//       }
//       return responseData
//     } else {
//       throw DefaultErrorObject(message, messageDetails);
//     }
//   }
// }

// export const getSubAreaOptions = async (dependentValue, COMP_CD, BRANCH_CD) => {
//   const { data, status, message, messageDetails } =
//   await AuthSDK.internalFetcher("GETAREALIST", {
//     COMP_CD: COMP_CD,
//     BRANCH_CD: BRANCH_CD,
//     PIN_CODE: "123456"
//   });

//   if (status === "0") {
//     let responseData = data;
//     if (Array.isArray(responseData)) {
//       let Parent_Area = null;
//       if(dependentValue?.PAR_AREA_CD?.value) {
//         Parent_Area = dependentValue.PAR_AREA_CD.value
//         responseData = responseData.filter(d => d?.PARENT_AREA == Parent_Area)
//       } else if (dependentValue?.LOC_AREA_CD?.value) {
//         Parent_Area = dependentValue.LOC_AREA_CD.value
//         responseData = responseData.filter(d => d?.PARENT_AREA == Parent_Area)
//       }

//       responseData = responseData.map(({ AREA_NM, AREA_CD, ...other }) => {
//           return {
//             ...other,
//             AREA_NM: AREA_NM,
//             AREA_CD: AREA_CD,
//             value: AREA_CD,
//             label: AREA_NM,
//           };
//         }
//       );
//     }
//     return responseData
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// }

// for retrieveing data, in retrieve, personal/entity details, in grid
export const getRetrieveData = async ({ COMP_CD, BRANCH_CD, A_PARA }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SEARCHCUSTID", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      A_PARA: A_PARA,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// for getting pending entries, in grid
export const getPendingData = async (reqObj: {
  A_COMP_CD: string;
  A_BRANCH_CD: string;
  A_FLAG: string;
}) => {
  const { A_COMP_CD, A_BRANCH_CD, A_FLAG } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETREQCUSTLIST", {
      A_COMP_CD,
      A_BRANCH_CD,
      A_FLAG,
    });
  if (status === "0") {
    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.CONFIRMED === "Y") {
        item._rowColor = "rgb(9 132 3 / 51%)";
      }
      if (item?.CONFIRMED === "R") {
        item._rowColor = "rgb(152 59 70 / 61%)";
      }
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const ConfirmPendingCustomers = async ({
  REQUEST_CD,
  REMARKS,
  CONFIRMED,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFIRMCUSTOMERDATA", {
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

export const ConfirmCustPhoto = async ({ REQUEST_CD, COMP_CD, CONFIRMED }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFIRMCUSTPHOTODATA", {
      REQUEST_CD: REQUEST_CD,
      COMP_CD: COMP_CD,
      CONFIRMED: CONFIRMED,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const ConfirmDocument = async ({
  REQUEST_CD,
  COMP_CD,
  CONFIRMED,
  REMARKS,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFIRMCUSTDOCDATA", {
      REQUEST_CD: REQUEST_CD,
      COMP_CD: COMP_CD,
      CONFIRMED: CONFIRMED,
      REQ_FROM: "CUST",
      REMARKS: REMARKS,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRangeOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETNNULINCOME", {
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
export const getEmpCompanyTypes = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCOMPTYPENM", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ COMPANY_TYPE_CD, DISPLAY_COMP_TYPE_NM, ...other }) => {
          return {
            ...other,
            COMPANY_TYPE_CD: COMPANY_TYPE_CD,
            DISPLAY_COMP_TYPE_NM: DISPLAY_COMP_TYPE_NM,
            value: COMPANY_TYPE_CD,
            label: DISPLAY_COMP_TYPE_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getEduQualiOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEDUCATIONDTL", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ED_TYPE_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            ED_TYPE_CD: ED_TYPE_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: ED_TYPE_CD,
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

// export const getRelationshipManagerOptions = async (COMP_CD) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("RELATIONSHIPMANAGER", {
//       COMP_CD: COMP_CD,
//     });
//   if (status === "0") {
//     let responseData = data;
//     if (Array.isArray(responseData)) {
//       responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
//           return {
//             ...other,
//             FULLNAME:FULLNAME,
//             EMP_ID: EMP_ID,
//             label: FULLNAME,
//             value: EMP_ID,
//           };
//         }
//       );
//     }
//     return responseData
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// }

export const getRelationshipManagerOptions = async (COMP_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCKYCNRITABRMDDW", {
      COMP_CD: COMP_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
        return {
          ...other,
          FULLNAME: FULLNAME,
          EMP_ID: EMP_ID,
          label: FULLNAME,
          value: EMP_ID,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDocumentTypes = async ({ TRAN_CD, SR_CD, DOC_TYPE }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCCUMENTSCANHISTORY", {
      TRAN_CD: "189084",
      SR_CD: "1",
      DOC_TYPE: "KYC",
    });
  if (status === "0") {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
    //       return {
    //         ...other,
    //         FULLNAME:FULLNAME,
    //         EMP_ID: EMP_ID,
    //         label: FULLNAME,
    //         value: EMP_ID,
    //       };
    //     }
    //   );
    // }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// retrieving document medatory docs in grid for new entry
export const getKYCDocumentGridData = async ({
  COMP_CD,
  BRANCH_CD,
  CUST_TYPE,
  CONSTITUTION_TYPE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDOCTEMPLATEDTL", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CUSTOMER_TYPE: CUST_TYPE ?? null,
      ACCT_TYPE: null,
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

export const getPhotoSignImage = async ({ COMP_CD, reqCD, customerID }) => {
  const reqObj = reqCD
    ? {
        COMP_CD: COMP_CD,
        REQUEST_CD: reqCD,
      }
    : {
        COMP_CD: COMP_CD,
        CUSTOMER_ID: customerID,
      };
  if (reqCD || customerID) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTOMERHISTORY", reqObj);
    // GETCUSTIMGHISMST
    if (status === "0") {
      let responseData = data;
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};
export const updatePhotoSignData = async (reqData) => {
  // console.log(":wedwd", reqData)
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUPDCUSTPHOTODATA", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustLatestDtl = async ({
  COMP_CD,
  BRANCH_CD,
  SCREEN_REF,
  CUSTOMER_ID,
  REQUEST_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERPHOTODETAILS", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      SCREEN_REF: SCREEN_REF,
      CUSTOMER_ID: CUSTOMER_ID,
      REQUEST_CD: REQUEST_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPhotoSignHistory = async ({ COMP_CD, CUSTOMER_ID, REQ_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTSIGNPHOTOHISTORY", {
      COMP_CD: COMP_CD,
      CUSTOMER_ID: CUSTOMER_ID,
      REQ_CD: REQ_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getControllCustInfo = async ({
  COMP_CD,
  BRANCH_CD,
  CUSTOMER_ID,
  FROM,
}) => {
  if (CUSTOMER_ID) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETVIEWDTL", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        CUSTOMER_ID: CUSTOMER_ID,
        // CATEG_CD: CATEG_CD,
        // formIndex: formIndex
      });
    if (status === "0") {
      // console.log("asdqwsxavqad", data)
      if (FROM == "metadata") {
        return {
          REF_ACCT_NM: { value: data[0].ACCT_NM ?? "" },
        };
      } else {
        return data;
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else {
    if (FROM == "metadata") {
      return {
        REF_ACCT_NM: { value: "" },
      };
    }
  }
};

export const validateSpecialCharsAndSpaces = (columnValue) => {
  const value = columnValue?.value;
  if (!value) return "";
  let regex = /^[a-zA-Z\s]*$/;

  if (value?.startsWith(" ")) {
    return "SpacebeforeNameNotAllowed";
  } else if (value?.endsWith(" ")) {
    return "SpaceAfterNameNotAllowed";
  } else if (/  /.test(value)) {
    return "DoubleSpaceNotAllowed";
  } else if (/\s{2,}/.test(value)) {
    return "DoubleSpaceNotAllowed";
  } else if (!regex.test(value)) {
    return "PleaseEnterCharacterValue";
  }
  return "";
};

export const validateCharValue = (columnValue) => {
  const value = columnValue?.value;
  if (!value) return "";
  if (!/^[a-zA-Z\s]*$/.test(value)) {
    return "PleaseEnterCharacterValue";
  }
  return "";
};

export const SaveAsDraft = async ({
  CUSTOMER_TYPE,
  CATEGORY_CD,
  ACCT_TYPE,
  KYC_NUMBER,
  CONSTITUTION_TYPE,
  IsNewRow,
  PERSONAL_DETAIL,
  COMP_CD,
  BRANCH_CD,
}) => {
  // console.log("reqdataa..",
  //   // `
  //   // // ${Object.keys(PERSONAL_DETAIL)}`,
  // )
  const remainingData = {
    // IsNewRow: IsNewRow,
    // REQ_CD:"",
    // REQ_FLAG:"F",
    // SAVE_FLAG:"D",
    // ENTRY_TYPE :"F",
    // CUSTOMER_ID:"",

    IsNewRow: IsNewRow,
    REQ_CD: "",
    REQ_FLAG: "F",
    SAVE_FLAG: "D",
    ENTRY_TYPE: "1",
    CUSTOMER_ID: "",
    COMP_CD: COMP_CD,
  };
  const remainingPD = {
    IsNewRow: IsNewRow,
    CUSTOMER_TYPE: CUSTOMER_TYPE,
    // CATEGORY_CD: CATEGORY_CD,
    // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
    CONSTITUTION_TYPE: CONSTITUTION_TYPE,
    COMP_CD: COMP_CD,
    BRANCH_CD: BRANCH_CD,
    ACCT_TYPE: ACCT_TYPE,
    REQ_FLAG: "F",
    CATEG_CD: CATEGORY_CD,
    // entityType: CUSTOMER_TYPE,
    // COUNTRY_CD: "123 ",
    // KYC_NUMBER: KYC_NUMBER ?? "",
    // GST_NO: "",
  };

  // not found in individual type cust. form
  const ExtraData = {
    APPLICATION_TYPE: "Y",
    // ENTERED_DATE: format(new Date(), "dd-MMM-yyyy"),
    // ENTERED_DATE: "20-July-2023",
    // STD_1: "",
    // STD_4: "54890",
    // STD_2: "",
    // STD_3: "",
    // CONTACT1: "",
    // CONTACT4: "",
    // CONTACT2: "7858089344",
    // CONTACT3: "",
    SAME_AS_PER: PERSONAL_DETAIL.SAME_AS_PER ? "Y" : "N",
    // formData["PERSONAL_DETAIL"].SAME_AS_PER = formData["PERSONAL_DETAIL"].SAME_AS_PER ? "Y" : "N";
    ENT_BRANCH_CD: "099 ", //need-in-legal
    ENT_COMP_CD: "132 ", //need-in-legal

    // SCREEN: "",
    // ISD_CD:"456783",
    // ENTERED_BY:"hff",
    // PAN_NO: "DWIPP9643D",
    // UNIQUE_ID: "673598516700",
  };

  // let REQDATA = {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData}
  // REQDATA = {
  //   ...REQDATA,
  // }

  // console.log("wndiuwqieiqweqwe apipip", {
  //   ...remainingData,
  //   PERSONAL_DETAIL: {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData}
  // })

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVECUSTOMERDATA", {
      ...remainingData,
      PERSONAL_DETAIL: { ...PERSONAL_DETAIL, ...remainingPD, ...ExtraData },
    });
  if (status === "0") {
    // let responseData = data;
    // console.log("asdwqe responseData", responseData)
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

interface ValidateDocType {
  PAN_NO: string;
  UNIQUE_ID: string;
  ELECTION_CARD_NO: string;
  NREGA_JOB_CARD: string;
  PASSPORT_NO: string;
  DRIVING_LICENSE_NO: string;
  TEMPLATE_CD: string;
  CUST_TYP: string;
}
export const validateDocData = async (reqObj: ValidateDocType) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEDOCDATA", reqObj);
  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const SaveEntry = async (reqdata) => {
  const {
    CUSTOMER_ID,
    CUSTOMER_TYPE,
    CATEGORY_CD,
    ACCT_TYPE,
    KYC_NUMBER,
    CONSTITUTION_TYPE,
    IsNewRow,
    REQ_CD,
    formData,
    COMP_CD,
    BRANCH_CD,
    isDraftSaved,
    updated_tab_format,
  } = reqdata;

  let payload: any = {};
  Object.keys(formData).forEach((tabdata) => {
    if (tabdata === "PERSONAL_DETAIL") {
      if (isDraftSaved) {
        if (updated_tab_format && updated_tab_format["PERSONAL_DETAIL"]) {
          // console.log("awndiuwhieuhdiweuhdw", updated_tab_format)
          payload[tabdata] = updated_tab_format["PERSONAL_DETAIL"];
        }
      } else {
        let personalDtl = formData["PERSONAL_DETAIL"];
        const remainingPD = {
          IsNewRow: IsNewRow,
          CUSTOMER_TYPE: CUSTOMER_TYPE,
          // CATEGORY_CD: CATEGORY_CD,
          // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
          CONSTITUTION_TYPE: CONSTITUTION_TYPE,
          COMP_CD: COMP_CD,
          BRANCH_CD: BRANCH_CD,
          ACCT_TYPE: ACCT_TYPE,
          REQ_FLAG: "F",
          CATEG_CD: CATEGORY_CD,
          // entityType: CUSTOMER_TYPE,
          // COUNTRY_CD: "123 ",
          KYC_NUMBER: KYC_NUMBER ?? "",
          // GST_NO: "",
        };
        const ExtraData = {
          APPLICATION_TYPE: "01",
        };
        // const ExtraData = {
        //   SAME_AS_PER: PERSONAL_DETAIL.SAME_AS_PER ? "Y" : "N",
        //   ENT_BRANCH_CD :"099 ", //need-in-legal
        //   ENT_COMP_CD: "132 ", //need-in-legal
        // }
        let sameAsPer = personalDtl?.SAME_AS_PER;
        if (!Boolean(sameAsPer)) {
          sameAsPer = "N";
        } else if (typeof sameAsPer === "boolean") {
          if (sameAsPer) {
            sameAsPer = "Y";
          } else {
            sameAsPer = "N";
          }
        } else if (sameAsPer !== "Y" && sameAsPer !== "N") {
          sameAsPer = "N";
        }
        const personalDtlDateFields = [
          "BIRTH_DT",
          "KYC_REVIEW_DT",
          "PASSPORT_ISSUE_DT",
          "PASSPORT_EXPIRY_DT",
          "DRIVING_LICENSE_ISSUE_DT",
          "DRIVING_LICENSE_EXPIRY_DT",
          "COMMENCEMENT_DT",
          "LIQUIDATION_DT",
          "FATCA_DT",
          "DATE_OF_COMMENCEMENT",
          "LEI_EXPIRY_DATE",
        ];
        personalDtlDateFields.forEach((fieldNm) => {
          if (Boolean(personalDtl[fieldNm])) {
            personalDtl[fieldNm] = format(
              utilFunction.getParsedDate(personalDtl[fieldNm]),
              "dd-MMM-yyyy"
            );
          }
        });
        payload[tabdata] = {
          ...personalDtl,
          ...remainingPD,
          ...ExtraData,
          SAME_AS_PER: sameAsPer,
        };
      }
    } else if (tabdata === "DOC_MST") {
      let doc_mst = formData["DOC_MST"]?.["doc_mst_payload"];
      payload[tabdata] = [...doc_mst];
    } else if (tabdata === "OTHER_DTL") {
      let otherDtl = formData["OTHER_DTL"];
      const otherDtlCheckboxes = [
        "POLITICALLY_CONNECTED",
        "BLINDNESS",
        "REFERRED_BY_STAFF",
      ];
      const otherDtlDateFields = ["JOINING_DT", "RETIREMENT_DT"];
      otherDtlCheckboxes.forEach((fieldNm) => {
        if (!Boolean(otherDtl[fieldNm])) {
          otherDtl[fieldNm] = "N";
        } else if (typeof otherDtl[fieldNm] === "boolean") {
          if (otherDtl[fieldNm]) {
            otherDtl[fieldNm] = "Y";
          } else {
            otherDtl[fieldNm] = "N";
          }
        } else if (otherDtl[fieldNm] !== "Y" && otherDtl[fieldNm] !== "N") {
          otherDtl[fieldNm] = "N";
        }
      });
      otherDtlDateFields.forEach((fieldNm) => {
        if (Boolean(otherDtl[fieldNm])) {
          otherDtl[fieldNm] = format(
            utilFunction.getParsedDate(otherDtl[fieldNm]),
            "dd-MMM-yyyy"
          );
        }
      });
      payload[tabdata] = otherDtl;
    } else if (tabdata === "ATTESTATION_DTL") {
      let attestData = formData["ATTESTATION_DTL"];
      const attestDateFields = ["IPV_DATE", "DATE_OF_DECLARE"];
      attestDateFields.forEach((fieldNm) => {
        if (Boolean(attestData[fieldNm])) {
          attestData[fieldNm] = format(
            utilFunction.getParsedDate(attestData[fieldNm]),
            "dd-MMM-yyyy"
          );
        }
      });
      payload[tabdata] = attestData;
    } else if (tabdata === "NRI_DTL") {
      let nriDtl = formData["NRI_DTL"];
      const nriDateFields = ["VISA_ISSUE_DT", "VISA_EXPIRY_DT"];
      nriDateFields.forEach((fieldNm) => {
        if (Boolean(nriDtl[fieldNm])) {
          nriDtl[fieldNm] = format(
            utilFunction.getParsedDate(nriDtl[fieldNm]),
            "dd-MMM-yyyy"
          );
        }
      });
      payload[tabdata] = nriDtl;
    } else if (tabdata === "RELATED_PERSON_DTL") {
      let relPersonDtl = formData["RELATED_PERSON_DTL"];
      const relPersonDateFields = [
        "DRIVING_LICENSE_EXPIRY_DT",
        "PASSPORT_EXPIRY_DT",
        "IPV_DATE",
        "DATE_OF_DECLARE",
      ];
      if (Array.isArray(relPersonDtl) && relPersonDtl.length > 0) {
        relPersonDtl = relPersonDtl.map((row) => {
          relPersonDateFields.forEach((fieldNm) => {
            if (Boolean(row[fieldNm])) {
              row[fieldNm] = format(
                utilFunction.getParsedDate(row[fieldNm]),
                "dd-MMM-yyyy"
              );
            }
          });
          return row;
        });
      }
      payload[tabdata] = relPersonDtl;
    } else {
      payload[tabdata] = formData[tabdata];
    }
  });
  payload = {
    ...payload,
    IsNewRow: true,
    // REQ_CD:"734",
    REQ_CD: REQ_CD,
    REQ_FLAG: "F",
    SAVE_FLAG: "F",
    ENTRY_TYPE: "1",
    CUSTOMER_ID: "",
    COMP_CD: COMP_CD,
  };
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVECUSTOMERDATA", payload);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateCustomer = async ({
  COMP_CD,
  updated_tab_format,
  update_type,
  CUSTOMER_ID,
  REQ_CD,
  REQ_FLAG,
  SAVE_FLAG,
  IsNewRow,
}) => {
  let new_updated_tab_format = { ...updated_tab_format };
  if (new_updated_tab_format["PERSONAL_DETAIL"]) {
    new_updated_tab_format["PERSONAL_DETAIL"] = {
      ...new_updated_tab_format["PERSONAL_DETAIL"],
      APPLICATION_TYPE: "01",
    };
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVECUSTOMERDATA", {
      // IsNewRow: true,
      // // REQ_CD:"734",
      // REQ_CD:REQ_CD,
      // REQ_FLAG:"F",
      // SAVE_FLAG:"F",
      // ENTRY_TYPE :"1",
      // CUSTOMER_ID:"",
      // NRI_DTL: formData["NRI_DTL"], //test-done
      CUSTOMER_ID: CUSTOMER_ID,
      REQ_CD: REQ_CD,
      REQ_FLAG: REQ_FLAG,
      SAVE_FLAG: SAVE_FLAG,
      // SAVE_FLAG: "",
      ENTRY_TYPE: "",
      // ENTRY_TYPE : state?.req_cd_ctx ? "2" : "1",
      IsNewRow: IsNewRow,
      COMP_CD: COMP_CD,
      // CUSTOMER_ID:"",
      // NRI_DTL: formData["NRI_DTL"], //test-done,
      // DOC_MST: [],
      // ...updated_tab_format,
      ...new_updated_tab_format,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateAlphaNumValue = (columnValue) => {
  if (!columnValue?.value) return "";
  if (!/^[a-zA-Z0-9\s]*$/.test(columnValue?.value)) {
    return "PleaseEnterAlphanumericValue";
  }
  return "";
};

// to show total_acct number, in deactivate customer
export const DeactivateCustomer = async ({ CUSTOMER_ID, COMP_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATETOINACTIVE", {
      // VALIDATETOINACTIVE, old - CUSTOMERDEPENDENCYCOUNT
      COMP_CD: COMP_CD,
      CUSTOMER_ID: CUSTOMER_ID,
    });
  if (status === "0") {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ ED_TYPE_CD, DISPLAY_NM, ...other }) => {
    //       return {
    //         ...other,
    //         ED_TYPE_CD: ED_TYPE_CD,
    //         DISPLAY_NM: DISPLAY_NM,
    //         value: ED_TYPE_CD,
    //         label: DISPLAY_NM,
    //       };
    //     }
    //   );
    // }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAttestHistory = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTATTESTHISDTL", {
      COMP_CD: COMP_CD,
      CUSTOMER_ID: CUSTOMER_ID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAttestData = async ({
  COMP_CD,
  BRANCH_CD,
  CUSTOMER_ID,
  USER_NAME,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTATTESTRITDTL", {
      CUSTOMER_ID: CUSTOMER_ID,
      USER_NAME: USER_NAME,
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getEmpCodeList = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSECUSERDDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ USER_NAME, ...other }) => {
        return {
          ...other,
          label: USER_NAME,
          value: USER_NAME,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getOptionsOnPinParentArea = async (
  pinCode,
  formState,
  _,
  authState
) => {
  if (Boolean(pinCode) && pinCode?.length > 5) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETAREALIST", {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        PIN_CODE: pinCode,
        // FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
        // PARENT_AREA: PARENT_AREA,
        FLAG: "P",
        PARENT_AREA: "",
      });

    if (status == 0) {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
          return {
            ...other,
            AREA_CD: AREA_CD,
            AREA_NM: AREA_NM,
            label: AREA_NM,
            value: AREA_CD,
          };
        });
      }
      return responseData;
    }
  } else return [];
};

export const getOptionsOnPinParentAreaOtherAdd = async (
  dependentValue,
  formState,
  _,
  authState
) => {
  // console.log("getOptionsOnPinParentArea dp.", dependentValue["OTHER_ADDRESS[0].PIN_CODE"]?.value)
  let PIN_CODE = "",
    PARENT_AREA = "";
  if (
    Array.isArray(Object.keys(dependentValue)) &&
    Object.keys(dependentValue)?.[0]?.split(".")[1]?.includes("PIN_CODE")
  ) {
    PIN_CODE = dependentValue[Object.keys(dependentValue)?.[0]]?.value ?? "";
  }
  // if (Boolean(PIN_CODE) && PIN_CODE?.length > 5) {
  //   PIN_CODE = dependentValue["OTHER_ADDRESS[0].PIN_CODE"]?.value;
  // }
  console.log("fiehfeefwef", PIN_CODE);
  if (PIN_CODE && PIN_CODE?.length > 5) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETAREALIST", {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        PIN_CODE: PIN_CODE,
        // FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
        // PARENT_AREA: PARENT_AREA,
        FLAG: "P",
        PARENT_AREA: "",
      });

    if (status == 0) {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
          return {
            ...other,
            AREA_CD: AREA_CD,
            AREA_NM: AREA_NM,
            label: AREA_NM,
            value: AREA_CD,
          };
        });
      }
      return responseData;
    }
  } else {
    return [];
  }
};

// export const getOptionsOnPin = async (dependentValue, formState, _, authState) => {
//   // console.log("getOptionsOnPinParentArea dp.", dependentValue?.PIN_CODE, dependentValue?.PAR_AREA_CD)
//   let PIN_CODE = "";
//   if(dependentValue?.PIN_CODE?.value && dependentValue?.PIN_CODE?.value?.length>5) {
//     // console.log("getOptionsOnPinParentArea dp pincode", dependentValue?.PIN_CODE?.value, dependentValue?.PAR_AREA_CD?.value)
//     PIN_CODE = dependentValue?.PIN_CODE?.value
//   }
//   if(dependentValue?.PIN_CODE?.value && dependentValue?.PIN_CODE?.value?.length<5) {

//   } else if(PIN_CODE) {
//     const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETAREALIST", {
//       COMP_CD: authState?.companyID ?? "",
//       BRANCH_CD: authState?.user?.branchCode ?? "",
//       PIN_CODE: PIN_CODE,
//       FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
//     });

//     if(status == 0) {
//       // console.log("getOptionsOnPinParentArea data", data)
//       let responseData = data;
//       if (Array.isArray(responseData)) {
//         responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
//             return {
//               ...other,
//               AREA_CD: AREA_CD,
//               AREA_NM: AREA_NM,
//               label: AREA_NM,
//               value: AREA_CD,
//             };
//           }
//         );
//       }
//       return responseData
//     }
//     }
// }

export const getOptionsOnLocalPinParentArea = async (
  dependentValue,
  formState,
  _,
  authState
) => {
  // console.log("getOptionsOnPinParentArea dp.", dependentValue?.PIN_CODE, dependentValue?.LOC_AREA_CD)
  let PIN_CODE = "",
    PARENT_AREA = "";
  if (
    dependentValue.LOC_PIN_CODE &&
    dependentValue?.LOC_PIN_CODE?.value &&
    dependentValue.LOC_PIN_CODE?.value?.length > 5
  ) {
    // console.log("getOptionsOnPinParentArea dp pincode", dependentValue?.LOC_PIN_CODE?.value, dependentValue?.LOC_AREA_CD?.value)
    PIN_CODE = dependentValue?.LOC_PIN_CODE?.value;
  }
  if (PIN_CODE) {
    // console.log("getOptionsOnPinParentArea dp f", PIN_CODE, PARENT_AREA)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETAREALIST", {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        PIN_CODE: PIN_CODE,
        // FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
        // PARENT_AREA: PARENT_AREA,
        FLAG: "P",
        PARENT_AREA: "",
      });

    if (status == 0) {
      // console.log("getOptionsOnPinParentArea data", data)
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
          return {
            ...other,
            AREA_CD: AREA_CD,
            AREA_NM: AREA_NM,
            label: AREA_NM,
            value: AREA_CD,
          };
        });
      }
      return responseData;
    }
  }
};

// to get data, in grid
export const getInsuranceGridData = async ({ COMP_CD, CUSTOMER_ID }) => {
  // const { data, status, message, messageDetails } =
  // await AuthSDK.internalFetcher("CUSTOMERDEPENDENCYCOUNT", {
  //   COMP_CD: COMP_CD,
  //   CUSTOMER_ID: CUSTOMER_ID,
  // });
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINSURANCE", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });

  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// get bank detail data, in grid
export const getBankDTLGridData = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("OTHERBANKDETAIL", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// to get data, in grid
export const getCreditCardDTLGridData = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CUSTOMERCREDITCARDDTL", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// to get data, in grid
export const getOffencesDTLGridData = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("OFFENCESDTL", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// to get data, in grid
export const getControllingPersonDTLGridData = async ({
  COMP_CD,
  CUSTOMER_ID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONTROLLINGPERSONDTL", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });
  if (status == 0) {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ACTIVE, ...other }) => {
        return {
          ...other,
          ACTIVE: ACTIVE === "Y" ? true : false,
        };
      });
    }
    return responseData;
  }
};

// to get data, in grid
export const getAssetDTLGridData = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETASSETDTL", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });
  if (status == 0) {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ ACTIVE, ...other }) => {
    //       return {
    //         ...other,
    //         ACTIVE: ACTIVE === "Y" ? true : false
    //       };
    //     }
    //   );
    // }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// to get data, in grid
export const getFinancialDTLGridData = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFINANCIALDETAIL", {
      CUSTOMER_ID: CUSTOMER_ID,
      COMP_CD: COMP_CD,
    });
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCategoryDTL = async ({ COMP_CD, BRANCH_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCATEGORYDTL", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CUSTOMER_ID: CUSTOMER_ID,
    });
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCalculatedRate = async (reqObj) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CALCULATEINTRATE", reqObj);
  if (status == 0) {
    const {
      NEW_PENAL_RATE,
      NEW_AGCLR_RATE,
      NEW_DUE_AMT,
      NEW_INT_RATE,
      NEW_INSU_PENAL_RATE,
      NEW_INST_RS,
    } = data;
    return {
      NEW_AG_CL_RATE: { value: NEW_AGCLR_RATE ?? "" },
      NEW_INST_RS: { value: NEW_INST_RS },
      NEW_INS_EXPIRY_PENAL_RATE: { value: NEW_INSU_PENAL_RATE ?? "" },
      NEW_INT_RATE: { value: NEW_INT_RATE ?? "" },
      NEW_PENAL_RATE: { value: NEW_PENAL_RATE ?? "" },
      NEW_DUE_AMT: { value: NEW_DUE_AMT ?? "" },
    };
    return { ...data, NEW_PENAL_RATE: { value: "10" } };
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveCategUpdate = async (reqObj) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVECATEGORYDTL", reqObj);
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const TDSExemptionDTL = async ({ COMP_CD, CUSTOMER_ID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCKYCTDSEXEMDTL", {
      COMP_CD,
      CUSTOMER_ID,
    });
  if (status == 0) {
    if (Boolean(Array.isArray(data))) {
      return data.map((row) => ({
        ...row,
        IsNewRow: false,
        ORIGINALACTIVE: row?.ACTIVE,
      }));
    }
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const SaveTDSExemption = async (reqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVETDSEXEMPTION", reqPara);
  if (status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
