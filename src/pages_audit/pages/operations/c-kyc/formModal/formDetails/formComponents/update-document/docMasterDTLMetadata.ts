import { MasterDetailsMetaData } from "@acuteinfo/common-base";
import * as API from "../../../../api";

export const DocMasterDTLMetadata: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "extdocumentmasterform",
      label: "KYCDocumentView",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      render: {
        ordering: "auto",
        renderType: "simple",
        gridConfig: {
          item: {
            xs: 12,
            sm: 4,
            md: 4,
          },
          container: {
            direction: "row",
            spacing: 1,
          },
        },
      },
    },
    fields: [
      {
        render: { componentType: "select" },
        name: "TEMPLATE_CD",
        label: "Document",
        options: (dependentValue?, formState?, _?, authState?) =>
          API.getCustDocumentOpDtl({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            formState,
          }),
        _optionsKey: "getKYCDocumentTypes",
        placeholder: "",
        disableCaching: true,
        // defaultOptionLabel: "Select Document",
        required: true,
        // defaultValue: "21",
        // maxLength: 300,
        // showMaxLength: false,
        GridProps: { xs: 12, md: 4, sm: 4, lg: 4, xl: 3 },
        fullWidth: true,
        // validate: "getValidateValue",
        // autoComplete: "off",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["DocumentTypeIsRequired"] }],
        },
        isReadOnly: false,
        isFieldFocused: true,
        __EDIT__: { isReadOnly: true, isFieldFocused: false },
      },
      {
        render: { componentType: "textField" },
        name: "DOC_NO",
        label: "DocumentNo",
        placeholder: "",
        required: true,
        GridProps: { xs: 12, md: 4, sm: 4 },
        autoComplete: "off",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["DocumentNoIsRequired"] }],
        },
        preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
        validate: (columnValue) => API.validateAlphaNumValue(columnValue),
        __EDIT__: { isReadOnly: false },
      },
      {
        render: { componentType: "datePicker" },
        name: "VALID_UPTO",
        label: "ValidTillDate",
        placeholder: "",
        required: true,
        GridProps: { xs: 12, md: 4, sm: 4 },
        autoComplete: "off",
        schemaValidation: {
          type: "date",
          rules: [
            { name: "required", params: ["ValidTillDateisrequired"] },
            { name: "typeError", params: ["Mustbeavaliddate"] },
            {
              name: "min",
              params: [new Date(), "PastDateNotAllowed"],
            },
          ],
        },
        __EDIT__: { isReadOnly: false },
      },
      {
        render: { componentType: "checkbox" },
        defaultValue: true,
        name: "SUBMIT",
        label: "Submit",
        GridProps: { xs: 12, md: 2, sm: 2 },
        __VIEW__: { IsReadOnly: true },
        // __EDIT__: { render: { componentType: "checkbox" } },
      },
      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
      {
        render: { componentType: "hidden" },
        name: "SR_CD",
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "DocumentFiles",
      rowIdColumn: "LINE_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      // enablePagination: true,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "LINE_CD",
        columnName: "PageNo",
        componentType: "editableNumberFormat",
        sequence: 1,
        alignment: "right",
        width: 70,
        maxWidth: 150,
        minWidth: 60,
        isAutoSequence: true,
      },
      {
        accessor: "VALID_UPTO",
        columnName: "ValidUpto",
        componentType: "editableDatePicker",
        sequence: 2,
        // alignment: "right",
        width: 180,
        maxWidth: 250,
        minWidth: 150,
        required: true,
        schemaValidation: {
          type: "date",
          rules: [
            { name: "required", params: ["ValidUptoIsRequired"] },
            { name: "typeError", params: ["Mustbeavaliddate"] },
            {
              name: "min",
              params: [new Date(), "PastDateNotAllowed"],
            },
          ],
        },
        isReadOnly: true,
      },
      // {
      //   accessor: "DB_COLUMN",
      //   columnName: "Description*",
      //   componentType: "editableSelect",
      //   sequence: 2,
      //   alignment: "left",
      //   defaultOptionLabel: "Select Description",
      //   width: 240,
      //   minWidth: 150,
      //   maxWidth: 300,
      //   options: "GetMiscValue",
      //   _optionsKey: "GetMiscValue",
      //   requestProps: "360_API",
      //   disableCachingOptions: true,
      //   validation: (value, data, prev) => {
      //     if (!Boolean(value)) {
      //       return "This field is required";
      //     }
      //     if (Array.isArray(prev)) {
      //       let lb_error = false;
      //       let ls_msg = "";
      //       prev.forEach((item, index) => {
      //         if (value === item?.DB_COLUMN) {
      //           lb_error = true;
      //           ls_msg =
      //             "Description is Already entered at Line " + (index + 1);
      //           return ls_msg;
      //         }
      //       });
      //       if (lb_error) {
      //         return ls_msg;
      //       }
      //     }
      //     return "";
      //   },
      // },
      // {
      //   accessor: "DESCRIPTION",
      //   columnName: "Description",
      //   componentType: "default",
      //   sequence: 2,
      //   alignment: "left",
      //   width: 180,
      //   minWidth: 100,
      //   maxWidth: 250,
      //   // validation: (value, data, prev) => {
      //   //   if (!Boolean(value)) {
      //   //     return "This field is required";
      //   //   }
      //   // },
      // },
      // {
      //   accessor: "ALLOW_DISALLOW",
      //   columnName: "Allow/Disallow*",
      //   componentType: "editableSelect",
      //   sequence: 2,
      //   alignment: "left",
      //   defaultOptionLabel: "Select Allow/Disallow",
      //   width: 140,
      //   minWidth: 100,
      //   maxWidth: 200,
      //   options: () => {
      //     return [
      //       { value: "Y", label: "ALLOW" },
      //       { value: "N", label: "DISALLOW" },
      //     ];
      //   },
      //   disableCachingOptions: true,
      //   validation: (value, data, prev) => {
      //     if (!Boolean(value)) {
      //       return "This field is required";
      //     }
      //   },
      // },
      // {
      //   accessor: "TEMPL_TRAN_CD",
      //   columnName: "Template",
      //   componentType: "editableSelect",
      //   sequence: 9,
      //   alignment: "center",
      //   defaultOptionLabel: "Select Template",
      //   enableDefaultOption: true,
      //   width: 250,
      //   maxWidth: 350,
      //   minWidth: 180,
      //   disableCachingOptions: true,
      //   options: "GetFromSourceTemplateList",
      //   _optionsKey: "GetFromSourceTemplateList",
      //   dependentOptionField: "DB_COLUMN",
      // },
      // {
      //   accessor: "ALLOW_FLAG",
      //   columnName: "Response Key Value",
      //   sequence: 7,
      //   componentType: "editableTextField",
      //   defaultValue: "Y",
      //   isVisible: false,
      // },
      {
        accessor: "DOC_IMAGE",
        columnName: "File",
        componentType: "default",
        sequence: 3,
        isVisible: false,
      },
      {
        accessor: "IMG_TYPE",
        columnName: "FileType",
        componentType: "default",
        sequence: 4,
        isVisible: false,
      },
      {
        columnName: "",
        componentType: "buttonRowCell",
        accessor: "VIEW_DETAIL",
        sequence: 11,
        buttonLabel: "ViewDtl",
        width: 150,
        minWidth: 130,
        maxWidth: 200,
        // isVisible: false,
        isVisibleInNew: true,
        __EDIT__: { isVisible: true },
        // __NEW__: { isVisible: true },
        // __VIEW__: { isVisible: false },
      },
      // {
      //   columnName: "Action",
      //   componentType: "deleteRowCell",
      //   accessor: "_hidden",
      //   sequence: 12,
      //   width: 100,
      //   minWidth: 80,
      //   maxWidth: 200,
      // },
    ],
  },
};
