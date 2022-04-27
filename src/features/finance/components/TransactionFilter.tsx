import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { hasPermission } from "../../auth/auth-slice";
import { changeTxnFilter, fetchTransactionsAsync, fetchTransactionSummaryAsync, projectsSelector, txnFilterSelector } from "../finance-slice";
import { SapPermissions } from '../../../app/constants';
import TransactionSummary from "./TransactionSummary";
import DateSelect from "../../../components/DateSelect";
import { dateHelpers } from "../../../app/helpers";

export default function TransactionFilter() {
  const txnFilter = useAppSelector(txnFilterSelector);

  const projectsList = useAppSelector(projectsSelector);
  const hasAllProjectPermission = useAppSelector((state) => hasPermission(state, SapPermissions.projectsFullAccess))

  const projectsOptions = useMemo(() => {
    const projs = [...projectsList]
    if (hasAllProjectPermission) {
      projs.splice(0, 0, { key: "*", value: "All Projects" })
    }
    return projs;
  }, [projectsList])

  const dispatch = useAppDispatch();

  const search = () => {
    handleFileterChange('page', 1);
    dispatch(fetchTransactionsAsync({...txnFilter, page: 1}));
    dispatch(fetchTransactionSummaryAsync(txnFilter));
  }

  const handleFileterChange = (name: string, value: any) => {
    dispatch(changeTxnFilter({ [name]: value }));
  }

  return <Card className="mt-2 mb-2">
    <CardBody>
      <Row>
        <Col>
          <Label>Projects</Label>
          <MultiSelectDropdown initialValues={txnFilter.projects} options={projectsOptions} onSelect={(p) => handleFileterChange('projects', p)} />
        </Col>
        <Col sm={3}>
          <Label>From</Label>
          <DateSelect value={dateHelpers.toDate(txnFilter.fromDate)}
            onChange={(d) => handleFileterChange('fromDate', dateHelpers.toIsoString(d))} />
        </Col>
        <Col sm={3} >
          <Label>To</Label>
          <DateSelect value={dateHelpers.toDate(txnFilter.toDate)}
            onChange={(d) => handleFileterChange('toDate', dateHelpers.toIsoString(d))} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="mt-2">
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