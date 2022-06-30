import { useEffect } from "react";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { isMobileSelector } from "../../../app/core-slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeProjectFilter, fetchProjectsAsync, projectFilterSelector } from "../project-slice";

const ProjectsFilter = () => {
    const dispatch = useAppDispatch();
    const projectFilter = useAppSelector(projectFilterSelector);
    const isMobile = useAppSelector(isMobileSelector);

    const handleFileterChange = (name: string, value: any) => {
        console.log('filter', value);
        dispatch(changeProjectFilter({ [name]: value }));
    }

    const search = (e:any) => {
        e.preventDefault();
        dispatch(fetchProjectsAsync({ ...projectFilter }));
    }

    return <Card className="mt-2 mb-2">
        <CardBody>
            <Form onSubmit={search}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input className='ms-2'
                                name='searchTerm'
                                type='text'
                                value={projectFilter.searchTerm}
                                onChange={(e) => handleFileterChange('searchTerm', e.target.value)} />
                        </FormGroup>
                    </Col>

                    <Col md={2}>
                        <FormGroup>
                            <Label>Active Only</Label><br />
                            <Input className='ms-2'
                                name='activeOnly'
                                type='checkbox'
                                checked={projectFilter.isActiveOnly}
                                onChange={(e) => handleFileterChange('isActiveOnly', e.target.checked)} />
                        </FormGroup>
                    </Col>
                    <Col md={2} className="text-end mt-4">
                        <Button color="primary" type="submit" className={`${isMobile ? 'w-100' : ''}`}>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>
        </CardBody>
    </Card>;
};

export default ProjectsFilter;

