import React, { useMemo } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
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
    const income = txns
      .filter(tx => tx.category == TxnCategory.Income)
      .map(t => t.amount)
      .reduce(reducer, 0);

    return {
      expenses,
      income,
      profit: income + expenses,
    }
  }, [txns])

  return <Card>
    <CardBody className="p-1">
      <Row className="align-items-center">
        <Col>
          <Label className="text-danger">{`Expenses: ${summary.expenses}`}</Label>
        </Col>
        <Col>
          <Label className="text-success">{`Income: ${summary.income}`}</Label>
        </Col>
        <Col>
          <Label className={summary.profit > 0 ? 'text-success' : 'text-danger'}>
            {`Profit: ${summary.profit}`}
          </Label>
        </Col>
      </Row>
    </CardBody>
  </Card>
}