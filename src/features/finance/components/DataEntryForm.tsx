import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import DateSelect2 from '../../../components/DateSelect2';
import Dropdown from '../../../components/Dropdown';
import { createTransaction, updateTransaction } from '../finance-api';
import { clearEditingTransaction, editingTxnSelector, expenseTypesSelector, fetchTransactionToEditAsync, incomeTypesSelector, projectsSelector } from '../finance-slice';
import { TxnCategory, TransactionInput } from '../types';
import { dateHelpers } from '../../../app/helpers'

interface Props {
  editingId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function DataEntryForm({ editingId, onSave, onCancel }: Props) {
  const dispatch = useAppDispatch();
  const editingTxn = useAppSelector(editingTxnSelector);
  const projectsListItems = useAppSelector(projectsSelector);
  const incomeListItems = useAppSelector(incomeTypesSelector);
  const expenseListItems = useAppSelector(expenseTypesSelector);

  const newTxn = useMemo(() => {
    const txn: TransactionInput = {
      category: TxnCategory.Expense,
      amount: 0.00,
      date: dateHelpers.toIsoString(new Date()),
      description: '',
      typeId: '',
      projectId: '',
      reconciled: false
    };
    return txn;
  }, [])

  const [txn, setTxn] = useState({ ...newTxn });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearEditingTransaction());
    }
  }, [])

  useEffect(() => {
    editingId && dispatch(fetchTransactionToEditAsync(editingId))
  }, [editingId])

  useEffect(() => {
    editingTxn && setTxn({ ...editingTxn, date: dateHelpers.toIsoString(new Date(editingTxn.date)) })
  }, [editingTxn])

  const setMsg = (msg: string, func: (msg: string) => void) => {
    func(msg);
    setTimeout(() => {
      func('')
    }, 5000);
  }

  const handleTxnChange = (field: string, value: any) => {
    const t = { ...txn, [field]: value };
    setTxn(t);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!txn.amount || !txn.typeId || !txn.projectId) {
      setMsg('Please fill all the fields', setErrorMsg);
      return;
    }

    let promise = undefined;
    if (editingId) {
      promise = updateTransaction(editingId, txn);
    } else {
      promise = createTransaction(txn);
    }

    promise.then(() => {
      setMsg('Transaction saved', setSuccessMsg);
      !editingId && handleReset();
      onSave && onSave();
    }).catch(() => setMsg('Error occurred', setErrorMsg))
  }

  const handleReset = () => {
    setTxn({ ...txn, amount: 0.00, description: '', typeId: '' });
    onCancel && onCancel();
  }

  const handleCategoryChange = (cat: TxnCategory) => {
    handleTxnChange('category', cat);
    handleTxnChange('typeId', '');
  }

  return <Form onSubmit={handleSubmit} onReset={handleReset}>
    <FormGroup>
      <ButtonGroup className='w-100'>
        <Button outline={txn.category != TxnCategory.Expense}
          color='danger'
          onClick={() => {handleCategoryChange(TxnCategory.Expense)}}>
          Expense
        </Button>
        <Button outline={txn.category != TxnCategory.Income}
          color='success'
          onClick={() => handleCategoryChange(TxnCategory.Income)}>
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
          <Dropdown name="projectId"
            items={projectsListItems}
            selectedValue={txn.projectId}
            onChange={(val => handleTxnChange('projectId', val))}
            placeholder="Select a project" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label>
            {txn.category == TxnCategory.Expense ? 'Expense Type' : 'Income Type'}
          </Label>
          <Dropdown name="typeId"
            selectedValue={txn.typeId}
            items={txn.category == TxnCategory.Expense ? expenseListItems : incomeListItems}
            onChange={(val => handleTxnChange('typeId', val))}
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
          <Input name='amount' type='number' value={txn.amount} onChange={(e) => handleTxnChange(e.target.name, parseFloat(e.target.value))} />
        </FormGroup>
      </Col>
      <Col sm={6}>
        <FormGroup>
          <Label>
            Date
          </Label>
          <DateSelect2 value={txn.date} onChange={(val) => handleTxnChange('date', val)} />
        </FormGroup>
      </Col>
    </Row>
    <FormGroup>
      <Label>
        Description
      </Label>
      <Input type='textarea'
        name='description'
        value={txn.description}
        onChange={(e) => handleTxnChange(e.target.name, e.target.value)} />
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
