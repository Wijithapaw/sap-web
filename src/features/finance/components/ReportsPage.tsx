import React from "react";
import ReportsFilter from "./ReportsFilter";
import TransacationList from "./TransactionsList";

export default function ReportsPage() {
  return <div><ReportsFilter />
    <TransacationList />
  </div>
}