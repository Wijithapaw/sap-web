import { Button, Card, CardBody, Col, Form, FormGroup, Input, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeTxnFilter, fetchTransactionsAsync, fetchTransactionSummaryAsync, txnFilterSelector } from "../finance-slice";
import TransactionSummary from "./TransactionSummary";
import DateSelect from "../../../components/DateSelect";
import { dateHelpers } from "../../../app/helpers";
import { isMobileSelector } from "../../../app/core-slice";
import ProjectsMultiSelect from "../../project/components/ProjectsMultiSelect";
import TxnCategorySplitButton from "./TxnCategorySplitButton";
import TxnReconciledSplitButton from "./TxnReconciledSplitButton";

export default function TransactionFilter() {
  const txnFilter = useAppSelector(txnFilterSelector);
  const isMobile = useAppSelector(isMobileSelector);

  const dispatch = useAppDispatch();

  const search = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleFileterChange('page', 1);
    dispatch(fetchTransactionsAsync({ ...txnFilter, page: 1 }));
    dispatch(fetchTransactionSummaryAsync(txnFilter));
  }

  const handleFileterChange = (name: string, value: any) => {
    dispatch(changeTxnFilter({ [name]: value }));
  }

  return <Card className="mt-2 mb-2">
    <CardBody className="pb-0">
      <Form onSubmit={search}>
        <Row>
          <Col>
            <FormGroup>
              <ProjectsMultiSelect selectedIds={txnFilter.projects}
                onSelect={(p) => handleFileterChange('projects', p)} />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <DateSelect value={dateHelpers.toDate(txnFilter.fromDate)} placeHolder="From" isClearable
                onChange={(d) => handleFileterChange('fromDate', dateHelpers.toIsoString(d))} />
            </FormGroup>
          </Col>
          <Col md={2} >
            <FormGroup>
              <DateSelect value={dateHelpers.toDate(txnFilter.toDate)} placeHolder="To" isClearable
                onChange={(d) => handleFileterChange('toDate', dateHelpers.toIsoString(d))} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Input placeholder="Search Term" value={txnFilter.searchTerm || ''}
                onChange={(e) => handleFileterChange('searchTerm', e.target.value)} />
            </FormGroup>
          </Col>
          <Col md="auto">
            <FormGroup>
              <TxnCategorySplitButton value={txnFilter.category}
                onChange={(value) => handleFileterChange("category", value)} />
            </FormGroup>
          </Col>
          <Col md="auto">
            <FormGroup>
              <TxnReconciledSplitButton value={txnFilter.reconciled}
                onChange={(value) => handleFileterChange("reconciled", value)} />
            </FormGroup>
          </Col>
          <Col md="auto">
            <FormGroup>
              <TransactionSummary />
            </FormGroup>
          </Col>
          <Col md="auto" className="text-end">
            <FormGroup>
              <Button color="primary" className='w-100' type="submit">
                Search
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </CardBody>
  </Card>
}