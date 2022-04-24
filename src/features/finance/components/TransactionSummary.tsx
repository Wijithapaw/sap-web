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
          <Label className="text-danger">{`Expenses: ${currencyHelpers.toCurrency(txnSummary.expenses)}`}</Label>
        </Col>
        {
          (txnSummary.shareDividend > 0) ? <>
            <Col>
              <Label className="text-success">{`Gross Income: ${currencyHelpers.toCurrency(txnSummary.income)}`}</Label>
            </Col>
            <Col>
              <Label className="text-primary">{`Share Dividend: ${currencyHelpers.toCurrency(txnSummary.shareDividend)}`}</Label>
            </Col>
            <Col>
              <Label className="text-success">{`Net Income: ${currencyHelpers.toCurrency(txnSummary.income - txnSummary.shareDividend)}`}</Label>
            </Col>
          </> : <Col>
            <Label className="text-success">{`Income: ${currencyHelpers.toCurrency(txnSummary.income)}`}</Label>
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