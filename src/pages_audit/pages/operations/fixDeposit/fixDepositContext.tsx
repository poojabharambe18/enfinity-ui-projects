import { createContext, useReducer, useState } from "react";
import { FDStateType, ActionType, FDSchemeType, FDSchemeParams } from "./type";
import { FDSchemeGrid } from "./fdScheme/fdSchemeGrid";

const inititalState: FDStateType = {
  activeStep: 0,
  fdParaFormData: { FD_TYPE: "E", TRAN_MODE: "3" },
  isOpendfdAcctForm: false,
  fdAcctFormData: {},
  fdDetailFormData: {},
  sourceAcctFormData: {
    TRNDTLS: [
      {
        ACCT_NAME: "",
      },
    ],
  },
  isBackButton: false,
};

const initialFDScheme: FDSchemeType = {
  isOpen: false,
  fdTranCode: "",
  categCode: "",
};

const fdReducer = (state: FDStateType, action: ActionType): FDStateType => {
  switch (action.type) {
    case "commonType":
      return {
        ...state,
        ...action.payload,
      };
    case "activeStep":
      return {
        ...state,
        ...action.payload,
      };
    case "updateFDParaOnChange":
      return {
        ...state,
        fdParaFormData: { ...state?.fdParaFormData, ...action.payload },
      };
    case "resetAllData":
      return inititalState;
    default: {
      return state;
    }
  }
};

export const FixDepositContext = createContext<any>(inititalState);

export const FixDepositProvider = ({ children }) => {
  const [state, dispatch] = useReducer(fdReducer, inititalState);
  const [fdScheme, setFDScheme] = useState<FDSchemeType>(initialFDScheme);

  const setActiveStep = (value) => {
    dispatch({
      type: "activeStep",
      payload: {
        activeStep: value,
      },
    });
  };

  const updateFDParaFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        fdParaFormData: { ...data },
      },
    });
  };

  const updateFDParaDataOnChange = (data) => {
    dispatch({
      type: "updateFDParaOnChange",
      payload: {
        ...data,
      },
    });
  };

  const setIsOpendfdAcctForm = (value) => {
    dispatch({
      type: "commonType",
      payload: {
        isOpendfdAcctForm: value,
      },
    });
  };

  const updateFDAccountsFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        fdAcctFormData: data,
      },
    });
  };

  const updateFDDetailsFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        fdDetailFormData: data,
      },
    });
  };

  const updateTransDetailsFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        sourceAcctFormData: { TRNDTLS: data },
      },
    });
  };

  const resetAllData = (data) => {
    dispatch({
      type: "resetAllData",
      payload: {},
    });
  };

  const setIsBackButton = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        isBackButton: data,
      },
    });
  };

  const openFDScheme = ({ fdTranCode, categCode }: FDSchemeParams) => {
    return new Promise((resolve) => {
      setFDScheme({
        isOpen: true,
        fdTranCode,
        categCode,
        callBack: (data) => {
          resolve(data);
          closeFDScheme();
        },
      });
    });
  };

  const closeFDScheme = () => {
    setFDScheme(initialFDScheme);
  };

  return (
    <FixDepositContext.Provider
      value={{
        fdState: state,
        setActiveStep,
        updateFDParaFormData,
        updateFDParaDataOnChange,
        setIsOpendfdAcctForm,
        updateFDAccountsFormData,
        updateFDDetailsFormData,
        updateTransDetailsFormData,
        resetAllData,
        setIsBackButton,
        openFDScheme,
        closeFDScheme,
      }}
    >
      {children}
      {fdScheme.isOpen ? (
        <FDSchemeGrid
          isOpen={fdScheme?.isOpen}
          fdTranCode={fdScheme?.fdTranCode}
          categCode={fdScheme?.categCode}
          onClose={fdScheme?.callBack}
        />
      ) : null}
    </FixDepositContext.Provider>
  );
};
