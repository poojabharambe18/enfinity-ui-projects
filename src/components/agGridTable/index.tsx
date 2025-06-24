import React, { createContext, useEffect, useState } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ClientSideRowModelModule,
  RowApiModule,
  PinnedRowModule,
  CellKeyDownEvent,
  Column,
} from "ag-grid-community";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { IconButton, Toolbar, Typography } from "@mui/material";
import "./style.css";
import useGridTable from "./useGridTable";
import { isEmpty } from "lodash";
import HeaderButtonGroup from "./widgets/HeaderButtonGroup";
import { GradientButton } from "@acuteinfo/common-base";
import RefreshIcon from "@mui/icons-material/Refresh";

// Register ag-Grid modules
ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  RowApiModule,
  PinnedRowModule,
]);
type AgGridTableWrapperProps = {
  autoSelectFirst?: boolean;
  getGridApi: any;
  components?: Record<string, any>;
  gridConfig: any;
  subLabel?: string;
  onClickOnAdd?: () => void;
  onCellValueChanged?: any;
  context?: any;
  onCellKeyDown?: any;
  defaultColDef?: any;
  stopEditingWhenCellsLoseFocus?: any;
  suppressCellSelection?: any;
  defaultView?: any;
  loading?: boolean;
  agGridProps: any;
  hideHeader?: boolean;
  updatePinnedBottomRow?: any;
  handleCustomCellKeyDown?: any;
  gridContext?: any;
  buttons?: any;
  handleAddNewRow?: () => Promise<void> | void;
  height?: any;
  isNewButtonVisible?: boolean;
  newButtonLabel?: string;
  refetchData?: () => Promise<void> | void;
};
// Define Context for Grid Data
export const GridDataContext = createContext({
  gridData: [],
  setGridData: (data: any) => {},
});

const AgGridTableWrapper: React.FC<AgGridTableWrapperProps> = React.memo(
  (props) => {
    const [gridData, setGridData] = useState<any>(
      props.agGridProps.rowData || []
    );

    const {
      tableId,
      allColumns,
      gridContext,
      onGridReady,
      onFirstDataRendered,
      onCellKeyDown,
      onAddClick,
      components,
      onCellEditingStopped,
      noDataComponent,
      i18n,
      onCellValueChanged,
    } = useGridTable({ ...props, gridData, setGridData });

    const defaultColDef = {
      ...props.agGridProps?.defaultColDef,
      flex: 1,
      suppressMovable: true,
      unSortIcon: false,
      resizable: true,
      suppressSizeToFit: true,
      onCellValueChanged,
    };

    const {
      hideHeader = false,
      agGridProps = {},
      defaultView = "new",
      gridConfig = {},
      buttons = [],
      isNewButtonVisible = true,
      newButtonLabel,
      refetchData,
    } = props;

    return (
      <GridDataContext.Provider value={{ gridData, setGridData }}>
        <div className="main-container">
          {!hideHeader && (
            <Toolbar
              style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                background: "var(--primary-bg)",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                minHeight: "48px",
                height: "48px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                style={{
                  color: "var(--white)",
                  fontWeight: "500",
                  fontSize: "1.5rem !important",
                  lineHeight: "1.6 !important",
                  letterSpacing: "0.0075em !important",
                }}
                color="inherit"
                variant={"h6"}
              >
                {gridConfig.gridLabel} {props.subLabel}
              </Typography>
              <div>
                {typeof refetchData === "function" ? (
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    //@ts-ignore
                    onClick={refetchData}
                    color="primary"
                  >
                    <RefreshIcon />
                  </IconButton>
                ) : null}
                {isNewButtonVisible && (
                  <GradientButton onClick={onAddClick}>
                    {" "}
                    {newButtonLabel ? i18n.t(newButtonLabel) : i18n.t("new")}
                  </GradientButton>
                )}
                <HeaderButtonGroup buttons={buttons} />
              </div>
            </Toolbar>
          )}
          <div
            className="ag-theme-alpine custom-grid"
            style={{
              height: props.height || "400px",
              width: "100%",
              minHeight: "20vh",
            }}
          >
            <AgGridReact
              key={tableId}
              onGridReady={onGridReady}
              {...agGridProps}
              onCellValueChanged={onCellValueChanged}
              defaultColDef={defaultColDef}
              columnDefs={allColumns}
              onFirstDataRendered={onFirstDataRendered}
              context={{ ...gridContext, gridData, setGridData }} // Pass context to Grid
              rowData={
                isEmpty(gridData) ? props.agGridProps?.rowData : gridData
              }
              rowHeight={30}
              headerHeight={35}
              onCellKeyDown={onCellKeyDown}
              suppressClickEdit={!isNewButtonVisible}
              suppressCellFocus={!isNewButtonVisible}
              suppressHeaderFocus={true}
              components={components}
              onCellEditingStopped={onCellEditingStopped}
              suppressMovableColumns={true}
              noRowsOverlayComponent={noDataComponent}
            />
          </div>
        </div>
      </GridDataContext.Provider>
    );
  }
);

export { AgGridTableWrapper };
