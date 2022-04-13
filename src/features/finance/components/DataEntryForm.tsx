import React, { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import DateSelect from '../../../components/DateSelect';
import Dropdown from '../../../components/Dropdown';
import { saveTransaction } from '../finance-api';
import { expenseTypesSelector, incomeTypesSelector, projectsSelector } from '../finance-slice';
import { TxnCategory, TransactionInput } from '../types';

export default function DataEntryForm() {
  const dispatch = useAppDispatch();

  const [category, setCategory] = useState<TxnCategory>(TxnCategory.Expense)
  const [amount, setAmount] = useState(0.00);
  const [date, setDate] = useState(new Date());
  const [description, setDesc] = useState('');
  const [typeId, setType] = useState('');
  const [projectId, setProjectId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const projectsListItems = useAppSelector(projectsSelector);
  const incomeListItems = useAppSelector(incomeTypesSelector);
  const expenseListItems = useAppSelector(expenseTypesSelector);

  const setMsg = (msg: string, func: (msg: string) => void) => {
    func(msg);
    setTimeout(() => {
      func('')
    }, 5000);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!amount || !typeId || !projectId) {
      setMsg('Please fill all the fields', setErrorMsg);
      return;
    }

    const txn: TransactionInput = {
      projectId,
      amount,
      date: date.toLocaleDateString('en-CA'),
      category,
      description,
      typeId,
      reconciled: false
    };
    
    saveTransaction(txn)
      .then((id) => {
        setMsg('Transaction saved', setSuccessMsg);
        handleReset();
      })
      .catch(() => setMsg('Error occurred', setErrorMsg))
  }

  const handleReset = () => {
    setAmount(0.00);
    setDesc('');
    setType('');
  }

  const handleTxnCategoryChange = (cat: TxnCategory) => {
    setCategory(cat);
    setType('');
  }

  return <Form onSubmit={handleSubmit} onReset={handleReset}>
    <FormGroup>
      <ButtonGroup className='w-100'>
        <Button outline={category != TxnCategory.Expense}
          color='danger'
          onClick={() => handleTxnCategoryChange(TxnCategory.Expense)}>
          Expense
        </Button>
        <Button outline={category != TxnCategory.Income}
          color='success'
          onClick={() => handleTxnCategoryChange(TxnCategory.Income)}>
          Income
        </Button>
      </ButtonGroup>
    </FormGroup>
    <Row>
      <Col md={6}>
        <FormGroup>
          <Label>
            Project
          </Label>
          <Dropdown name="projects"
            items={projectsListItems}
            selectedValue={projectId}
            onChange={(val => setProjectId(val))}
            placeholder="Select a project" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label>
            {category == TxnCategory.Expense ? 'Expense Type' : 'Income Type'}
          </Label>
          <Dropdown name="type"
            selectedValue={typeId}
            items={category == TxnCategory.Expense ? expenseListItems : incomeListItems}
            onChange={(val => setType(val))}
            placeholder="Select a type" />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col sm={6}>
        <FormGroup>
          <Label>
            Amount
          </Label>
          <Input type='number' value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </FormGroup>
      </Col>
      <Col sm={6}>
        <FormGroup>
          <Label>
            Date
          </Label>
          <DateSelect value={date} onChange={setDate} />
        </FormGroup>
      </Col>
    </Row>
    <FormGroup>
      <Label>
        Description
      </Label>
      <Input type='textarea'
        value={description}
        onChange={(e) => setDesc(e.target.value)} />
    </FormGroup>
    <Row>
      <Col md={4}>
        <FormGroup>
          <Button type='reset' className='mr-4'>Cancel</Button>{" "}
          <Button className='ml-2' type='submit' color='primary'>Save</Button>
        </FormGroup>
      </Col>
      <Col md={8}>
        <FormGroup>
          {successMsg && <Alert className='p-2' color='success'>{successMsg}</Alert>}
          {errorMsg && <Alert className='p-2' color='danger'>{errorMsg}</Alert>}
        </FormGroup>
      </Col>
    </Row>
  </Form>
}
