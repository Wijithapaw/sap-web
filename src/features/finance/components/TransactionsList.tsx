import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { transactionsSelector } from '../finance-slice';
import { useTable, Column } from 'react-table'
import { Transaction, TxnCategory } from '../types';
import { Table } from 'reactstrap';
import { financeHelpers } from '../helpers';

function toCurrency(amount: number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatData(date: string) {
  return new Date(date).toLocaleDateString('en-CA');
}

export default function TransacationList() {
  const data = useAppSelector(transactionsSelector);

  const columns = React.useMemo<Column<Transaction>[]>(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: props => formatData(props.value)
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
            {toCurrency(props.value)} </div>
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

  return (
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
  )
}
