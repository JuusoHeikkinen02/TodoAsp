import AddActivityForm from "../components/putAPI";
import React, { useState } from "react";
import {
  Container,
  Accordion,
  Button,
  Dropdown,
  Col,
  Row,
} from "react-bootstrap";
import { GetAllTasks } from "../components/getAPI";
import { GetTaskId } from "../components/editApi";
import { deleteActivity } from "../components/deleteTask";
import { EditActivityForm } from "../components/editApi";
import { MarkActivityDone } from "../components/TaskStatus";
import Activity from "../models/ActivityModel";
import "../App.css";

const Activities = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );
  const [showEditForm, setShowEditForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleEditButtonClick = (taskId: number) => {
    setShowEditForm(true);
    setSelectedActivityId(taskId);
    GetTaskId(taskId);
    console.log(GetTaskId(taskId));
  };

  const handleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Deselect the tag if it's already selected
    } else {
      setSelectedTag(tag); // Select the tag
    }
  };

  const handleStatusFilter = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null); // Deselect the tag if it's already selected
    } else {
      setSelectedStatus(status); // Select the tag
    }
  };

  const handleActivityFilter = (activityfilter: string) => {
    if (selectedActivity === activityfilter) {
      setSelectedActivity(null); // Deselect the tag if it's already selected
    } else {
      setSelectedActivity(activityfilter); // Select the tag
    }
  };

  const isTagVisible = (activity: Activity) => {
    return !selectedTag || activity.TagName.includes(selectedTag);
  };

  const isStatusVisible = (activity: Activity) => {
    return !selectedStatus || activity.StatusName === selectedStatus;
  };

  const isActivityTypeVisible = (activity: Activity) => {
    return !selectedActivity || activity.ActivityTypeName === selectedActivity;
  };

  const isTaskVisible = (activity: Activity) => {
    return (
      isTagVisible(activity) &&
      isStatusVisible(activity) &&
      isActivityTypeVisible(activity)
    );
  };
  return (
    <Container className="text-center mt-4" style={{ maxWidth: "800px" }}>
      {showForm ? (
        <Container className="d-flex flex-column align-items-center">
          <h2 className="mb-4">Add Activity</h2>
          <AddActivityForm />
        </Container>
      ) : (
        <Container className="d-flex justify-content-between align-items-center bg-secondary p-4">
          <h2 className="mb-0 mr-auto">Activities</h2>
          <Button className="btn btn-primary" onClick={handleButtonClick}>
            Add Activity
          </Button>
        </Container>
      )}
      {!showForm && (
        <GetAllTasks>
          {({ activities }) => (
            <div>
              {activities.length === 0 ? (
                <h3>No activities</h3>
              ) : (
                <>
                  <Container className="d-flex justify-content-between align-items-center  bg-light p-4">
                    <h3>Filters</h3>
                    <div className="d-flex">
                      <Row>
                        <Col md="4">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-tags"
                            >
                              {selectedTag ? selectedTag : "Select Tag"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleTagFilter("")}
                              >
                                None
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleTagFilter("#Course")}
                              >
                                #Course
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleTagFilter("#FreeTime")}
                              >
                                #FreeTime
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleTagFilter("#Urgent")}
                              >
                                #Urgent
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                        <Col md="4">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-status"
                            >
                              {selectedStatus
                                ? selectedStatus
                                : "Select Status"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleStatusFilter("")}
                              >
                                None
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusFilter("New")}
                              >
                                New
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleStatusFilter("In Progress")
                                }
                              >
                                In Progress
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusFilter("Expired")}
                              >
                                Expired
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleStatusFilter("Done")}
                              >
                                Done
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                        <Col md="4">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-activity"
                            >
                              {selectedActivity
                                ? selectedActivity
                                : "Select Activity"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleActivityFilter("")}
                              >
                                None
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleActivityFilter("School")}
                              >
                                School
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleActivityFilter("Work")}
                              >
                                Work
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleActivityFilter("Hobby")}
                              >
                                Hobby
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </Row>
                    </div>
                  </Container>
                  <Accordion>
                    {activities
                      .filter(isTaskVisible)
                      .map((activity: Activity, activityIndex: number) => (
                        <Accordion.Item
                          key={activityIndex}
                          eventKey={`${activityIndex}`}
                        >
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
                            <Button
                              className="success"
                              onClick={() => MarkActivityDone(activity.Id)}
                            >
                              Done
                            </Button>
                            <Button
                              className="btn-danger"
                              onClick={() => deleteActivity(activity.Id)}
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() => handleEditButtonClick(activity.Id)}
                            >
                              Edit
                            </Button>
                            {showEditForm &&
                              selectedActivityId === activity.Id && (
                                <EditActivityForm taskId={selectedActivityId} />
                              )}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                </>
              )}
            </div>
          )}
        </GetAllTasks>
      )}
    </Container>
  );
};

export default Activities;
