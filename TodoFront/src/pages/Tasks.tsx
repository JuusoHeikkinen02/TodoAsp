import AddTaskForm from "../components/putTaskApi";
import React, { useState } from "react";
import { GetAllTasks } from "../components/getAPI";
import { deleteTask } from "../components/deleteTask";
import { GetTaskId } from "../components/editApi";
import { EditTaskForm } from "../components/editApi";
import { MarkTaskDone } from "../components/TaskStatus";
import Task from "../models/TaskModel";
import {
  Accordion,
  Button,
  Container,
  Dropdown,
  Col,
  Row,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import "../App.css";

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleEditButtonClick = (taskId: number) => {
    setShowEditForm(true);
    setSelectedTaskId(taskId);
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

  const isTagVisible = (task: Task) => {
    return !selectedTag || task.TagName.includes(selectedTag);
  };

  const isStatusVisible = (task: Task) => {
    return !selectedStatus || task.StatusName === selectedStatus;
  };

  const isActivityTypeVisible = (task: Task) => {
    return !selectedActivity || task.ActivityTypeName === selectedActivity;
  };

  const isTaskVisible = (task: Task) => {
    return (
      isTagVisible(task) && isStatusVisible(task) && isActivityTypeVisible(task)
    );
  };
  return (
    <Container className="text-center mt-4" style={{ maxWidth: "800px" }}>
      {showForm ? (
        <Container className="d-flex flex-column align-items-center">
          <h2 className="mb-4">Add Task</h2>
          <AddTaskForm />
        </Container>
      ) : (
        <Container className="d-flex justify-content-between align-items-center container bg-secondary p-4">
          <h2 className="mb-0 mr-auto">Tasks</h2>
          <Button className="btn btn-primary" onClick={handleButtonClick}>
            Add Task
          </Button>
        </Container>
      )}
      {!showForm && (
        <GetAllTasks>
          {({ tasks }) => (
            <div>
              {tasks.length === 0 ? (
                <h3>No tasks</h3>
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
                                In Progres
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
                    {tasks
                      .filter(isTaskVisible)
                      .map((task: Task, TaskIndex: number) => (
                        <Accordion.Item
                          key={TaskIndex}
                          eventKey={`${TaskIndex}`}
                        >
                          <Accordion.Header className="justify-co">
                            {task.Name}
                            <Trash />
                          </Accordion.Header>
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
                            <Button
                              variant="success"
                              onClick={() => MarkTaskDone(task.Id)}
                            >
                              Done
                            </Button>
                            <Button
                              className="btn-danger"
                              onClick={() => deleteTask(task.Id)}
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() => handleEditButtonClick(task.Id)}
                            >
                              Edit
                            </Button>
                            {showEditForm && selectedTaskId === task.Id && (
                              <EditTaskForm taskId={selectedTaskId} />
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

export default Tasks;
