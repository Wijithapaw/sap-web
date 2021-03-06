import { useMemo, useState } from "react";
import { Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import LookupList from "../../lookup/components/LooksupList";
import ProjectsTab from "../../project/components/ProjectsTab";

export default function AdminPage() {
    const tabs = useMemo(() => {
        return [
            { id: 'PROJECTS', label: "Projects", component: <ProjectsTab /> },
            { id: 'EXPENSE_TYPES', label: "Expense Types", component: <LookupList headerCode="EXPENSE_TYPES"/> },
            { id: 'INCOME_TYPES', label: "Income Types", component: <LookupList headerCode="INCOME_TYPES" /> }]
    }, []);

    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return <Row className="mt-2">
        <Col xs={2}>
            <Nav vertical pills>
                {
                    tabs.map(val => <NavItem key={val.id}>
                        <NavLink href="#" onClick={() => setSelectedTab(val)}
                            className={selectedTab.id === val.id ? 'active' : ''}>
                            {val.label}
                        </NavLink>
                    </NavItem>)
                }
            </Nav>
        </Col>
        <Col>
            {selectedTab.component}
        </Col>
    </Row>
}