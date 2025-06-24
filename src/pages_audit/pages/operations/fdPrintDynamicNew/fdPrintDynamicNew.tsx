import { Fragment, useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogActions } from "@mui/material";
import { GradientButton, LoaderPaperComponent } from "@acuteinfo/common-base";
import { t } from "i18next";
import { useReactToPrint } from "react-to-print";

interface PrintingItem {
  COL_NAME: string;
  COLVALUE: string;
  X_POS: string;
  Y_POS: string;
  COL_HEIGHT: string;
  COL_WIDTH: string;
  PAGE_HEIGHT?: string;
  PAGE_WIDTH?: string;
}

const FdPrintDynamicNew = ({ handleClose, PrintingData, OpenDialog }) => {
  const printRef = useRef<any>(null);
  const [groupedData, setGroupedData] = useState<PrintingItem[][]>([]);
  useEffect(() => {
    const nameCount: Record<string, number> = {};
    const dataByName: Record<string, PrintingItem[]> = {};

    PrintingData.forEach((item) => {
      const name = item.COL_NAME;
      if (!dataByName[name]) {
        dataByName[name] = [];
      }
      dataByName[name].push(item);
    });

    const paginatedData: any = [];
    for (const [name, items] of Object.entries(dataByName)) {
      items.forEach((item) => {
        const pageIndex = nameCount[name] || 0;
        if (!paginatedData[pageIndex]) {
          paginatedData[pageIndex] = [];
        }
        paginatedData[pageIndex].push(item);
        nameCount[name] = pageIndex + 1;
      });
    }

    setGroupedData(paginatedData);
  }, [PrintingData]);

  useEffect(() => {
    const renderHTML = () => {
      if (printRef.current && groupedData.length > 0) {
        const { PAGE_HEIGHT, PAGE_WIDTH, FONT_FACE, ...rest } =
          PrintingData[0] || {};
        printRef.current.innerHTML = "";

        let currentHeight = 0;

        groupedData.forEach((currentItems, pageIndex) => {
          const pageDiv = document.createElement("div");
          pageDiv.style.width = `${PAGE_WIDTH || 9864}px`;
          pageDiv.style.height = `${PAGE_WIDTH || 9864}px`;
          pageDiv.style.position = "relative";

          currentItems.forEach((item) => {
            const textElement = document.createElement("div");
            textElement.style.position = "absolute";
            textElement.style.left = `${item.X_POS}px`;
            textElement.style.top = `${item.Y_POS}px`;
            textElement.style.fontSize = "15.5px";
            textElement.style.fontFamily = "monospace";
            // textElement.style.fontWeight = "bold";
            textElement.style.color = "black";
            textElement.style.width = `${item.COL_WIDTH}px`;
            textElement.style.height = `${item.COL_HEIGHT}px`;
            textElement.style.overflow = "hidden";
            textElement.style.whiteSpace = "nowrap";
            textElement.textContent = item.COLVALUE;

            pageDiv.appendChild(textElement);
            currentHeight += parseInt(item.COL_HEIGHT);
            if (currentHeight > PAGE_HEIGHT) {
              pageDiv.style.pageBreakBefore = "always";
              currentHeight = parseInt(item.COL_HEIGHT);
            }
          });

          printRef.current.appendChild(pageDiv);
        });
      }
    };

    renderHTML();
  }, [PrintingData, groupedData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      printRef.current.style.overflow = "visible";
      printRef.current.style.maxHeight = "none";
      return Promise.resolve();
    },
    onAfterPrint: () => {
      printRef.current.style.overflow = "scroll";
      printRef.current.style.maxHeight = "80vh";
    },
  });

  const handleCloseDialog = () => {
    handleClose();
    setGroupedData([]);
  };

  return (
    <Fragment>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            height: "auto",
            width: "auto",
          },
        }}
        maxWidth="xl"
      >
        {OpenDialog ? (
          <LoaderPaperComponent />
        ) : PrintingData && PrintingData.length > 0 ? (
          <Box
            ref={printRef}
            style={{ overflowY: "scroll", maxHeight: "80vh", padding: 16 }}
          ></Box>
        ) : (
          <Box
            style={{
              textAlign: "center",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "rgba(133, 130, 130, 0.8)",
            }}
          >
            {t("NoDataFound")}
          </Box>
        )}

        <DialogActions>
          <GradientButton
            onClick={handlePrint}
            style={{ marginLeft: "10px" }}
            disabled={OpenDialog || !(PrintingData && PrintingData.length > 0)}
          >
            {t("Print")}
          </GradientButton>
          <GradientButton onClick={handleCloseDialog}>
            {t("Close")}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default FdPrintDynamicNew;
