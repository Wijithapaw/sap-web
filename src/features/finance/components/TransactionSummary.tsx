import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { currencyHelpers } from "../../../app/helpers";
import { useAppSelector } from "../../../app/hooks";
import { transactionsSummarySelector } from "../finance-slice";

export default function TransactionSummary() {
  const txnSummary = useAppSelector(transactionsSummarySelector);

  return <Card>
    <CardBody className="p-1">
      <Row className="align-items-center">
        <Col>
          <Label className="text-danger">{`Expenses: ${currencyHelpers.toCurrency(txnSummary.expenses, true)}`}</Label>
        </Col>
        {
          (Math.abs(txnSummary.shareDividend) > 0) ? <>
            <Col>
              <Label className="text-success">{`Gross Inc: ${currencyHelpers.toCurrency(txnSummary.income, true)}`}</Label>
            </Col>
            <Col>
              <Label className="text-primary">{`Share Div: ${currencyHelpers.toCurrency(txnSummary.shareDividend, true)}`}</Label>
            </Col>
            <Col>
              <Label className="text-success">{`Net Inc: ${currencyHelpers.toCurrency(txnSummary.income - txnSummary.shareDividend, true)}`}</Label>
            </Col>
          </> : <Col>
            <Label className="text-success">{`Income: ${currencyHelpers.toCurrency(txnSummary.income, true)}`}</Label>
          </Col>
        }
        <Col>
          <Label className={txnSummary.profit > 0 ? 'text-success' : 'text-danger'}>
            {`Profit: ${currencyHelpers.toCurrency(txnSummary.profit)}`}
          </Label>
        </Col>
      </Row>
    </CardBody>
  </Card>
}