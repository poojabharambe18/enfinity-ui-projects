import {
  GridWrapper,
  Alert,
  GradientButton,
  ActionTypes,
  GridMetaDataType,
  SearchBar,
  ClearCacheProvider,
  queryClient,
  PopupMessageAPIWrapper,
} from "@acuteinfo/common-base";
import { AllScreensGridMetaData, FavScreensGridMetaData } from "./gridMetadata";

import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as API from "./api";
import { enqueueSnackbar } from "notistack";
import { LetterSearch } from "./alphaSearch";
import { ReportConfiguration } from "./reportConfiguration";

const useHeaderStyles = makeStyles((theme: Theme) => ({
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
    textTransform: "capitalize",
  },
}));

const actions: ActionTypes[] = [
  {
    actionName: "click to open",
    actionLabel: "click to open",
    multiple: false,
    rowDoubleClick: true,
    onEnterSubmit: true,
  },
];

const QuickAccessTable = () => {
  const [apiData, setApiData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState("ALL_SCREENS");
  const rowDataRef = useRef<any>(undefined);
  const dialogTitle = useRef("Add to Favourite(s) ?");
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [openReportConfig, setOpenReportConfig] = useState(false);
  const [rowData, setRowData] = useState<any>({});

  const headerClasses = useHeaderStyles();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();
  const [queryData, setQueryData] = useState();
  const matches = useMediaQuery(theme.breakpoints.up(1256));
  const navigate = useNavigate();

  const { data, isLoading, isFetching, refetch, isError, error } = useQuery<
    any,
    any
  >(
    [
      "QuickAccessTableGridData",
      {
        COMP_CD: authState?.companyID ?? "",
        BASE_BRANCH_CD: authState?.user?.branchCode ?? "",
        GROUP_NAME: authState?.roleName ?? "",
        FLAG: activeButton ?? "",
      },
    ],
    () =>
      API.QuickAccessTableGridData({
        COMP_CD: authState?.companyID ?? "",
        workingDate: authState.workingDate,
        BASE_BRANCH_CD: authState?.user?.branchCode ?? "",
        GROUP_NAME: authState?.roleName ?? "",
        APP_TRAN_CD: 51,
        FLAG: activeButton ?? "",
      }),
    { cacheTime: 0 }
  );

  const addFavMutation = useMutation(API.addToFavorite, {
    onSuccess: (data) => {
      setIsOpenSave(false);
      refetch();
      enqueueSnackbar(data ?? "Success.", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      setIsOpenSave(false);
      enqueueSnackbar(error?.error_msg ?? "Something went wrong...", {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["QuickAccessTableGridData"]);
    };
  }, []);

  const setCurrentAction = useCallback(
    (data) => {
      let path = data?.rows?.[0]?.data?.HREF;
      if (Boolean(path)) {
        navigate("../" + path);
      }
    },
    [navigate]
  );

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  useEffect(() => {
    setApiData(data);
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setApiData(filteredData);
    } else {
      const filteredValue = filteredData.filter(
        ({ DOC_NM, USER_DEFINE_CD, DOC_CD }) =>
          [DOC_NM, USER_DEFINE_CD, DOC_CD].some((info) =>
            info.toLowerCase().includes(e.target.value.toLowerCase())
          )
      );
      setApiData(filteredValue);
    }
  };

  const actionButtons = [
    {
      onClickValue: "RECENT",
      label: "Recents",
      color: "var(--theme-color4)",
      styles: {
        border: "1px solid var(--theme-color4)",
        background: activeButton === "RECENT" ? "" : "transparent",
        height: "26px",
        width: "71px",
        borderRadius: "08px",
      },
    },
    {
      onClickValue: "FAVOURITES",
      label: "Favourites",
      color: "var(--theme-color4)",
      styles: {
        border: "1px solid var(--theme-color4)",
        background: activeButton === "FAVOURITES" ? "" : "transparent",
        height: "26px",
        width: "71px",
        borderRadius: "08px",
      },
    },
    {
      onClickValue: "ALL_SCREENS",
      label: "All Screens",
      color: "var(--theme-color4)",
      styles: {
        border: "1px solid var(--theme-color4)",
        background: activeButton === "ALL_SCREENS" ? "" : "transparent",
        height: "26px",
        width: "91px",
        borderRadius: "08px",
      },
    },
  ];

  const onPopupYes = (rowData) => {
    addFavMutation.mutate({
      BRANCH_CD: authState.user.branchCode,
      DOC_CD: rowData?.DOC_CD,
      FAVOURITE: rowData?.FAVOURITE ? "N" : "Y",
    });
  };

  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "3px 10px",
          justifyContent: "space-between",
          background: "var(--theme-color5)",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        <Typography
          className={headerClasses.title}
          color="secondary"
          variant={"h6"}
          component="div"
        >
          {t("All Screens")}
        </Typography>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {matches && (
            <SearchBar onChange={handleSearch} placeholder={"Search..."} />
          )}
          <div style={{ display: "flex", gap: 5 }}>
            {actionButtons.map((button) => (
              <GradientButton
                key={button.onClickValue}
                onClick={() => handleButtonClick(button.onClickValue)}
                textColor={button.color}
                style={button.styles}
                disabled={isLoading || isFetching}
              >
                {t(button.label)}
              </GradientButton>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "3px 10px",
          background: "var(--theme-color4)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <LetterSearch
          dataList={isLoading || isFetching ? [] : data}
          setScreens={setApiData}
        />

        <GridWrapper
          key={`quickAccessGrid-${activeButton}`}
          finalMetaData={
            activeButton === "FAVOURITES"
              ? FavScreensGridMetaData
              : (AllScreensGridMetaData as GridMetaDataType)
          }
          data={apiData ?? []}
          setData={setApiData}
          actions={actions}
          setAction={setCurrentAction}
          controlsAtBottom={false}
          headerToolbarStyle={{
            backgroundColor: "inherit",
            color: "black",
          }}
          loading={isLoading || isFetching}
          refetchData={() => refetch()}
          onClickActionEvent={(...args) => {
            if (args?.[1] === "OPEN") {
              setRowData({ ...args?.[2] });
              setOpenReportConfig(true);
            } else {
              rowDataRef.current = args?.[2] ?? {};
              if (rowDataRef.current?.FAVOURITE) {
                dialogTitle.current = "Remove from Favourite(s) ?";
              } else {
                dialogTitle.current = "Add to Favourite(s) ?";
              }
              setIsOpenSave(true);
            }
          }}
        />
      </div>
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          key={"add-fav"}
          MessageTitle={"Confirmation"}
          Message={dialogTitle.current}
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={onActionCancel}
          loading={addFavMutation.isLoading}
          rows={rowDataRef.current}
          open={isOpenSave}
        />
      ) : null}
      {openReportConfig ? (
        <ReportConfiguration
          OpenDialogue={openReportConfig}
          closeDialogue={() => {
            setOpenReportConfig(false);
            queryClient.removeQueries(["getrReportSqlQuery"]);
          }}
          rowData={rowData ? rowData : {}}
        />
      ) : (
        ""
      )}
    </>
  );
};

export const AllScreensGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <QuickAccessTable />
    </ClearCacheProvider>
  );
};
