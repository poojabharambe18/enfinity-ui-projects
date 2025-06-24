import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const StaticAdminUserReports = lazy(() => import("./staticReports"));
// const TrialBalanceVerticalReport = lazy(
//   () => import("./trial-balance-vertical-report")
// );

export const Reports = () => (
  <Routes>
    {/* <Route path="trial-balance/" element={<TrialBalanceVerticalReport />} /> */}
    <Route path="*" element={<StaticAdminUserReports />} />
  </Routes>
);
