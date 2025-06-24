import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import {
  verifyDayendChecksumsMetaData,
  executeChecksumsReportMetaData,
} from "./gridMetadata";
import { useLocation, useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import {
  Chip,
  CircularProgress,
  Dialog,
  Paper,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent, usePopupContext } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import LoaderImg from "./Loader.gif";
import { GradientButton } from "@acuteinfo/common-base";
import { t } from "i18next";
import { LoadingTextAnimation } from "components/common/loader";
import {
  ClearCacheProvider,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { getdocCD } from "components/utilFunction/function";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

interface Item {
  CHKSM_TYPE?: string;
  SR_CD?: string;
  MENDETORY?: string;
  EOD_VER_ID?: string;
  CLR?: string;
  PROCESS?: any;
  ED_TIME: string;
  ST_TIME: string;
  EOD_EOS_FLG: string;
}

export const VerifyDayendChecksums = ({
  open,
  close,
  flag,
  processFlag,
  isHOLoggined,
  reqFlag,
}: {
  open: boolean;
  close: () => void;
  flag: string;
  reqFlag: string;
  processFlag: string;
  isHOLoggined: boolean;
}) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [sessionStart, setSessionStart] = useState<any>(false);
  const warningCountRef = useRef(0);
  const errCount = useRef(0);
  const [currentSRCD, setCurrentSRCD] = useState<string | any>(0);
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<Item[]>([]);
  const [reqData, setReqData] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [loopStart, setLoopStart] = useState<any>(false);
  const [branchLoppStop, setBranchloopStop] = useState<any>(false);
  const [warningsObj, setWarningsObj] = useState({});
  const warningsObjRef = useRef<any>({});
  const branchArrayLength = useRef<any>({});
  const allrecordRef = useRef<any>({});
  const npaCalckref = useRef<any>();
  const mewSessionref = useRef<any>();
  const resultRef = useRef<any>();
  warningsObjRef.current = warningsObj;
  const [switchBranchPara, setSwitchBranchPara] = useState<any>(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const currentBranch = useRef<any>(null);
  const navigate = useNavigate();
  const gridRef = useRef<any>(null);
  const { logout } = useContext(AuthContext);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [batchCount, setBatchCount] = useState<number>(0);
  const indexRef = useRef(0);

  const handleAction = useCallback(
    async (data: any) => {
      navigate(data?.name, { state: data?.rows });
    },
    [navigate, close]
  );

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    if (currentBranch.current) {
      setWarningsObj((prevWarnings) => ({
        ...prevWarnings,

        [currentBranch.current]: [
          warningCountRef.current,
          //@ts-ignore
          gridData[0]?.BRANCH_NM,
        ],
      }));
    }
  }, [warningCountRef.current]);

  useEffect(() => {
    warningsObjRef.current = warningsObj;
  }, [warningsObj]);
  const startSession = () => {
    setSessionStart(true);
    sessionDtlMutation.mutate({
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      BASE_BRANCH_CD: authState?.baseCompanyID,
      BASE_COMP_CD: authState?.user?.baseBranchCode,
      WORKING_DATE: authState?.workingDate,
    });
    setSessionStart(false);
  };
  const handleEodWarnings = async () => {
    if (flag === "D") {
      let message = "";

      for (let key in warningsObjRef.current) {
        message += `${warningsObjRef.current[key][1]} Warning= ${warningsObjRef.current[key][0]}.\n`;
      }

      if (Object.keys(warningsObjRef.current).length === 0) {
        startSession();
      } else {
        const confirmation = await MessageBox({
          messageTitle: t("eodChecksomWarningMsg"),
          message: `${message}\nAre you sure to Continue?`,
          icon: "WARNING",
          buttonNames: ["Yes", "No"],
        });

        if (confirmation === "Yes") {
          startSession();
        }
        if (confirmation === "No") {
          setLoopStart(true);
        }
      }
    }
  };
  const updateRunningMutation = useMutation(
    API.updateEodRunningStatus,

    {
      onError: (error: any) => {
        MessageBox({
          message: error?.error_msg,
          messageTitle: "Error",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
        setLoopStart(true);
        CloseMessageBox();
      },
      onSuccess: (data) => {
        setLoopStart(true);
      },
    }
  );

  const updateEodRunningStatus = async () => {
    try {
      const payload: any = {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        FLAG: "N",
      };
      updateRunningMutation.mutate(payload);
    } catch (error) {}
  };

  const processRecord = async (
    record: Item,
    index: number
  ): Promise<string> => {
    const startTime = new Date();
    setCurrentSRCD(record.SR_CD ?? null);
    indexRef.current = index;
    setGridData((prevGridData) => {
      const updatedGridData = [...prevGridData];
      updatedGridData[index] = {
        ...updatedGridData[index],
        CLR: "P",
        PROCESS: LoaderImg,
        ST_TIME: formatTime(startTime),
        ED_TIME: "",
      };
      return updatedGridData;
    });

    const response = await API.executeChecksums({
      FLAG: flag,
      SCREEN_REF: docCD,
      FOR_BRANCH: currentBranch.current,
      EOD_EOS_FLG: reqData[0]?.EOD_EOS_FLG,
      CHKSM_TYPE: record.CHKSM_TYPE,
      SR_CD: record.SR_CD,
      MENDETORY: record.MENDETORY,
      EOD_VER_ID: record.EOD_VER_ID,
    });

    const endTime = new Date();
    const elapsedTime = formatTime(endTime);

    if (response[0]?.CLR) {
      setGridData((prevGridData) => {
        const updatedGridData = [...prevGridData];
        updatedGridData[index] = {
          ...updatedGridData[index],
          CLR: response[0].CLR,
          PROCESS: "",
          ED_TIME: elapsedTime,
        };
        return updatedGridData;
      });
    }

    if (flag === "D" && response[0]?.CLR === "E" && record?.MENDETORY == "Y") {
      await MessageBox({
        messageTitle: "Error",
        message: response[0]?.MESSAGE,
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      CloseMessageBox();
      setLoopStart(true);
      setBranchloopStop(true);
      setSwitchBranchPara(false);
      return "stop";
    }

    if (flag === "C" && response[0]?.MESSAGE !== "") {
      const buttonName = await MessageBox({
        messageTitle: "Error",
        message: response[0]?.MESSAGE,
        icon: "ERROR",
        buttonNames: ["Ok"],
      });

      if (buttonName !== "Ok") {
        return "stop";
      }
    }
    if (flag === "D" && response[0]?.CLR === "W") {
      const buttonName = await MessageBox({
        messageTitle: "Error",
        message: t("dayendWarningShowMsg"),
        icon: "WARNING",
        buttonNames: ["Yes", "No"],
      });
      if (buttonName === "Yes") {
        setLoopStart(true);
        return "stop";
      }
    }
    if (response[0]?.CLR === "W") {
      warningCountRef.current += 1;
    }
    if (response[0]?.CLR === "Y" && record.MENDETORY === "Y") {
      errCount.current += 1;
    }

    if (
      (index + 1) % 11 === 0 ||
      (index + 1) % 12 === 0 ||
      (index + 1) % 13 === 0 ||
      ((index + 1) % 20 === 0 || (index + 1) % 21) === 0
    ) {
      setBatchCount((prevCount) => prevCount + 1);
    }

    return "continue";
  };

  const processRecords = async (records: Item[]) => {
    for (let i = 0; i < records.length; i++) {
      const result = await processRecord(records[i], i);

      resultRef.current = result;
      if (result === "stop") {
        updateEodRunningStatus();
        return false;
      }
    }
    return true;
  };
  const DoEodMutation = useMutation(API.doEod, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      setLoopStart(true);
    },
    onSuccess: async (data) => {
      let btn99, returnVal;
      setLoopStart(true);
      const getButtonName = async (obj) => {
        let btnName = await MessageBox(obj);
        return { btnName, obj };
      };

      for (let i = 0; i < data.length; i++) {
        if (data[i]?.O_STATUS === "999") {
          const { btnName, obj } = await getButtonName({
            messageTitle: t("ValidationFailed"),
            message: data[i]?.O_MESSAGE,
            icon: "ERROR",
          });
          returnVal = "";
        } else if (data[i]?.O_STATUS === "99") {
          const { btnName, obj } = await getButtonName({
            messageTitle: t("Confirmation"),
            message: data[i]?.O_MESSAGE,
            icon: "CONFIRM",
            buttonNames: ["Yes", "No"],
          });
          btn99 = btnName;
          if (btnName === "No") {
            returnVal = "";
          }
        } else if (data[i]?.O_STATUS === "9") {
          if (btn99 !== "No") {
            const { btnName, obj } = await getButtonName({
              messageTitle: t("Alert"),
              message: data[i]?.O_MESSAGE,
              icon: "WARNING",
            });
          }
          returnVal = "";
        } else if (data[i]?.O_STATUS === "0") {
          const { btnName, obj } = await getButtonName({
            messageTitle: data[i]?.O_MSG_TITLE,
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Ok"],
            icon: "SUCCESS",
          });
          btn99 = btnName;
          if (btnName === "Ok") {
            logout();
          }
        }
      }
    },
  });
  const sessionDtlMutation = useMutation(API.getSessionDtl, {
    onError: (error: any) => {
      setLoopStart(true);
    },
    onSuccess: async (sessionDtl) => {
      for (const response of sessionDtl[0]?.MSG ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: t("ValidationFailed"),
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: response?.O_MESSAGE ?? "",
            icon: "CONFIRM",
            buttonNames: [t("openNewSession"), t("DayEnd")],
          });
          if (buttonName === "openNewSession") {
            if (response?.O_COLUMN_NM === "AUTO_NPA") {
              npaCalckref.current = "Y";
            } else {
              npaCalckref.current = "N";
            }

            if (response?.O_COLUMN_NM === "NEW_SESSION") {
              mewSessionref.current = sessionDtl[0]?.NEW_SESSION;
            } else {
              mewSessionref.current = sessionDtl[0]?.DEFAULT_SESSION;
            }
            if (flag === "D") {
              DoEodMutation.mutate({
                FLAG: reqFlag,
                SCREEN_REF: docCD,
                NPA_CALC: npaCalckref?.current,
                NEW_SESSION: mewSessionref?.current,
              });
            }
          } else if (buttonName === "DayEnd") {
            npaCalckref.current = "N";
            if (response?.O_COLUMN_NM === "NEW_SESSION") {
              mewSessionref.current = sessionDtl[0]?.DEFAULT_SESSION;
            } else {
              mewSessionref.current = sessionDtl[0]?.NEW_SESSION;
            }
            if (flag === "D") {
              DoEodMutation.mutate({
                FLAG: reqFlag,
                SCREEN_REF: docCD,
                NPA_CALC: npaCalckref?.current,
                NEW_SESSION: mewSessionref?.current,
              });
            }
          }
        } else if (response?.O_STATUS === "0") {
          if (
            response?.O_COLUMN_NM !== "AUTO_NPA" &&
            response?.O_COLUMN_NM !== "NEW_SESSION"
          ) {
            npaCalckref.current = "N";
            mewSessionref.current = sessionDtl[0]?.DEFAULT_SESSION;
          }
          if (flag === "D") {
            DoEodMutation.mutate({
              FLAG: reqFlag,
              SCREEN_REF: docCD,
              NPA_CALC: npaCalckref?.current,
              NEW_SESSION: mewSessionref?.current,
            });
          }
        }
      }
    },
  });

  const handleMulltipleBranchEod = async (data) => {
    if (branchArrayLength.current.length > 1) {
      // Handle case where branchList length is greater than 1 (multiple branches)
      if (switchBranchPara) {
        setLoopStart(false);
        let callhandleEodWarnings = false;
        for (const branch of branchArrayLength.current) {
          if (resultRef.current === "stop") {
            return false;
          }
          const lastBranch =
            branchArrayLength.current[branchArrayLength.current.length - 1];
          currentBranch.current = branch;
          warningCountRef.current = 0;

          if (lastBranch === branch) {
            callhandleEodWarnings = true;
          }

          const processBranch = async (branch: string) => {
            await checkSumsDataMutation.mutateAsync({
              FLAG: flag,
              SCREEN_REF: docCD,
              FOR_BRANCH: branch,
              EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
            });
          };

          await processBranch(branch);
        }

        if (callhandleEodWarnings) {
          handleEodWarnings();
          callhandleEodWarnings = false;
        }
      }
    }
  };
  const checkSumsDataMutation = useMutation(API.getCheckSums, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data: Item[]) => {
      setGridData(data);
      setLoopStart(false);
      const allRecordsProcessed = await processRecords(data);
      allrecordRef.current = allRecordsProcessed;

      // if (flag === "D" && allRecordsProcessed) {
      //   handleEodWarnings();
      // }
      if (flag === "C" && allRecordsProcessed) {
        setSwitchBranchPara(true);
        setLoopStart(true);
        await MessageBox({
          messageTitle: "Success",
          message: t("eodCheckumsCompletedMsg"),
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
      }

      if (flag === "D" && allRecordsProcessed) {
        if (errCount.current === 0) {
          updateEodRunningStatus();

          const buttonNames = await MessageBox({
            messageTitle: `${t("ValidationFailed")}`,
            message:
              "At least one Mandatory CheckSum should be completed successfully.\nSorry for the inconvenience." +
              errCount.current,
            buttonNames: ["Ok"],
            icon: "ERROR",
          });

          if (buttonNames === "Ok") {
            const formData = gridRef?.current?.cleanData?.();
            if (
              indexRef.current === formData?.length - 1 &&
              branchArrayLength.current.length === 1
            ) {
              updateEodRunningStatus();
              handleEodWarnings();
            }
          }
        } else {
          updateEodRunningStatus();
          handleEodWarnings();
        }
      }
      if (branchLoppStop === false) {
        setSwitchBranchPara(true);
      } else setSwitchBranchPara(false);
    },
  });
  // useEffect(() => {
  //   if (resultRef.current === "stop") {
  //     setLoopStart(false);
  //   }
  // }, []);
  const {
    data: validatedData,
    isLoading: validateLoading,
    isError: validateError,
    error: validateErrorDetails,
    isSuccess: validateSuccess,
  } = useQuery(
    ["getValidateEod"],
    () =>
      API.getValidateEod({
        SCREEN_REF: docCD,
        FLAG: flag === "D" ? reqFlag : flag,
      }),
    {
      onSuccess: async (data: any) => {
        const responseData = Array.isArray(data) ? data[0] : {};
        const responses = Array.isArray(responseData?.V_MSG)
          ? responseData.V_MSG
          : [responseData?.V_MSG];

        for (const response of responses) {
          const status = response.O_STATUS;
          const message = response.O_MESSAGE;
          const title = response.O_MSG_TITLE;

          if (status === "999") {
            const buttonName = await MessageBox({
              messageTitle: "Error",
              message: message,
              icon: "ERROR",
              buttonNames: ["Ok"],
            });
            if (buttonName === "Ok") close();
          } else if (status === "9") {
            await MessageBox({
              messageTitle: title,
              message: message,
              icon: "WARNING",
            });
          } else if (status === "99") {
            const buttonName = await MessageBox({
              messageTitle: title,
              message: message,
              icon: "CONFIRM",
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
            });
            if (buttonName === "No") {
              CloseMessageBox();
              close();
            } else if (buttonName === "Yes") {
              const branchList = data[0]?.BRANCH_LIST;

              branchArrayLength.current = branchList;

              // Handle case where branchList length is 1
              if (branchList.length === 1) {
                const branch = branchList[0];
                currentBranch.current = branch;
                warningCountRef.current = 0;

                await checkSumsDataMutation.mutateAsync({
                  FLAG: flag,
                  SCREEN_REF: docCD,
                  FOR_BRANCH: branch,
                  EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
                });

                const formData = gridRef?.current?.cleanData?.();

                // } else if (branchList.length > 1) {
                //   // Handle case where branchList length is greater than 1 (multiple branches)
                //   if (switchBranchPara) {
                //     setLoopStart(false);
                //     let callhandleEodWarnings = false;
                //     for (const branch of branchList) {
                //       if (resultRef.current === "stop") {
                //         return false;
                //       }
                //       const lastBranch = branchList[branchList.length - 1];
                //       currentBranch.current = branch;
                //       warningCountRef.current = 0;
                //       console.log(lastBranch, "lastBranch");
                //       console.log(branch, "branch");

                //       if (lastBranch === branch) {
                //         callhandleEodWarnings = true;
                //       }

                //       const processBranch = async (branch: string) => {
                //         await checkSumsDataMutation.mutateAsync({
                //           FLAG: flag,
                //           SCREEN_REF: docCD,
                //           FOR_BRANCH: branch,
                //           EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
                //         });
                //       };

                //       await processBranch(branch);
                //     }

                //     if (callhandleEodWarnings) {
                //       handleEodWarnings();
                //       callhandleEodWarnings = false;
                //     }
                //   }
                // }
                // } else if (branchList.length > 1) {
              } else if (branchList.length > 1) {
                handleMulltipleBranchEod(data);
              }
            }
          }
        }
      },

      onError: async (error: any) => {
        await MessageBox({
          message: error?.error_msg,
          messageTitle: "Error",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
      },
    }
  );
  useEffect(() => {
    if (validatedData) {
      setReqData(validatedData);
    }
  }, [validatedData]);

  const reportMutation = useMutation(API.getDayEnderrLog, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg ?? "Error occurred",
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data: any) => {
      setRowData(data);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getValidateEod"]);
    };
  }, []);

  let label = gridData
    ? //@ts-ignore
      `${gridData[0]?.TITLE} ${gridData[0]?.EOD_VER_ID}`
    : "Day End Process";
  verifyDayendChecksumsMetaData.gridConfig.gridLabel = label;

  const updateData = (gridData: Item[] = []): Item[] => {
    return gridData.map((item, index) => ({
      ...item,
      INDEX: `${index}`,
      _rowColor:
        item?.CLR === "N"
          ? "rgb(255, 0, 0)"
          : item.CLR === "P"
          ? "rgb(40, 180, 99)"
          : item.CLR === "Y"
          ? "rgb(130, 224, 170)"
          : item.CLR === "W"
          ? "rgb(244, 208, 63)"
          : item.CLR === "E"
          ? "rgb(241, 148, 138)"
          : undefined,
    }));
  };
  let Records = gridData.length;
  console.log("flag", flag);
  console.log("loopstart", loopStart);

  return (
    <ClearCacheProvider>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xl"
        style={{ height: "auto" }}
        PaperProps={{
          style: { width: "100%", padding: "7px" },
        }}
      >
        {gridData.length > 0 ? (
          <>
            <div style={{ height: "65%" }}>
              <GridWrapper
                ref={gridRef}
                key={`verifyDayendChecksumsMetaData` + label + batchCount}
                finalMetaData={
                  verifyDayendChecksumsMetaData as GridMetaDataType
                }
                data={updateData(gridData)}
                setData={() => null}
                actions={[]}
                onClickActionEvent={(index, id, currentData) => {
                  if (id === "REPORT") {
                    setCurrentData(currentData);
                    reportMutation.mutate({
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: currentBranch.current,
                      TRAN_DT: authState?.workingDate,
                      VERSION: currentData?.EOD_VER_ID,
                      SR_CD: currentData?.SR_CD,
                    });
                    setOpenReport(true);
                  }
                }}
                setAction={handleAction}
                // onlySingleSelectionAllow={false}
                // defaultSelectedRowId={currentSRCD}
              />
            </div>
            <Paper
              style={{
                display: "flex",
                height: "20%",
                justifyContent: "space-between",
                padding: "8px 10px 10px 8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  variant="subtitle2"
                  style={{
                    whiteSpace: "nowrap",
                    paddingInline: "33px",
                  }}
                >
                  {t("TotalNoofrecords")}
                  {Records}
                </Typography>
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "1px" }}
                >
                  <Chip
                    label="Success"
                    variant="outlined"
                    color="default"
                    style={{
                      backgroundColor: "rgb(130, 224, 170)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label="In Process"
                    color="default"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgb(40, 180, 99)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label="Warning"
                    color="default"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgb(244, 208, 63)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label="Error"
                    color="default"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgb(241, 148, 138)",
                      color: "white",
                    }}
                  />
                </div>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    paddingLeft: "33px",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    width: "600px",
                  }}
                >
                  {DoEodMutation?.isLoading || sessionDtlMutation?.isLoading
                    ? ` Checksum Executed. Doing ${processFlag} `
                    : ""}
                  {sessionDtlMutation.isLoading || DoEodMutation.isLoading ? (
                    <div style={{ marginLeft: "12px" }}>
                      <LoadingTextAnimation />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div>
                {loopStart && flag === "D" ? (
                  <GradientButton
                    disabled={
                      updateRunningMutation.isLoading ||
                      DoEodMutation?.isLoading ||
                      sessionDtlMutation?.isLoading
                    }
                    onClick={async () => {
                      setGridData([]);
                      // setLoopStart(false);
                      if (branchArrayLength.current.length === 1) {
                        setLoopStart(false);
                      }
                      resultRef.current = null;
                      indexRef.current = 0;

                      await checkSumsDataMutation.mutateAsync({
                        FLAG: flag,
                        SCREEN_REF: docCD,
                        FOR_BRANCH: currentBranch.current,
                        EOD_EOS_FLG: reqData[0]?.EOD_EOS_FLG,
                      });

                      if (branchArrayLength.current.length > 1) {
                        setLoopStart(false);
                        handleMulltipleBranchEod(validatedData);
                      }
                    }}
                    color={"primary"}
                  >
                    {t("start")}
                  </GradientButton>
                ) : (
                  ""
                )}
                {loopStart && (
                  <GradientButton
                    disabled={
                      updateRunningMutation.isLoading ||
                      DoEodMutation?.isLoading ||
                      sessionDtlMutation?.isLoading
                    }
                    onClick={() => {
                      close();
                    }}
                    color={"primary"}
                  >
                    {t("Close")}
                  </GradientButton>
                )}
              </div>
            </Paper>
          </>
        ) : (
          <div style={{ width: "100%" }}>
            <LoaderPaperComponent />
          </div>
        )}

        {openReport && (
          <ViewEodReport
            open={openReport}
            close={() => setOpenReport(false)}
            metaData={executeChecksumsReportMetaData}
            reportData={rowData}
            reportLabel={`EOD Error Log : ${authState?.workingDate} and Version :${currentData?.EOD_VER_ID} ${currentData?.DESCRIPTION}`}
            loading={reportMutation.isLoading}
          />
        )}
        {/* {updateRunningMutation.isLoading ? (
          <>
            <LinearProgressBarSpacer />
          </>
        ) : (
          ""
        )} */}
      </Dialog>
    </ClearCacheProvider>
  );
};
