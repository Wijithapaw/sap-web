import { useState } from "react";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
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
    <CardBody className="pb-0">
      <Form>
        <Row>
          <Col>
            <Row>
              <Col>
                <FormGroup>
                  <ProjectsMultiSelect selectedIds={worklogFilter.projects}
                    onSelect={(p) => handleFileterChange('projects', p)} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input type="text" value={worklogFilter.searchTerm}
                    placeholder="Search Term"
                    name="searchTerm"
                    onChange={(e) => handleFileterChange(e.target.name, e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <DateSelect value={dateHelpers.toDate(worklogFilter.from)}
                    placeHolder="From"
                    onChange={(d) => handleFileterChange('from', dateHelpers.toIsoString(d))} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <DateSelect value={dateHelpers.toDate(worklogFilter.to)}
                    placeHolder="To"
                    onChange={(d) => handleFileterChange('to', dateHelpers.toIsoString(d))} />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col md={2}>
            <Row>
              <Col>
                <FormGroup>
                  <Button color="primary" className='w-100' onClick={() => setNewWorkLog(true)}>
                    New
                  </Button>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Button color="primary" className='w-100' onClick={search}>
                    Search
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Modal size="lg" centered toggle={() => setNewWorkLog(!newWorkLog)} isOpen={newWorkLog}>
        <ModalHeader toggle={() => setNewWorkLog(!newWorkLog)}>New Work Log</ModalHeader>
        <ModalBody>
          <WorkLogEntryForm onSave={(id) => dispatch(fetchNewWorkLogAsync(id))} />
        </ModalBody>
      </Modal>
    </CardBody>
  </Card>
}
