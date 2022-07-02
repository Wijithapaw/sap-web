import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeProjectFilter, fetchProjectsAsync, projectFilterSelector } from "../project-slice";
import ProjectForm from "./ProjectForm";

const ProjectsFilter = () => {
    const dispatch = useAppDispatch();
    const [addNew, setAddNew] = useState(false);
    const projectFilter = useAppSelector(projectFilterSelector);

    useEffect(() => {
        dispatch(fetchProjectsAsync({ ...projectFilter }));
    }, [])

    const handleFileterChange = (name: string, value: any) => {
        dispatch(changeProjectFilter({ [name]: value }));
    }

    const search = (e: any) => {
        e.preventDefault();
        dispatch(fetchProjectsAsync({ ...projectFilter }));
    }

    const handleAddNew = () => {
        setAddNew(true)
    }

    return <>
        <Row>
            <Col xs={2}>
                Projects
            </Col>
            <Col>
                <FormGroup>
                    <Input
                        placeholder="Search Term"
                        name='searchTerm'
                        type='text'
                        value={projectFilter.searchTerm}
                        onChange={(e) => handleFileterChange('searchTerm', e.target.value)} />
                </FormGroup>
            </Col>
            <Col md={2}>
                <FormGroup check>
                    <Label check for="activeonlyfilter">Active Only</Label>
                    <Input className='me-2'
                        id="activeonlyfilter"
                        name='activeOnly'
                        type='checkbox'
                        checked={projectFilter.isActiveOnly}
                        onChange={(e) => handleFileterChange('isActiveOnly', e.target.checked)} />
                </FormGroup>
            </Col>
            <Col md={2} className="text-end">
                <Button color="primary" className="w-100" onClick={handleAddNew}>
                    Add New
                </Button>
            </Col>
            <Col md={2} className="text-end">
                <Button color="primary"
                    className="w-100" onClick={search}>
                    Search
                </Button>
            </Col>
        </Row>
        <Modal size='lg' centered
            isOpen={addNew}
            toggle={() => setAddNew(false)}>
            <ModalHeader toggle={() => setAddNew(false)}>New Project</ModalHeader>
            <ModalBody>
                <ProjectForm
                    onSave={() => {
                        //TODO dispatch(updateEditingProjectAsync(editingProjectId!));
                    }}
                     />
            </ModalBody>
        </Modal>
        <hr />
    </>;
};

export default ProjectsFilter;

