import { GetAllTasks } from "../components/getAPI";
import { Accordion, Card, Row, Col, Container } from "react-bootstrap";
import { AreaChart } from "../components/charts";
import Task from "../models/TaskModel";
import Activity from "../models/ActivityModel";
import "../App.css";

const Home = () => {
  const TaskSection: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
    <>
      <Col md="6">
        <Container className=" bg-secondary p-1">
          <h1>Recent Tasks</h1>
        </Container>
        <Accordion>
          {tasks.slice(0, 5).map((task, index) => (
            <Card key={index}>
              <Accordion.Item eventKey={index.toString()}>
                <Accordion.Header>{task.Name}</Accordion.Header>
                <Accordion.Body
                  className="accordion-body"
                  style={{ textAlign: "left" }}
                >
                  <h4>Description</h4>
                  <p>{task.Description}</p>
                  <h4>Started</h4>
                  <p>{task.StartDate.toLocaleString()}</p>
                  <h4>Ends</h4>
                  <p>{task.EndDate.toLocaleString()}</p>
                  <h4>Tag</h4>
                  <p>{task.TagName}</p>
                  <h4>Status</h4>
                  <p>{task.StatusName}</p>
                  <h4>Activity Type</h4>
                  <p>{task.ActivityTypeName}</p>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      </Col>
    </>
  );

  const ActivitySection: React.FC<{ activities: Activity[] }> = ({
    activities,
  }) => {
    return (
      <>
        <Col md="6">
          <Container className=" bg-secondary p-1">
            <h1>Recent Activities</h1>
          </Container>
          <Accordion>
            {activities.slice(0, 5).map((activity, index) => (
              <Accordion key={index}>
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>{activity.Name}</Accordion.Header>
                  <Accordion.Body
                    className="accordion-body"
                    style={{ textAlign: "left" }}
                  >
                    <h4>Description</h4>
                    <p>{activity.Description}</p>
                    <h4>URL</h4>
                    <p>{activity.Url}</p>
                    <h4>Started</h4>
                    <p>{activity.StartDate.toLocaleString()}</p>
                    <h4>Ends</h4>
                    <p>{activity.EndDate.toLocaleString()}</p>
                    <h4>Tag</h4>
                    <p>{activity.TagName}</p>
                    <h4>Status</h4>
                    <p>{activity.StatusName}</p>
                    <h4>Activity Type</h4>
                    <p>{activity.ActivityTypeName}</p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))}
          </Accordion>
        </Col>
      </>
    );
  };

  return (
    <Container className="text-center mt-4" style={{ maxWidth: "800px" }}>
      <GetAllTasks>
        {({ tasks, activities }) => (
          <>
            {tasks.length === 0 && activities.length === 0 ? (
              <Container className="d-flex justify-content-center align-items-center bg-secondary p-4">
                <h1>No tasks or activities</h1>
              </Container>
            ) : (
              <Row>
                {tasks.length > 0 && <TaskSection tasks={tasks} />}
                {tasks.length === 0 && activities.length > 0 && (
                  <Col md="6">
                    <Container className=" bg-secondary p-1">
                      <h1>No tasks</h1>
                    </Container>
                  </Col>
                )}
                {activities.length > 0 && (
                  <ActivitySection activities={activities} />
                )}
                {activities.length === 0 && tasks.length > 0 && (
                  <Col md="6">
                    <Container className=" bg-secondary p-1">
                      <h1>No Activities</h1>
                    </Container>
                  </Col>
                )}
              </Row>
            )}
            <div className="areachart">
              <AreaChart tasks={tasks} activities={activities} />
            </div>
          </>
        )}
      </GetAllTasks>
    </Container>
  );
};

export default Home;
