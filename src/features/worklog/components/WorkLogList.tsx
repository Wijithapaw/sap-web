import { useMemo, useState } from "react";
import { Column } from "react-table";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { isMobileSelector } from "../../../app/core-slice";
import { currencyHelpers, dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import IconButton from "../../../components/IconButton";
import SapIcon from "../../../components/SapIcon";
import SapPaginator from "../../../components/SapPaginator";
import SapTable from "../../../components/SapTable";
import { WorkLog } from "../types";
import { changeWorkLogFilter, clearEditingWorklog, deleteWorkLogAsync, searchWorkLogsAsync, updateEditingWorkLogAsync, worklogFilterSelector, worklogSelector, worklogTotalSelector } from "../worklog-slice"
import WorkLogEntryForm from "./WorkLogEntryForm";

export default function WorkLogsList() {
  const [editingId, setEditingId] = useState<string>();

  const data = useAppSelector(worklogSelector);
  const total = useAppSelector(worklogTotalSelector);
  const filter = useAppSelector(worklogFilterSelector);
  const isMobile = useAppSelector(isMobileSelector);

  const dispatch = useAppDispatch();

  const columns = useMemo<Column<WorkLog>[]>(
    () => {
      const cols: Column<WorkLog>[] = [
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
          Header: 'Labour',
          accessor: 'labourName',
        },
        {
          Header: 'Job',
          accessor: 'jobDescription',
        },
        {
          Header: () => <div style={{ textAlign: "right" }}>Wage</div>,
          accessor: 'wage',
          Cell: props => {
            return <div style={{ textAlign: "right" }}>
              {props.row.original.wageTxnReconciled === undefined ? props.row.values.wageTxnReconciled : <span className="me-2">
                {props.row.values.wageTxnReconciled ?
                  <SapIcon icon='check' className='text-success' title="Reconciled" /> :
                  <SapIcon icon='times' className='text-warning' title="Not Reconciled" />}
              </span>}
              {props.value && currencyHelpers.toCurrency(Math.abs(props.value)) || ''}</div>
          }
        },
        {
          Header: () => '',
          accessor: 'id',
          Cell: props => {
            return <div style={{ textAlign: "right" }}>
              {
                <IconButton className='text-danger' icon='trash' onClick={() => {
                  if (window.confirm('Are you sure you want to delete this transaction?'))
                    handleDeleteWorkLog(props.value);
                }} />}
              <IconButton className='ms-2' icon='eye' onClick={() => setEditingId(props.value)} />
            </div>
          }
        },
      ];

      return cols;
    }, []);

  const handlePaginationChange = (name: string, value: any) => {
    dispatch(changeWorkLogFilter({ [name]: value }));
    dispatch(searchWorkLogsAsync({ ...filter, [name]: value }));
  }

  const handleDeleteWorkLog = (id: string) => {
    dispatch(deleteWorkLogAsync(id));
  }

  const toggleEditing = () => {
    setEditingId(undefined);
    dispatch(clearEditingWorklog())
  }

  return <>
    <SapTable data={data} columns={columns} />
    <SapPaginator page={filter.page}
      total={total}
      pageSize={filter.pageSize}
      onChange={(p) => handlePaginationChange('page', p)} />
    <Modal size='lg' centered
      isOpen={!!editingId}
      toggle={toggleEditing}>
      <ModalHeader toggle={toggleEditing}>Edit Worklog</ModalHeader>
      <ModalBody>
        <WorkLogEntryForm editingId={editingId} onSave={() => {
          dispatch(updateEditingWorkLogAsync(editingId!))
        }} />
      </ModalBody>
    </Modal>
  </>
}
