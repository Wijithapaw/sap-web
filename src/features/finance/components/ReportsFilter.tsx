import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { hasPermission } from "../../auth/auth-slice";
import { fetchTransactionsAsync, projectsSelector, setTxnFilterFromDate, setTxnFilterProjects, setTxnFilterToDate, txnFilterSelector } from "../finance-slice";
import { Permissions } from '../../../app/constants';
import DateSelect2 from "../../../components/DateSelect2";
import TransactionSummary from "./TransactionSummary";

export default function ReportsFilter() {
  const txnFilter = useAppSelector(txnFilterSelector);

  const projectsList = useAppSelector(projectsSelector);
  const hasAllProjectPermission = useAppSelector((state) => hasPermission(state, Permissions.projectsFullAccess))

  const projectsOptions = useMemo(() => {
    const projs = [...projectsList]
    if (hasAllProjectPermission) {
      projs.splice(0, 0, { key: "*", value: "All Projects" })
    }
    return projs;
  }, [projectsList])

  const dispatch = useAppDispatch();

  const search = () => {
    dispatch(fetchTransactionsAsync(txnFilter));
  }

  return <Card className="mt-2 mb-2">
    <CardBody>
      <Row>
        <Col>
          <Label>Projects</Label>
          <MultiSelectDropdown initialValues={txnFilter.projects} options={projectsOptions} onSelect={(p) => dispatch(setTxnFilterProjects(p))} />
        </Col>
        <Col sm={3}>
          <Label>From</Label>
          <DateSelect2 value={txnFilter.fromDate} onChange={(d) => dispatch(setTxnFilterFromDate(d))} />
        </Col>
        <Col sm={3}>
          <Label>To</Label>
          <DateSelect2 value={txnFilter.toDate} onChange={(d) => dispatch(setTxnFilterToDate(d))} />
        </Col>
      </Row>
      <Row>
        <Col xs={10} className="mt-2">
          <TransactionSummary />
        </Col>
        <Col className="text-end mt-2">
          <Button color="primary" onClick={search}>
            Search
          </Button>
        </Col>
      </Row>
    </CardBody>
  </Card>
}