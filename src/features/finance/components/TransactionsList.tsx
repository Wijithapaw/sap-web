import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteTransactionInListAsync, transactionsSelector, updateTransactionInListAsync } from '../finance-slice';
import { useTable, Column } from 'react-table'
import { Transaction, TxnCategory } from '../types';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { financeHelpers } from '../helpers';
import DataEntryForm from './DataEntryForm';
import { currencyHelpers, dateHelpers } from '../../../app/helpers';

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
        Cell: props => <div className={props.row.values.category == TxnCategory.Expense ? 'text-danger' : 'text-success'}>
          {financeHelpers.getTxnCategoryDisplayTest(props.value)}
        </div>
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Description',
        accessor: 'description',
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
          return <div className={expense ? 'text-danger' : 'text-success'} style={{ textAlign: "right" }}>
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
            <Button size='sm' onClick={() => setEditingTxnId(props.value)}>
              View
            </Button>
            <Button className='ms-2' color='danger' size='sm'
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this transaction?'))
                  dispatch(deleteTransactionInListAsync(props.value));
              }}>
              Delete
            </Button>
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
            dispatch(updateTransactionInListAsync(editingTxnId!))
            setEditingTxnId(undefined);
          }}
          onCancel={() => setEditingTxnId(undefined)} />
      </ModalBody>
    </Modal>
  </>
  )
}
