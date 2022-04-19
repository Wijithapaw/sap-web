import React, { useMemo } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { currencyHelpers } from "../../../app/helpers";
import { useAppSelector } from "../../../app/hooks";
import { transactionsSelector } from "../finance-slice";
import { TxnCategory } from "../types";

const reducer = (accumulator: number, curr: number) => accumulator + curr;

export default function TransactionSummary() {
  const txns = useAppSelector(transactionsSelector);

  const summary = useMemo(() => {
    const expenses = txns
      .filter(tx => tx.category == TxnCategory.Expense)
      .map(t => t.amount)
      .reduce(reducer, 0);

    const shareDividend = txns
      .filter(tx => tx.category === TxnCategory.Expense && tx.typeCode === 'SHARE_DIVIDEND')
      .map(t => t.amount)
      .reduce(reducer, 0);

    const income = txns
      .filter(tx => tx.category == TxnCategory.Income)
      .map(t => t.amount)
      .reduce(reducer, 0);

    return {
      expenses: expenses - shareDividend,
      shareDividend: Math.abs(shareDividend),
      income,
      profit: income + expenses,
    }
  }, [txns])

  return <Card>
    <CardBody className="p-1">
      <Row className="align-items-center">
        <Col>
          <Label className="text-danger">{`Expenses: ${currencyHelpers.toCurrency(summary.expenses)}`}</Label>
        </Col>
        {
          (summary.shareDividend > 0) ? <>
            <Col>
              <Label className="text-success">{`Gross Income: ${currencyHelpers.toCurrency(summary.income)}`}</Label>
            </Col>
            <Col>
              <Label className="text-primary">{`Share Dividend: ${currencyHelpers.toCurrency(summary.shareDividend)}`}</Label>
            </Col>
            <Col>
              <Label className="text-success">{`Net Income: ${currencyHelpers.toCurrency(summary.income - summary.shareDividend)}`}</Label>
            </Col>
          </> : <Col>
            <Label className="text-success">{`Income: ${currencyHelpers.toCurrency(summary.income)}`}</Label>
          </Col>
        }
        <Col>
          <Label className={summary.profit > 0 ? 'text-success' : 'text-danger'}>
            {`Profit: ${currencyHelpers.toCurrency(summary.profit)}`}
          </Label>
        </Col>
      </Row>
    </CardBody>
  </Card>
}