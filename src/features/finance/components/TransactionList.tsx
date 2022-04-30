import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { changeTxnFilter, fetchTransactionsAsync, fetchTransactionSummaryAsync, removeTransactionFromList, transactionsSelector, txnFilterSelector, updateEditingTransactionAsync } from '../finance-slice';
import { useTable, Column } from 'react-table'
import { Transaction, TxnCategory } from '../types';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { financeHelpers } from '../helpers';
import DataEntryForm from './DataEntryForm';
import { currencyHelpers, dateHelpers } from '../../../app/helpers';
import IconButton from '../../../components/IconButton';
import SapIcon from '../../../components/SapIcon';
import { deleteTransaction } from '../finance-api';
import { isMobileSelector, setGlobalError } from '../../../app/core-slice';
import SapPaginator from '../../../components/SapPaginator';
import { RootState } from '../../../app/store';

export default function TransacationList() {
  const data = useAppSelector(transactionsSelector);
  const totalTxns = useAppSelector((state: RootState) => state.finance.totalTxns);
  const txnFilter = useAppSelector(txnFilterSelector);
  const isMobile = useAppSelector(isMobileSelector);

  const dispatch = useAppDispatch();
  const [editingTxnId, setEditingTxnId] = useState<string>();

  const handleDeleteTxn = (id: string) => {
    deleteTransaction(id).then(() => {
      dispatch(fetchTransactionSummaryAsync(txnFilter));
      dispatch(removeTransactionFromList(id));
      setEditingTxnId(undefined);
    }).catch(err => {
      dispatch(setGlobalError(err.response.data))
    })
  };

  const columns = React.useMemo<Column<Transaction>[]>(
    () => {
      const cols: Column<Transaction>[] = [
        {
          Header: 'Date',
          accessor: 'date',
          Cell: props => <div className='text-nowrap'>
            {isMobile ? dateHelpers.toShortDateString(props.value)
              : dateHelpers.toIsoString2(props.value)}
          </div>
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
          Header: () => <div style={{ textAlign: "center" }}> {isMobile ? 'Rec.' : 'Reconciled'}</div>,
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
          Cell: props => {
            return <div style={{ textAlign: "right" }}>
              {!props.row.original.reconciled &&
                <IconButton className='text-danger' icon='trash' onClick={() => {
                  if (window.confirm('Are you sure you want to delete this transaction?'))
                    handleDeleteTxn(props.value);
                }} />}
              <IconButton className='ms-2' icon='eye' onClick={() => setEditingTxnId(props.value)} />
            </div>
          }
        },
      ];

      if (!isMobile) {
        cols.splice(3, 0, {
          Header: 'Description',
          accessor: 'description',
        });
      }

      return cols;
    }, []
  );

  const handlePaginationChange = (name: string, value: any) => {
    dispatch(changeTxnFilter({ [name]: value }));
    dispatch(fetchTransactionsAsync({ ...txnFilter, [name]: value }));
  }

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
    <Table {...getTableProps()} responsive>
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
    <SapPaginator page={txnFilter.page}
      total={totalTxns}
      pageSize={txnFilter.pageSize}
      onChange={(p) => handlePaginationChange('page', p)} />
    <Modal size='lg' centered
      isOpen={!!editingTxnId}
      toggle={() => setEditingTxnId(undefined)}>
      <ModalHeader toggle={() => setEditingTxnId(undefined)}>Edit Transaction</ModalHeader>
      <ModalBody>
        <DataEntryForm editingId={editingTxnId}
          onSave={() => {
            dispatch(updateEditingTransactionAsync(editingTxnId!))
            dispatch(fetchTransactionSummaryAsync(txnFilter));
          }}
          onDelete={handleDeleteTxn}
        />

      </ModalBody>
    </Modal>
  </>
  )
}
