import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteTransactionInListAsync, transactionsSelector, updateEditingTransactionAsync } from '../finance-slice';
import { useTable, Column } from 'react-table'
import { Transaction, TxnCategory } from '../types';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { financeHelpers } from '../helpers';
import DataEntryForm from './DataEntryForm';
import { currencyHelpers, dateHelpers } from '../../../app/helpers';
import IconButton from '../../../components/IconButton';
import SapIcon from '../../../components/SapIcon';

export default function TransacationList() {
  const data = useAppSelector(transactionsSelector);
  const dispatch = useAppDispatch();
  const [editingTxnId, setEditingTxnId] = useState<string>();

  const columns = React.useMemo<Column<Transaction>[]>(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: props => dateHelpers.toIsoString(new Date(props.value))
      },
      {
        Header: 'Project',
        accessor: 'projectName',
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: props => {
          const shareDiv = props.row.original.typeCode === 'SHARE_DIVIDEND';
          return <div>
            <span className={props.value == TxnCategory.Expense ? (shareDiv ? 'text-primary' : 'text-danger') : 'text-success'}>
              {financeHelpers.getTxnCategoryShortDisplayTest(props.value)}
            </span>

            <span>
              {` | ${props.row.original.type}`}
            </span>
          </div>
        }
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Reconciled</div>,
        style: {
          textAlign: 'center',
        },
        accessor: 'reconciled',
        Cell: props => {          
          return <div style={{ textAlign: "center" }}>
            {props.value ? 
              <SapIcon icon='check' className='text-success' title={props.row.original.reconciledBy} /> : 
              <SapIcon icon='times' className='text-warning' />}
            </div>
        }
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Amount</div>,
        accessor: 'amount',
        headerClassName: 'text-end',
        style: {
          textAlign: 'center',
        },
        Cell: props => {
          const expense = props.row.values.category == TxnCategory.Expense
          const shareDividend = props.row.original.typeCode === 'SHARE_DIVIDEND';
          return <div className={expense ? (shareDividend ? 'text-primary' : 'text-danger') : 'text-success'} style={{ textAlign: "right" }}>
            <span>{expense ? '-' : '+'}</span>
            {currencyHelpers.toCurrency(Math.abs(props.value))}</div>
        }
      },
      {
        Header: () => '',
        accessor: 'id',
        style: {
          textAlign: 'center',
        },
        Cell: props => {
          return <div style={{ textAlign: "right" }}>
            <IconButton icon='pen' onClick={() => setEditingTxnId(props.value)} />
            <IconButton className='ms-2 text-danger' icon='trash' onClick={() => {
              if (window.confirm('Are you sure you want to delete this transaction?'))
                dispatch(deleteTransactionInListAsync(props.value));
            }} />
          </div>
        }
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data
  });

  return (<>
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
    <Modal size='lg' centered
      isOpen={!!editingTxnId}
      toggle={() => setEditingTxnId(undefined)}>
      <ModalHeader toggle={() => setEditingTxnId(undefined)}>Edit Transaction</ModalHeader>
      <ModalBody>
        <DataEntryForm editingId={editingTxnId}
          onSave={() => {
            dispatch(updateEditingTransactionAsync(editingTxnId!))
            setEditingTxnId(undefined);
          }}
          onCancel={() => setEditingTxnId(undefined)} />
      </ModalBody>
    </Modal>
  </>
  )
}
