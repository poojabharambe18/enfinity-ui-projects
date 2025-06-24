import * as API from "../../../../api";
  
  export const legal_other_address_meta_data = {
    form: {
        name: "other_address_details_form",
        label: "", 
        resetFieldOnUnmount: false,
        validationRun: "onBlur", 
        submitAction: "home",  
        render: {
            ordering: "auto",
            renderType: "simple",
            gridConfig: {
            item: {
                xs: 12,
                sm: 6,
            },
            container: {
                direction: "row",
                spacing: 3,
            },
            },
        },
        componentProps: {
            textField: {
                fullWidth: true,
            },
            select: {
                fullWidth: true,
            },
            datePicker: {
                fullWidth: true,
            },
            numberFormat: {
                fullWidth: true,
            },
            inputMask: {
                fullWidth: true,
            },
            datetimePicker: {
                fullWidth: true,
            },
        },
    },
    fields: [
        {
            render: {
                componentType: "divider",
            },
            name: "CurrentAddressDivider",
            label: "CurrentAddress",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
        },
        {
            render: {
                componentType: "select",
            },
            name: "ADDRESS_TYPE",
            label: "AddressType",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
            options: () => API.getPMISCData("ADDRESS_TYPE"),
            _optionsKey: "AddTypeOptions",
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LINE1",
            label: "Line1",
            required: true,          
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LINE2",
            label: "Line2",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LINE3",
            label: "Line3",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
            _optionsKey: "parentAreaListOp",  
            name: "AREA",
            label: "Area",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PIN",
            label: "PIN",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CITY",
            label: "City",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DISTRICT",
            label: "District",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STATE",
            label: "State",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COUNTRY",
            label: "Country",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "STATE_UT_CODE",
            label: "UnionTerritoriesCode",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ISO_COUNTRY_CODE",
            label: "CountryCode",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },



        {
            render: {
                componentType: "divider",
            },
            name: "ContactDivider",
            label: "Contact",
            GridProps: {xs:12, sm:12, md:12, lg:12, xl:12},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PHONE_o",
            label: "PhoneO",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PHONE_R",
            label: "PhoneR",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MOBILE_NO",
            label: "MobileNo",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FAX",
            label: "Fax",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMAIL_ID",
            label: "EmailId",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
    ]
  }
  
  export const legal_other_address_poa_contact_meta_data = {
    form: {
        name: "other_address_poa_contact_details_form",
        label: "", 
        resetFieldOnUnmount: false,
        validationRun: "onBlur", 
        submitAction: "home",  
        render: {
            ordering: "auto",
            renderType: "simple",
            gridConfig: {
            item: {
                xs: 12,
                sm: 6,
            },
            container: {
                direction: "row",
                spacing: 3,
            },
            },
        },
        componentProps: {
            textField: {
                fullWidth: true,
            },
            select: {
                fullWidth: true,
            },
            datePicker: {
                fullWidth: true,
            },
            numberFormat: {
                fullWidth: true,
            },
            inputMask: {
                fullWidth: true,
            },
            datetimePicker: {
                fullWidth: true,
            },
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PHONE_o",
            label: "PhoneO",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PHONE_R",
            label: "PhoneR",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MOBILE_NO",
            label: "MobileNum",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FAX",
            label: "Fax",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EMAIL_ID",
            label: "EmailiD",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
    ]
  }  