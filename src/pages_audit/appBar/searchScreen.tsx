import { Box, Stack, Typography } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./style";
import { useTranslation } from "react-i18next";
import { utilFunction, SearchBar } from "@acuteinfo/common-base";

const getStoredScreens = (defaultData) => {
  const store = localStorage.getItem("routeHistory");
  if (store) {
    const parsedData = JSON.parse(store);
    const filteredData: any = [];
    parsedData.forEach(({ system_code, user_code }) => {
      const foundScreen = defaultData.find(
        (screen) =>
          screen.system_code === system_code || screen.user_code === user_code
      );
      if (foundScreen) {
        filteredData.push(foundScreen);
      }
    });
    return filteredData;
  }
  return defaultData.slice(0, 5);
};

const getScreenCode = (data) => {
  return data.map((path) => ({
    system_code: path.system_code,
    user_code: path.user_code,
  }));
};

const SearchScreen = () => {
  const [listOpen, setListOpen] = useState<any>(false);
  const [searchText, setSearchText] = useState<any>("");
  const [selectedItem, setSelectedItem] = useState<any>(0);
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();
  const classes = useStyles();
  const { t } = useTranslation();
  const authController = useContext(AuthContext);

  const allScreenData = useMemo(() => {
    let responseData = utilFunction.GetAllChieldMenuData(
      authController?.authState?.menulistdata,
      true
    );
    return responseData;
  }, [authController.authState.menulistdata]);
  const [screenData, setScreenData] = useState<any>([]);

  const handleLinkClick = (data) => {
    if (!data) return;
    const link = data?.navigationProps
      ? data.href + "?" + new URLSearchParams(data?.navigationProps).toString()
      : data.href;
    setListOpen(false);
    setSearchText("");
    setSelectedItem(0);
    handleStoreRecent(data);
    setScreenData(getStoredScreens(allScreenData));
    if (inputRef.current) inputRef.current?.handleBlur();
    navigate(link);
  };

  const handleKeyDown = (e) => {
    // to close list when press tab
    if (e.key === "Tab") {
      setListOpen(false);
      return;
    }
    const container = document.getElementById("list-box");
    if (e.key === "ArrowUp" && selectedItem > 0) {
      setSelectedItem((prev) => prev - 1);
      scrollSelectedItemIntoView(container, selectedItem - 1);
    } else if (e.key === "ArrowDown" && selectedItem < screenData.length - 1) {
      setSelectedItem((prev) => prev + 1);
      scrollSelectedItemIntoView(container, selectedItem + 1);
    } else if (e.key === "Enter" && selectedItem >= 0) {
      handleLinkClick(screenData[selectedItem]);
    }
  };

  const scrollSelectedItemIntoView = (container, index) => {
    const items = container.querySelectorAll(".list-links");
    if (items[index]) {
      items[index].scrollIntoView({
        block: "center",
      });
    }
  };

  const handleChange = (e) => {
    if (selectedItem >= 0) setSelectedItem(0);
    setSearchText(e.target.value);
  };

  const handleStoreRecent = (data) => {
    const storedPaths = JSON.parse(
      localStorage.getItem("routeHistory") || "[]"
    );
    const duplicate = storedPaths.filter(
      (item) => item.system_code === data.system_code
    );
    if (duplicate.length === 0) {
      const updatedPaths = [data, ...storedPaths].slice(0, 5);
      const toStore = getScreenCode(updatedPaths);
      localStorage.setItem("routeHistory", JSON.stringify(toStore));
    }
  };

  useEffect(() => {
    if (searchText === "") {
      setScreenData(getStoredScreens(allScreenData));
    } else {
      const filtredValue = allScreenData.filter(
        ({ label, user_code, allow_open }) => {
          return [label, user_code].some(
            (info) =>
              info.toLowerCase().includes(searchText.toLowerCase()) &&
              allow_open === "Y"
          );
        }
      );
      setScreenData(filtredValue);
    }
  }, [searchText]);

  useEffect(() => {
    const localStorageScreenData = JSON.parse(
      localStorage.getItem("routeHistory") as string
    );
    let filteredData: any = [];
    if (localStorageScreenData) {
      filteredData = localStorageScreenData.filter((localData) => {
        return allScreenData.some((screenData) => {
          return localData.system_code === screenData.system_code;
        });
      });
    }
    let finalFilteredData = [...filteredData];
    for (let i = filteredData.length; i < 5; i++) {
      if (allScreenData[i]) {
        finalFilteredData.push(allScreenData[i]);
      }
    }
    const storeFinalData = getScreenCode(finalFilteredData);
    localStorage.setItem("routeHistory", JSON.stringify(storeFinalData));

    const defaultInit = getStoredScreens(allScreenData);
    const initData = getScreenCode(defaultInit);
    localStorage.setItem("routeHistory", JSON.stringify(initData));

    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setListOpen(false);
        setSelectedItem(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* search bar of screens */}
      <Box ref={listRef} position="relative" className="global-screen-search">
        <SearchBar
          ref={inputRef}
          placeholder={`${t("profile.Searchin")} ${allScreenData.length} ${t(
            "profile.screens"
          )}`}
          className={`${classes.searchBar} route-search-bar`}
          onChange={handleChange}
          value={searchText}
          onFocus={() => setListOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {listOpen ? (
          <Stack id="list-box" className={classes.searchList}>
            {screenData.length > 0 ? (
              screenData.map((data, index) => (
                <button
                  key={data.user_code}
                  className={
                    selectedItem === index ? "list-links active" : "list-links"
                  }
                  onClick={() => handleLinkClick(data)}
                >
                  <Typography
                    sx={{ fontSize: ".875rem", fontWeight: 500 }}
                  >{`${data.label} - ${data.user_code}`}</Typography>
                </button>
              ))
            ) : (
              <span style={{ padding: "1rem", color: "#888" }}>
                No Screen found!
              </span>
            )}
          </Stack>
        ) : null}
      </Box>
    </>
  );
};

export default SearchScreen;
