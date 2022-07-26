import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeTxnFilter, fetchTransactionsAsync, fetchTransactionSummaryAsync, txnFilterSelector } from "../finance-slice";
import TransactionSummary from "./TransactionSummary";
import DateSelect from "../../../components/DateSelect";
import { dateHelpers } from "../../../app/helpers";
import { isMobileSelector } from "../../../app/core-slice";
import ProjectsMultiSelect from "../../project/components/ProjectsMultiSelect";
import TxnCategorySplitButton from "./TxnCategorySplitButton";

export default function TransactionFilter() {
  const txnFilter = useAppSelector(txnFilterSelector);
  const isMobile = useAppSelector(isMobileSelector);

  const dispatch = useAppDispatch();

  const search = () => {
    handleFileterChange('page', 1);
    dispatch(fetchTransactionsAsync({ ...txnFilter, page: 1 }));
    dispatch(fetchTransactionSummaryAsync(txnFilter));
  }

  const handleFileterChange = (name: string, value: any) => {
    dispatch(changeTxnFilter({ [name]: value }));
  }

  return <Card className="mt-2 mb-2">
    <CardBody>
      <Row>
        <Col>
          <ProjectsMultiSelect selectedIds={txnFilter.projects}
            onSelect={(p) => handleFileterChange('projects', p)} />
        </Col>
        <Col md={2}>
          <DateSelect value={dateHelpers.toDate(txnFilter.fromDate)} placeHolder="From" isClearable
            onChange={(d) => handleFileterChange('fromDate', dateHelpers.toIsoString(d))} />
        </Col>
        <Col md={2} >
          <DateSelect value={dateHelpers.toDate(txnFilter.toDate)} placeHolder="To" isClearable
            onChange={(d) => handleFileterChange('toDate', dateHelpers.toIsoString(d))} />
        </Col>
      </Row>
      <Row>
        <Col md={2} className="mt-2">
          <TxnCategorySplitButton value={txnFilter.category}
            onChange={(value) => handleFileterChange("category", value)} />
        </Col>
        <Col className="mt-2">
          <TransactionSummary />
        </Col>
        <Col md="auto" className="text-end mt-2">
          <Button color="primary" className={`${isMobile ? 'w-100' : ''}`} onClick={search}>
            Search
          </Button>
        </Col>
      </Row>
    </CardBody>
  </Card>
}