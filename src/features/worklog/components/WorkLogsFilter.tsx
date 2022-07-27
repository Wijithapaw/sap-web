import { useState } from "react";
import { Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DateSelect from "../../../components/DateSelect";
import ProjectsMultiSelect from "../../project/components/ProjectsMultiSelect";
import { changeWorkLogFilter, fetchNewWorkLogAsync, searchWorkLogsAsync, worklogFilterSelector } from "../worklog-slice";
import WorkLogEntryForm from "./WorkLogEntryForm";

export default function WorkLogsFilter() {
  const [newWorkLog, setNewWorkLog] = useState(false);

  const dispatch = useAppDispatch();
  const worklogFilter = useAppSelector(worklogFilterSelector);

  const handleFileterChange = (name: string, value: any) => {
    dispatch(changeWorkLogFilter({ [name]: value }));
  }

  const search = () => {
    dispatch(searchWorkLogsAsync(worklogFilter));
  }

  return <Card className="mt-2 mb-2">
    <CardBody>
      <Row>
        <Col>
          <Row>
            <Col>
              <ProjectsMultiSelect selectedIds={worklogFilter.projects}
                onSelect={(p) => handleFileterChange('projects', p)} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Input type="text" value={worklogFilter.searchTerm}
                placeholder="Search Term"
                name="searchTerm"
                onChange={(e) => handleFileterChange(e.target.name, e.target.value)} />
            </Col>
            <Col xs={3}>
              <DateSelect value={dateHelpers.toDate(worklogFilter.from)}
                placeHolder="From"
                onChange={(d) => handleFileterChange('from', dateHelpers.toIsoString(d))} />
            </Col>
            <Col xs={3}>
              <DateSelect value={dateHelpers.toDate(worklogFilter.to)}
                placeHolder="To"
                onChange={(d) => handleFileterChange('to', dateHelpers.toIsoString(d))} />
            </Col>
          </Row>
        </Col>
        <Col md={2} className="pt-1">
          <Row>
            <Col>
              <Button color="primary" className='w-100' onClick={() => setNewWorkLog(true)}>
                New
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Button color="primary" className='w-100' onClick={search}>
                Search
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal size="lg" centered toggle={() => setNewWorkLog(!newWorkLog)} isOpen={newWorkLog}>
        <ModalHeader toggle={() => setNewWorkLog(!newWorkLog)}>New Work Log</ModalHeader>
        <ModalBody>
          <WorkLogEntryForm onSave={(id) => dispatch(fetchNewWorkLogAsync(id))} />
        </ModalBody>
      </Modal>
    </CardBody>
  </Card>
}
