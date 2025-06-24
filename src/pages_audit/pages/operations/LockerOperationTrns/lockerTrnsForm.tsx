import {
  ClearCacheProvider,
  extractMetaData,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { lockerTrnsViewFormMetadata } from "./formMetaData";

const LockerTrnsForm = ({ data }) => {
  const [formMode, setFormMode] = useState("add");

  return (
    <Fragment>
      <FormWrapper
        key={"lockerTrnsViewForm" + data}
        metaData={
          extractMetaData(lockerTrnsViewFormMetadata, formMode) as MetaDataType
        }
        initialValues={data ? data[0] : {}}
        hideHeader={true}
        displayMode={formMode}
        onSubmitHandler={() => {}}
        formStyle={{
          background: "white",
          height: "60%",
        }}
      ></FormWrapper>
    </Fragment>
  );
};
export const LockerTrnsFormView = ({ data }) => {
  return (
    <Fragment>
      <ClearCacheProvider>
        <LockerTrnsForm data={data} />
      </ClearCacheProvider>
    </Fragment>
  );
};
