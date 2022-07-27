import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { currencyHelpers } from "../../../app/helpers";
import { useAppSelector } from "../../../app/hooks";
import { transactionsSummarySelector } from "../finance-slice";

export default function TransactionSummary() {
  const txnSummary = useAppSelector(transactionsSummarySelector);

  return (<div className="d-inline-flex border rounded bg-light p-2">
      <Row>
        <Col xs="auto">
          <span className="text-danger">{`Ex: ${currencyHelpers.toCurrency(txnSummary.expenses, true)}`}</span>
        </Col>
        <Col xs="auto">
          <span className="text-success">{`In: ${currencyHelpers.toCurrency(txnSummary.income, true)}`}</span>
        </Col>
        {
          (Math.abs(txnSummary.shareDividend) > 0) ? <>
            <Col xs="auto">
              <span className="text-primary">{`Div: ${currencyHelpers.toCurrency(txnSummary.shareDividend, true)}`}</span>
            </Col>
          </> : null
        }
        <Col xs="auto">
          <span className={txnSummary.profit > 0 ? 'text-success' : 'text-danger'}>
            {`Pro: ${currencyHelpers.toCurrency(txnSummary.profit, true)}`}
          </span>
        </Col>
      </Row>
      </div>
  )
}