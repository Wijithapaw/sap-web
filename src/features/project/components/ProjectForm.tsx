import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/Dropdown";
import { createProject, updateProject } from "../project-api";
import { clearEditingProject, editingProjectSelector, fetchProjectToEditAsync, projectStatusSelector } from "../project-slice";
import { Project, ProjectState } from "../types"

interface Props {
    editingId?: string;
    onSave?: () => void;
    onReset?: () => void;
    onDelete?: (id: string) => void;
}

const ProjectForm = ({ editingId, onSave, onReset, onDelete }: Props) => {
    const dispatch = useAppDispatch();
    const projectStatus = useAppSelector(projectStatusSelector);
    const editingProject = useAppSelector(editingProjectSelector);

    const newProject = useMemo(() => {
        const project: Project = {
            id: '',
            description: '',
            name: '',
            projectManager: '',
            projectManagerId: '',
            state: ProjectState.Pending
        };
        return project;
    }, []);

    const setMsg = (msg: string, func: (msg: string) => void) => {
        func(msg);
        setTimeout(() => {
            func('')
        }, 5000);
    }

    const [project, setProject] = useState<Project>({ ...newProject });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        return () => {
            dispatch(clearEditingProject());
        }
    }, [])

    useEffect(() => {
        editingId && dispatch(fetchProjectToEditAsync(editingId))
    }, [editingId]);

    useEffect(() => {
        editingProject && setProject({ ...editingProject, state: +editingProject.state })
      }, [editingProject]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!project.name || !project.state || !project.description) {
            setMsg('Please fill all the fields', setErrorMsg);
            return;
        }

        let promise = undefined;
        if (editingId) {
            promise = updateProject(editingId, project);
        } else {
            promise = createProject(project);
        }

        promise.then(() => {
            setMsg('Project saved', setSuccessMsg);
            onSave && onSave();
        }).catch(() => setMsg('Error occurred', setErrorMsg))
    }

    const handleReset = (e: any) => {
        e.preventDefault();
        setProject({ ...newProject });
        onReset && onReset();
    }

    const handleProjectChange = <T,>(property: string, value: T) => {
        const p = { ...project, [property]: value };
        setProject(p);
    };

    return <Form onSubmit={handleSubmit}>
        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label>
                        Name
                    </Label>
                    <Input name='name' type='text' value={project.name || ''} onChange={(e) => handleProjectChange('name', e.target.value)} />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <Label>
                        Status
                    </Label>
                    <Dropdown name="state"
                        selectedValue={project.state.toString()}
                        items={projectStatus}
                        onChange={(val => handleProjectChange('state', val))}
                        placeholder="Select a state" />

                </FormGroup>
            </Col>
        </Row>
        <Row>
            <FormGroup>
                <Label>
                    Description
                </Label>
                <Input name='description' type='textarea' value={project.description || ''} onChange={(e) => handleProjectChange('description', e.target.value)} />
            </FormGroup>
        </Row>
        <Row>
            <Col md={4}>
                <FormGroup>
                    <Button type='button' className='mr-4' onClick={handleReset}>Reset</Button>
                    {editingProject &&
                        <Button className='ms-2' color='danger'
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this project?'))
                                    onDelete && onDelete(editingId!);
                            }} >Delete</Button>}
                    <Button className='ms-2' type='submit' color='primary'>Save</Button>
                </FormGroup>
            </Col>
            <Col md={8}>
                <FormGroup>
                    {successMsg && <Alert className='p-2' color='success'>{successMsg}</Alert>}
                    {errorMsg && <Alert className='p-2' color='danger'>{errorMsg}</Alert>}
                </FormGroup>
            </Col>
        </Row>
    </Form >
}

export default ProjectForm;