import { MessageBoxWrapper, utilFunction } from "@acuteinfo/common-base";
import { Fragment, cloneElement, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "./authContext";
import { useIdleTimer } from "react-idle-timer";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { useMutation } from "react-query";
import { saveRecentScreenData } from "./api";
export const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    isLoggedIn,
    logout,
    authState,
    isBranchSelected,
    message,
    closeMessageBox,
  } = useContext(AuthContext);

  const isTimeoutData = useMemo(() => {
    let timeout = Number(authState?.idealTimer);
    if (isNaN(timeout) || timeout <= 0) {
      timeout = Number(process?.env?.REACT_APP_IDLE_TIMEOUT ?? 0);
    } else {
      timeout = timeout * 1000;
    }
    return timeout;
  }, []);

  const onIdle = () => {
    alert("logout");
    logout("I");
  };

  const onActive = (event) => {
    //console.log("onActive");
  };
  const onAction = (event) => {
    //console.log("onAction =>", idleTimer.isPrompted(), !idleTimer.isIdle());
    if (idleTimer.isPrompted() && !idleTimer.isIdle()) {
      idleTimer.start();
    }
  };
  const onPrompt = () => {
    showMessageForIdeal();
  };
  const idleTimer = useIdleTimer({
    timeout: isTimeoutData,
    promptTimeout: Number(authState?.idealTimer),
    // promptTimeout: 4000,
    onIdle,
    onActive,
    onAction,
    onPrompt,
    crossTab: true,
    leaderElection: true,
  });
  const showMessageForIdeal = () => {
    enqueueSnackbar(
      "Your Session is Timeout After " +
        idleTimer.getRemainingTime() / 1000 +
        " Sec.",
      {
        variant: "warning",
      }
    );
  };
  //console.log(idleTimer);

  useEffect(() => {
    if (!isLoggedIn()) {
      //console.log("isLoggedIn()=>", isLoggedIn());
      navigate("/EnfinityCore/login");
    } else if (!isBranchSelected()) {
      navigate("/EnfinityCore/branch-selection");
    }
  }, [navigate, isLoggedIn, isBranchSelected]);
  const allActiveURL = useMemo(() => {
    return utilFunction.GetAllChieldMenuData(authState.menulistdata, false);
  }, [authState.menulistdata]);
  const isValidateURL = (allActiveURL, thisURL) => {
    //console.log(thisURL, (thisURL || "").length);
    if ((thisURL || "").length < 14) {
      return true;
    }

    let urldata = thisURL.substring(14);
    let isReturn = false;
    allActiveURL.forEach((item, index) => {
      if (urldata.startsWith(item.href) && item?.allow_open === "Y") {
        //console.log(item.href, urldata, index);
        isReturn = true;
        return;
      }
    });
    return isReturn;
  };
  const saveCurrScrDt = useMutation(saveRecentScreenData, {
    onError: (error: any) => {},
    onSuccess: (response: any) => {},
  });

  const allScreenData = useMemo(() => {
    let responseData = utilFunction.GetAllChieldMenuData(
      authState?.menulistdata,
      true
    );
    return responseData;
  }, [authState.menulistdata]);

  const splitPath = location.pathname.split("/");
  const extractPath =
    splitPath.length >= 4 ? `${splitPath[2]}/${splitPath[3]}` : splitPath[2];

  useEffect(() => {
    const allScreenMatch = allScreenData.find(
      (item) => item.href === extractPath
    );
    const ScreenMatch = authState.menulistdata.find(
      (item) => item.href === extractPath
    );

    if (allScreenMatch || ScreenMatch) {
      const userCode = allScreenMatch?.user_code;
      if (userCode) {
        saveCurrScrDt.mutate({
          branchCode: authState.user.branchCode,
          flag: "I",
          docCd: userCode,
          uniqueAppId: authState.uniqueAppId,
          tranDt: authState.workingDate,
          closeTime: "",
          openTime: format(new Date(), "yyyy-MM-dd hh:mm:ss.S"),
        });
      }
      return () => {
        if (userCode) {
          saveCurrScrDt.mutate({
            branchCode: authState.user.branchCode,
            flag: "U",
            docCd: userCode,
            uniqueAppId: authState.uniqueAppId,
            tranDt: authState.workingDate,
            closeTime: format(new Date(), "yyyy-MM-dd hh:mm:ss.S"),
            openTime: "",
          });
        }
      };
    }
  }, [location.search, extractPath]);

  const isValidURL = useMemo(() => {
    if (
      window.location.pathname === "/EnfinityCore" ||
      window.location.pathname === "/EnfinityCore/dashboard" ||
      window.location.pathname === "/EnfinityCore/profile" ||
      window.location.pathname === "/EnfinityCore/view-statement" ||
      window.location.pathname === "/EnfinityCore/branch-selection" ||
      window.location.pathname === "/EnfinityCore/change-branch" ||
      window.location.pathname === "/EnfinityCore/forgot-totp" ||
      isValidateURL(allActiveURL, window.location.pathname)
    ) {
      return true;
    }
    return false;
  }, [window.location.pathname]);
  let newChildren = cloneElement(children, {
    isValidURL: isValidURL,
    idleTimer: idleTimer,
  });
  if (isLoggedIn()) {
    //cloneElement()
    return (
      <Fragment>
        {newChildren}
        {message?.isOpen ? (
          <MessageBoxWrapper
            validMessage={message?.messageTitle ?? "Information"}
            //  Message={message?.message ?? "No Message"}
            onActionYes={() => {
              closeMessageBox();
            }}
            onActionNo={() => {}}
            rows={[]}
            //buttonNames={message?.buttonNames ?? ["OK"]}
            isOpen={true}
          />
        ) : null}
      </Fragment>
    );
  }
  return null;
};
// const ProtectedRoutesDefault = ProtectedRoutes;
// export default ProtectedRoutesDefault;
