import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import DateSelect from "../../../components/DateSelect";
import ProjectSingleSelect from "../../project/components/ProjectSingleSelect";
import { WorkLogEntry } from "../types";
import { createWorkLog, updateWorkLog } from "../worklog-api";
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
      alert('Please fill all the fields'); //TODO
      return;
    }

    var promise = editingId ? updateWorkLog(editingId, workLog) : createWorkLog(workLog);
    promise.then((id) => {
      !editingId && handleReset();

      onSave && onSave(editingId || id);
    });
  }

  const handleChangeHtmlInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.name, e.target.type === 'number' ? +e.target.value: e.target.value);
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
      <Col xs={6}>
        <FormGroup>
          <Label>Project</Label>
          <ProjectSingleSelect selectedValue={workLog.projectId} onChange={(val) => handleChange('projectId', val)} />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label>Labour</Label>
          <Input name="labourName" value={workLog.labourName} onChange={handleChangeHtmlInput} />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label>Date</Label>
          <DateSelect value={new Date(workLog.date)} onChange={(val) => handleChange('date', dateHelpers.toIsoString(val))} />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col xs={9}>
        <FormGroup>
          <Label>Job Description</Label>
          <Input name="jobDescription" value={workLog.jobDescription} onChange={handleChangeHtmlInput} />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label>Wage</Label>
          <Input name="wage" type="number" value={workLog.wage || ''} onChange={handleChangeHtmlInput} />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col>
        <Button type='button' className='mr-4' onClick={handleReset}>Reset</Button>
        <Button className='ms-2' type='submit' color='primary'>Save</Button>
      </Col>
      <Col>
      </Col>
    </Row>
  </Form>
}