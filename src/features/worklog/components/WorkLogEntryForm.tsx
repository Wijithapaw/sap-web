import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { showNotification } from "../../../app/notification-service";
import { RootState } from "../../../app/store";
import { NotificationType } from "../../../app/types";
import DateSelect from "../../../components/DateSelect";
import SapTypeAhead from "../../../components/SapTypeAhead";
import ProjectSingleSelect from "../../project/components/ProjectSingleSelect";
import { WorkLogEntry } from "../types";
import { createWorkLog, getLabourNames, updateWorkLog } from "../worklog-api";
import { getEditingWorkLogAsync } from "../worklog-slice";

interface Props {
  editingId?: string;
  onSave?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function WorkLogEntryForm({ editingId, onSave, onDelete }: Props) {
  const dispatch = useAppDispatch();

  const editingWorklog = useAppSelector((state: RootState) => state.worklog.editingWorklog);

  const newWorkLog = useMemo(() => {
    const log: WorkLogEntry = {
      date: dateHelpers.toIsoString(new Date()),
      jobDescription: '',
      labourName: '',
      projectId: '',
    };
    return log;
  }, []);

  const [workLog, setWorkLog] = useState({ ...newWorkLog });

  useEffect(() => {
    editingId && dispatch(getEditingWorkLogAsync(editingId))
  }, [editingId])

  useEffect(() => {
    editingWorklog && setWorkLog({
      jobDescription: editingWorklog.jobDescription,
      labourName: editingWorklog.labourName,
      date: editingWorklog.date,
      projectId: editingWorklog.projectId,
      wage: editingWorklog.wage
    });
  }, [editingWorklog])

  const handleChange = (field: string, value: any) => {
    setWorkLog({ ...workLog, [field]: value });
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!workLog.projectId || !workLog.date || !workLog.jobDescription || !workLog.labourName) {
      showNotification(NotificationType.warning, 'Please fill all the fields');
      return;
    }

    var promise = editingId ? updateWorkLog(editingId, workLog) : createWorkLog(workLog);
    promise.then((id) => {
      showNotification(NotificationType.success, `Worklog ${editingId ? 'updated' : 'created'}`);
      onSave && onSave(editingId || id);
    }).catch((err) => {
      showNotification(NotificationType.error, `Worklog ${editingId ? 'updatation' : 'creation'} failed`);
    });
  }

  const handleChangeHtmlInput = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const value = type === 'number' ? +e.target.value : type === 'checkbox' ? e.target.checked : e.target.value;
    handleChange(e.target.name, value);
  }

  const handleReset = () => {
    setWorkLog(editingWorklog ? {
      jobDescription: editingWorklog.jobDescription,
      labourName: editingWorklog.labourName,
      date: editingWorklog.date,
      projectId: editingWorklog.projectId,
      wage: editingWorklog.wage
    } : newWorkLog);
  }

  return <Form onSubmit={handleSubmit}>
    <Row>
      <Col md={6}>
        <FormGroup>
          <Label>Project</Label>
          <ProjectSingleSelect selectedValue={workLog.projectId} onChange={(val) => handleChange('projectId', val)} />
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label>Labour</Label>
          <SapTypeAhead id="labour-input"
            onInputChange={(q) => handleChange('labourName', q)}
            searchFunc={getLabourNames} />
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label>Date</Label>
          <DateSelect value={new Date(workLog.date)} onChange={(val) => handleChange('date', dateHelpers.toIsoString(val))} />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col md={9}>
        <FormGroup>
          <Label>Job Description</Label>
          <Input name="jobDescription" value={workLog.jobDescription} onChange={handleChangeHtmlInput} />
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label>Wage</Label>
          <Input name="wage" type="number" value={workLog.wage || ''} onChange={handleChangeHtmlInput} />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col>
        {
          editingId ? editingWorklog?.wageTxnId && <FormGroup>{editingWorklog.wageTxnReconciled ? "Wage Transaction Created & Reconciled" : "Wage Transaction Created"}</FormGroup> : <FormGroup check>
            <Label for="createWageTxnCheck" check>Create Transaction <small className="text-muted"><i>[Requires 'wage']</i></small></Label>
            <Input id="createWageTxnCheck" name="createWageTxn" className="me-2" disabled={!workLog.wage}
              checked={workLog.createWageTxn || false}
              type="checkbox"
              onChange={handleChangeHtmlInput} />
          </FormGroup>
        }
      </Col>
    </Row>
    <Row>
      <Col>
        <Button type='button' className='mr-4' onClick={handleReset}>Reset</Button>
        <Button className='ms-2' type='submit' color='primary'
          disabled={editingId && editingWorklog?.wageTxnReconciled || false}>Save</Button>
      </Col>
      <Col>
      </Col>
    </Row>
  </Form>
}