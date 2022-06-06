import { Col, Row } from "reactstrap";
import WorkLogsList from "./WorkLogList";
import WorkLogsFilter from "./WorkLogsFilter";

export default function WorkLogsPage() {
  return <><Row>
    <Col>
      <WorkLogsFilter />
    </Col>
  </Row>
    <Row>
      <Col>
        <WorkLogsList />
      </Col>
    </Row>
  </>
}
