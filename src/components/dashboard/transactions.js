import { Bar } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  useTheme,
  Tooltip,
} from "@mui/material";
import { Chart, CategoryScale, registerables } from "chart.js";
import { useMutation } from "react-query";
import * as API from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectWithoutOptions } from "@acuteinfo/common-base";
import { useEffect, useMemo, useState } from "react";
import { GradientButton } from "@acuteinfo/common-base";
import { useTranslation } from "react-i18next";
Chart.register(CategoryScale);
Chart.register(...registerables);
const getTransactionChartDataFnWrapper =
  (getTransactionChartData) =>
  async ({ type }) => {
    return getTransactionChartData(type);
  };
export const Transactions = ({ mutation, ...props }) => {
  const theme = useTheme();
  const [showMore, setShowMore] = useState(false);
  const [optionValue, setOptionValue] = useState("T");
  const { t } = useTranslation();

  const showErrorData = () => {
    setShowMore(true);
  };
  const data = useMemo(() => {
    if (!optionValue || !mutation?.data) {
      return { datasets: [], labels: [] };
    }

    if (optionValue === "T") {
      let displayConfirmData = [];
      let displayRejectData = [];
      let displayPendingData = [];
      let displayLable = [];
      let retData = { CONFIRM: {}, REJECT: {}, PENDING: {} };
      let uniqueType = new Set();
      mutation?.data?.forEach((item) => {
        if (item?.CONFIRM === "Y") {
          retData.CONFIRM[item?.TYPE_CD] =
            (retData.CONFIRM[item?.TYPE_CD] ?? 0) + 1;
        } else if (item?.REJECT === "N") {
          retData.REJECT[item?.TYPE_CD] =
            (retData.REJECT[item?.TYPE_CD] ?? 0) + 1;
        } else {
          retData.PENDING[item?.TYPE_CD] =
            (retData.PENDING[item?.TYPE_CD] ?? 0) + 1;
        }
        uniqueType.add(item?.TYPE_CD);
      });
      //console.log(Array.from(uniqueType), retData);
      Array.from(uniqueType)
        .sort()
        .forEach((item) => {
          displayLable.push(item);
          displayConfirmData.push(retData.CONFIRM[item] ?? 0);
          displayRejectData.push(retData.REJECT[item] ?? 0);
          displayPendingData.push(retData.PENDING[item] ?? 0);
        });
      // Object.keys(retData)
      //   .sort()
      //   .forEach((item) => {
      //     displayData.push(retData[item]);
      //     displayLable.push(item);
      //   });
      return {
        datasets: [
          {
            backgroundColor: "#4263c7",
            barPercentage: 1,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 1,
            data: displayConfirmData,
            label: t("Confirmed"),
            maxBarThickness: 10,
          },
          {
            backgroundColor: "#FB8C00",
            barPercentage: 1,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 1,
            data: displayPendingData,
            label: t("Pending"),
            maxBarThickness: 10,
          },
          {
            backgroundColor: "red",
            barPercentage: 1,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 1,
            data: displayRejectData,
            label: t("Reject"),
            maxBarThickness: 10,
          },
        ],
        labels: displayLable,
      };
    } else if (optionValue === "U") {
      let displayCheckerData = [];
      let displayMakerData = [];
      let displayLable = [];
      let retData = { CHECKER: {}, MAKER: {} };
      let uniqueType = new Set();
      mutation?.data?.forEach((item) => {
        if (item?.CHECKER) {
          retData.CHECKER[item?.CHECKER] =
            (retData.CHECKER[item?.CHECKER] ?? 0) + 1;
        }
        if (item?.MAKER) {
          retData.MAKER[item?.MAKER] = (retData.MAKER[item?.MAKER] ?? 0) + 1;
        }
        uniqueType.add(item?.MAKER);
        uniqueType.add(item?.CHECKER);
      });

      Array.from(uniqueType)
        .sort()
        .forEach((item) => {
          displayLable.push(item);
          displayCheckerData.push(retData.CHECKER[item] ?? 0);
          displayMakerData.push(retData.MAKER[item] ?? 0);
        });

      return {
        datasets: [
          {
            backgroundColor: "#4263c7",
            barPercentage: 1,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 1,
            data: displayCheckerData,
            label: t("Checker"),
            maxBarThickness: 10,
          },
          {
            backgroundColor: "#FB8C00",
            barPercentage: 1,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 1,
            data: displayMakerData,
            label: t("Maker"),
            maxBarThickness: 10,
          },
        ],
        labels: displayLable,
      };
    } else if (optionValue === "S") {
      let displayConfirmData = [];
      let displayRejectData = [];
      let displayPendingData = [];
      let displayLable = [];
      let retData = { CONFIRM: {}, REJECT: {}, PENDING: {} };
      let uniqueType = new Set();
      mutation?.data?.forEach((item) => {
        if (item?.CONFIRM === "Y") {
          if (retData.CONFIRM[item]) {
            retData.CONFIRM[item] += 1;
          } else {
            retData.CONFIRM[item] = 1;
          }
        } else if (item?.CONFIRM === "N") {
          if (retData.REJECT[item]) {
            retData.REJECT[item] += 1;
          } else {
            retData.REJECT[item] = 1;
          }
        } else {
          if (retData.PENDING[item]) {
            retData.PENDING[item] += 1;
          } else {
            retData.PENDING[item] = 1;
          }
        }
        uniqueType.add(item?.CONFIRM);
        uniqueType.add(item?.REJECT);
        uniqueType.add(item?.PENDING);
      });

      Array.from(uniqueType)
        .sort()
        .forEach((item) => {
          displayLable.push(item);
          displayConfirmData.push(retData.CONFIRM[item] ?? 0);
          displayRejectData.push(retData.REJECT[item] ?? 0);
          displayPendingData.push(retData.PENDING[item] ?? 0);
        });

      return {
        datasets: [
          {
            backgroundColor: "#4263c7",
            barPercentage: 1,
            barThickness: 12,
            borderRadius: 4,
            categoryPercentage: 1,
            data: [
              Object.values(retData.CONFIRM).reduce((a, b) => a + b, 0),
              Object.values(retData.REJECT).reduce((a, b) => a + b, 0),
              Object.values(retData.PENDING).reduce((a, b) => a + b, 0),
            ],
            label: t("Transaction"),
            maxBarThickness: 10,
          },
        ],
        labels: [
          "CONFIRM (" +
            Object.values(retData.CONFIRM).reduce((a, b) => a + b, 0) +
            ")",
          "REJECT (" +
            Object.values(retData.REJECT).reduce((a, b) => a + b, 0) +
            ")",
          "PENDING (" +
            Object.values(retData.PENDING).reduce((a, b) => a + b, 0) +
            ")",
        ],
      };
    }
  }, [mutation?.data, optionValue, t]);
  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card
      {...props}
      style={{ borderRadius: "20px" }}
      className="transaction-graph-card"
    >
      <CardHeader
        action={
          <div style={{ width: "200px" }}>
            {/* <MySelectField
              key={"columnName"}
              columnName={"columnName"}
              value="D"
              options={[{ label: "Today", value: "D" }]}
              loadingOptions={false}
              showCheckbox={false}
            /> */}
            <SelectWithoutOptions
              value={optionValue}
              error={""}
              touched={false}
              size="small"
              variant="outlined"
              handleChange={(e) => {
                setOptionValue(e.target.value);
                // if (Boolean(e.target.value)) {
                //   mutation(e.target.value);
                // }

                //setCellValue({ [columnName]: e.target.value, ...clearFields });
              }}
              handleBlur={() => {
                //setCellTouched({ [columnName]: true })
              }}
              options={[
                { label: t("TransactionType"), value: "T" },
                { label: t("TransactionStatus"), value: "S" },
                { label: t("User"), value: "U" },
              ]}
              loadingOptions={false}
              multiple={false}
              showCheckbox={false}
              fullWidth
              disabled={mutation.isLoading || mutation.isFetching}
            />
          </div>
        }
        title={t("TodaysTransaction")}
        style={{ color: "var(--theme-color3)" }}
      />
      <Divider />
      <CardContent style={{ padding: "10px", height: "61vh" }}>
        <Box
          sx={{
            height: "98%",
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          height: "32px",
          pt: 1,
          marginRight: "10px",
        }}
      >
        {/* <Button
          color="secondary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button> */}
        {mutation.isError || mutation.isLoading || mutation.isFetching ? (
          <>
            {mutation.isError ? (
              <>
                <Tooltip title={"Error"}>
                  <span>
                    <FontAwesomeIcon
                      icon={["fas", "circle-exclamation"]}
                      color={"red"}
                      style={{ cursor: "pointer" }}
                      onClick={showErrorData}
                    />
                  </span>
                </Tooltip>
                {/* <Tooltip title={"Refetch"}>
                  <span>
                    <FontAwesomeIcon
                      icon={["fas", "rotate-right"]}
                      color={"var(--theme-color1)"}
                      style={{ cursor: "pointer", marginLeft: "3px" }}
                      onClick={() => {
                        result.mutate({ type: optionValue });
                      }}
                    />
                  </span>
                </Tooltip> */}
              </>
            ) : (
              <>
                <Tooltip title={"Feching..."} style={{ paddingRight: "10px" }}>
                  <span>
                    <FontAwesomeIcon
                      icon={["fas", "spinner"]}
                      className={"rotating"}
                    />
                  </span>
                </Tooltip>
              </>
            )}
          </>
        ) : (
          <>
            {/* <Tooltip title={"Refresh"}>
              <span>
                <FontAwesomeIcon
                  icon={["fas", "rotate-right"]}
                  color={"var(--theme-color1)"}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    result.mutate({ type: optionValue });
                  }}
                />
              </span>
            </Tooltip> */}
          </>
        )}
      </Box>
      {mutation.isError ? (
        <Dialog
          open={showMore}
          fullWidth={false}
          onKeyUp={(event) => {
            if (event.key === "Escape") {
              setShowMore(false);
            }
          }}
        >
          <DialogTitle>Error Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {mutation.error?.error_msg ?? "Error"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <GradientButton onClick={() => setShowMore(false)}>
              OK
            </GradientButton>
          </DialogActions>
        </Dialog>
      ) : null}
    </Card>
  );
};
