export interface CustomTableMetadataType {
  key: string;
  Mainlabel: string;
  fields: Field[];
}

export interface Field {
  name: string;
  label: string;
  componentType: "textField" | "numberFormat" | "amountField";
  isReadOnly: boolean;
  isCurrency?: boolean;
  align?: "left" | "right" | "center" | "inherit" | "justify";
  isExcess?: boolean;
  isTotalWord?: boolean;
  isCalculation?: boolean;
  dependentValue?: string[];
  maxLength?: number;
  onChange?: (
    currentFieldValue: any,
    rowData: any,
    dependentValues: any[],
    setDependentValue: (targetFieldName: string, value: any) => void,
    tableState?: Record<string, any>,
    updateCurrentField?: (newValue: any) => void,
    total?: any,
    remaning?: any
  ) => Promise<void>;
  validation?: (
    currentFieldValue: any,
    rowData: any,
    dependentValues: any[],
    setDependentValue: (targetFieldName: string, value: any) => void,
    tableState?: Record<string, any>,
    updateCurrentField?: (newValue: any) => void,
    total?: any,
    remaning?: any,
    WholeDatas?: any
  ) => Promise<void>;
}

export interface CashierExchangeTableProps {
  data: any[];
  metadata: CustomTableMetadataType;
  TableLabel: string;
  hideHeader?: boolean;
  ignoreMinusValue?: boolean;
  showFooter?: boolean;
  tableState?: Record<string, any>;
  onFooterUpdate?: any;
  isCalculationZero?: any;
}
