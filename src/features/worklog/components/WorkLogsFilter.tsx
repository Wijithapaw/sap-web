import { Button, Card, CardBody, Col, Input, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DateSelect from "../../../components/DateSelect";
import ProjectsMultiSelect from "../../project/components/ProjectsMultiSelect";
import { changeWorkLogFilter, searchWorkLogsAsync, worklogFilterSelector } from "../worklog-slice";

export default function WorkLogsFilter() {
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
              <ProjectsMultiSelect initialValues={worklogFilter.projects}
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
        <Col xs={2}>
          <Row>
            <Col>
              <Button color="primary" className='w-100'>
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
    </CardBody>
  </Card>
}
