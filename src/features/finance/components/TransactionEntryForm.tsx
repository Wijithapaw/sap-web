import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Dropdown from '../../../components/Dropdown';
import { createTransaction, deleteTransaction, reconcileTransaction, unreconcileTransaction, updateTransaction } from '../finance-api';
import { clearEditingTransaction, editingTxnSelector, expenseTypesSelector, fetchTransactionToEditAsync, incomeTypesSelector, updateEditingTransactionAsync } from '../finance-slice';
import { TxnCategory, TransactionInput } from '../types';
import { dateHelpers } from '../../../app/helpers'
import DateSelect from '../../../components/DateSelect';
import { SapPermissions } from '../../../app/constants';
import { selectAuthUser } from '../../auth/auth-slice';
import ProjectSingleSelect from '../../project/components/ProjectSingleSelect';

interface Props {
  editingId?: string;
  onSave?: () => void;
  onReset?: () => void;
  onDelete?: (id: string) => void;
}

export default function TransactionEntryForm({ editingId, onSave, onReset, onDelete }: Props) {
  const dispatch = useAppDispatch();
  const editingTxn = useAppSelector(editingTxnSelector);
  const incomeListItems = useAppSelector(incomeTypesSelector);
  const expenseListItems = useAppSelector(expenseTypesSelector);
  const user = useAppSelector(selectAuthUser);

  const canReconcile = useMemo(() => {
    return user && user.permissions.includes(SapPermissions.transactionReconcile)
  }, [user]);

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
    editingTxn && setTxn({ ...editingTxn, amount: Math.abs(editingTxn.amount), date: dateHelpers.toIsoString(new Date(editingTxn.date)) })
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
      !editingId && partialReset();
      onSave && onSave();
    }).catch(() => setMsg('Error occurred', setErrorMsg))
  }

  const handleReset = () => {
    if (editingId && editingTxn) {
      setTxn({ ...editingTxn, amount: Math.abs(editingTxn.amount), date: dateHelpers.toIsoString(new Date(editingTxn.date)) })
    } else {
      setTxn({ ...newTxn });
    }
    onReset && onReset();
  }

  const partialReset = () => {
    setTxn({ ...txn, amount: 0.00, description: '', typeId: '' });
  }

  const handleCategoryChange = (category: TxnCategory) => {
    setTxn({ ...txn, category, typeId: '' });
  }

  const handleReconcile = (checked: boolean) => {
    if (!editingId) {
      handleTxnChange('reconciled', checked)
    } else {
      let promise = checked ? reconcileTransaction(editingId) : unreconcileTransaction(editingId);
      promise.then(() => {
        handleTxnChange('reconciled', checked);
        dispatch(updateEditingTransactionAsync(editingId));
      });
    }
  }

  return <Form onSubmit={handleSubmit}>
    <FormGroup>
      <ButtonGroup className='w-100'>
        <Button outline={txn.category != TxnCategory.Expense}
          color='danger'
          onClick={() => { handleCategoryChange(TxnCategory.Expense) }}>
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
          <ProjectSingleSelect selectedValue={txn.projectId}
            onChange={(val => handleTxnChange('projectId', val))} />
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
          <Input name='amount' type='number' value={txn.amount || ''} onChange={(e) => handleTxnChange(e.target.name, parseFloat(e.target.value))} />
        </FormGroup>
      </Col>
      <Col sm={6}>
        <FormGroup>
          <Label>
            Date
          </Label>
          <DateSelect value={new Date(txn.date)} onChange={(val) => handleTxnChange('date', dateHelpers.toIsoString(val))} />
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
    {
      (canReconcile || editingId) && <FormGroup check>
        <Label for="chkAutoReconcile">
          Auto Reconcile
        </Label>
        <Input className='me-2'
          id="chkAutoReconcile"
          disabled={!canReconcile}
          name='reconciled'
          type='checkbox'
          checked={txn.reconciled}
          onChange={(e) => handleReconcile(e.target.checked)} />
        {txn.reconciled && editingId ?
          <span className='ms-2 text-muted'>
            <small>
              <small>
                <i>
                  {`(By: ${editingTxn?.reconciledBy} on ${dateHelpers.toDisplayString(editingTxn?.reconciledDateUtc || '')})`}
                </i>
              </small></small></span> : ''}
      </FormGroup>
    }
    <Row>
      <Col md={4}>
        <FormGroup>
          <Button type='button' className='mr-4' onClick={handleReset}>Reset</Button>
          {editingTxn && !txn.reconciled &&
            <Button className='ms-2' color='danger'
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this transaction?'))
                  onDelete && onDelete(editingId!);
              }} >Delete</Button>}
          <Button className='ms-2' type='submit'
            disabled={!!editingId && txn.reconciled} color='primary'>Save</Button>
        </FormGroup>
      </Col>
      <Col md={8}>
        <FormGroup>
          {successMsg && <Alert className='p-2' color='success'>{successMsg}</Alert>}
          {errorMsg && <Alert className='p-2' color='danger'>{errorMsg}</Alert>}
        </FormGroup>
      </Col>
    </Row>    {
      editingTxn && <Row>
        <Col className='text-muted'>
          <small>
            <small>
              <i>
                {`Created by: ${editingTxn.createdBy} on ${dateHelpers.toDisplayString(editingTxn.createdDateUtc)}`}
                <span className='ms-2 me-2'>|</span>
                {`Last Upadated by: ${editingTxn.lastUpdatedBy} on ${dateHelpers.toDisplayString(editingTxn.lastUpdatedDateUtc)}`}
              </i>
            </small>
          </small>
        </Col>
      </Row>
    }
  </Form >
}
