import { lessThanDate } from "@acuteinfo/common-base";
import { isValid, parse } from "date-fns";
import { t } from "i18next";

const validateChequeDate = (params) => {
  const { colDef, value } = params;
  const allField = params.context?.gridContext?.dateData?.[0] || {};

  const currentDate = parse(params.value, "dd/MM/yyyy", new Date());
  const rangeDate = new Date(allField?.RANGE_FROM_DT);
  const transDate = new Date(allField?.TRAN_DATE);
  if (Boolean(params?.value) && !isValid(currentDate)) {
    return "Mustbeavaliddate";
  }
  if (!isValid(rangeDate) || !isValid(transDate)) {
    return "";
  }
  if (lessThanDate(value, allField?.authState?.minDate)) {
    return "Date is out of period. Check Global level Parameter 11.";
  }
  if (currentDate < rangeDate || currentDate > transDate) {
    return (
      t("DateShouldBetween") +
      " " +
      rangeDate.toLocaleDateString("en-IN") +
      " " +
      t("To") +
      " " +
      transDate.toLocaleDateString("en-IN")
    );
  }
};

export { validateChequeDate };
