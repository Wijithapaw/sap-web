import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DateSelect from "../../../components/DateSelect";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import { hasPermission } from "../../auth/auth-slice";
import { fetchTransactionsAsync, projectsSelector } from "../finance-slice";
import { TransactionFilter } from "../types";
import { Permissions } from '../../../app/constants';

function dateMonthsAgo(months: number) {
  var d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

export default function ReportsFilter() {
  const [projects, setProjects] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState(dateMonthsAgo(3));
  const [toDate, setToDate] = useState(new Date());

  const projectsList = useAppSelector(projectsSelector);
  const hasAllProjectPermission = useAppSelector((state) => hasPermission(state, Permissions.projectsFullAccess))

  const projectsOptions = useMemo(() => {
    const projs = [...projectsList]
    if (hasAllProjectPermission) {
      projs.splice(0, 0, { key: "*", value: "All Projects" })
    }
    console.log('projects list build');   
    return projs;
  }, [])

  const dispatch = useAppDispatch();

  const search = () => {
    const filter: TransactionFilter = {
      projects,
      fromDate: fromDate.toLocaleDateString('en-CA'),
      toDate: toDate.toLocaleDateString('en-CA'),
    };
    dispatch(fetchTransactionsAsync(filter));
  }

  return <Card className="mt-2 mb-2">
    <CardBody>
      <Row>
        <Col>
          <Label>Projects</Label>
          <MultiSelectDropdown options={projectsOptions} onSelect={setProjects} />
        </Col>
        <Col sm={3}>
          <Label>From</Label>
          <DateSelect value={fromDate} onChange={setFromDate} />
        </Col>
        <Col sm={3}>
          <Label>To</Label>
          <DateSelect value={toDate} onChange={setToDate} />
        </Col>
      </Row>
      <Row>
        <Col className="text-end mt-2">
          <Button color="primary" onClick={search}>
            Search
          </Button>
        </Col>
      </Row>
    </CardBody>
  </Card>
}