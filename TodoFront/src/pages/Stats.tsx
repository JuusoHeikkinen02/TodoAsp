import { GetAllTasks } from "../components/getAPI";
import { DoughnutChart, DoughnutChartAC } from "../components/charts";

import { Container, Row, Col } from "react-bootstrap";

const Stats = () => {
  return (
    <>
      <Container className="text-center mt-4">
        <h1>Stats</h1>
      </Container>
      <GetAllTasks>
        {({ tasks, activities }) => (
          <div>
            <Row>
              <Col md="6">
                <DoughnutChart tasks={tasks} />
              </Col>
              <Col md="6">
                <DoughnutChartAC activities={activities} />
              </Col>
            </Row>
          </div>
        )}
      </GetAllTasks>
    </>
  );
};
export default Stats;
