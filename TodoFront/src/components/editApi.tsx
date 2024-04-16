import { Form, Container, Button, Col } from "react-bootstrap";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Task from "../models/TaskModel";
import Activity from "../models/ActivityModel";
interface EditTaskFormProps {
  taskId: number | string;
}

export const GetTaskId = (taskId: number | string) => {
  const Id = typeof taskId === "number" ? taskId : parseInt(taskId);
  return Id;
};

export const EditTaskForm: React.FC<EditTaskFormProps> = ({ taskId }) => {
  const [tagCheckedIndex, setTagCheckedIndex] = useState<string | null>(null);
  const [statusCheckedIndex, setStatusCheckedIndex] = useState<string | null>(
    null
  );
  const [activityCheckedIndex, setActivityCheckedIndex] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<Task>({
    Id: NaN,
    Name: "",
    Description: "",
    StartDate: new Date(),
    EndDate: new Date(),
    TagName: "",
    TagTheme: "",
    StatusName: "",
    StatusTheme: "",
    ActivityTypeName: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const Id = GetTaskId(taskId);
    const formDataToSend = {
      ...formData,
      StartDate: formData.StartDate.toISOString()
        .slice(0, 19)
        .replace("T", " "),
      EndDate: formData.EndDate.toISOString().slice(0, 19).replace("T", " "),
      Id,
    };
    console.log(formDataToSend);
    try {
      const response = await fetch(`http://localhost:5299/api/Task/EditTask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });
      const data = await response.json();
      // window.location.reload();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagCheckboxChange = (tagindex: string) => {
    if (tagCheckedIndex === tagindex) {
      setTagCheckedIndex("");
    } else {
      setTagCheckedIndex(tagindex);
      setFormData({
        ...formData,
        TagName: tagindex,
        TagTheme: tagindex,
      });
    }
  };

  const handleStatusCheckboxChange = (statusindex: string) => {
    if (statusCheckedIndex === statusindex) {
      setStatusCheckedIndex("");
    } else {
      setStatusCheckedIndex(statusindex);
      setFormData({
        ...formData,
        StatusName: statusindex,
        StatusTheme: statusindex,
      });
    }
  };

  const handleActivityCheckboxChange = (activityindex: string) => {
    if (activityCheckedIndex === activityindex) {
      setActivityCheckedIndex("");
    } else {
      setActivityCheckedIndex(activityindex);
      setFormData({ ...formData, ActivityTypeName: activityindex });
    }
  };

  const handleStartDateChange = (date: Date) => {
    setFormData({
      ...formData,
      StartDate: date,
    });
  };

  const handleEndDateChange = (date: Date) => {
    setFormData({
      ...formData,
      EndDate: date,
    });
  };

  return (
    <Container className="bg-light p-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="Name" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Name:</Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="Description" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Description:</Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="StartDate" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Start Date:</Form.Label>
          <Col md={9}>
            <DatePicker
              selected={formData.StartDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="EndDate" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">End Date:</Form.Label>
          <Col md={9}>
            <DatePicker
              selected={formData.EndDate}
              onChange={handleEndDateChange}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="TagName" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Tag Name:</Form.Label>
          <Col md={9}>
            {["#Course", "#FreeTime", "#Urgent"].map((tagindex) => (
              <Form.Check
                inline
                key={tagindex}
                type="checkbox"
                name="TagName"
                label={tagindex}
                checked={tagCheckedIndex === tagindex}
                value={tagindex}
                onChange={() => handleTagCheckboxChange(tagindex)}
              />
            ))}
          </Col>
        </Form.Group>
        <Form.Group controlId="StatusName" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Status Name:</Form.Label>
          <Col md={9}>
            {["New", "In Progress", "Done"].map((statusindex) => (
              <Form.Check
                inline
                key={statusindex}
                type="checkbox"
                name="StatusName"
                label={statusindex}
                checked={statusCheckedIndex === statusindex}
                value={statusindex}
                onChange={() => handleStatusCheckboxChange(statusindex)}
              />
            ))}
          </Col>
        </Form.Group>
        <Form.Group controlId="ActivityTypeName" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">
            Activity Type Name:
          </Form.Label>
          <Col md={9}>
            {["School", "Work", "Hobby"].map((activityindex) => (
              <Form.Check
                inline
                key={activityindex}
                type="checkbox"
                name="ActivityTypeName"
                label={activityindex}
                checked={activityCheckedIndex === activityindex}
                value={activityindex}
                onChange={() => handleActivityCheckboxChange(activityindex)}
              />
            ))}
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save changes
        </Button>
      </Form>
    </Container>
  );
};

export const EditActivityForm: React.FC<EditTaskFormProps> = ({ taskId }) => {
  const [tagCheckedIndex, setTagCheckedIndex] = useState<string | null>(null);
  const [statusCheckedIndex, setStatusCheckedIndex] = useState<string | null>(
    null
  );
  const [activityCheckedIndex, setActivityCheckedIndex] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<Activity>({
    Id: NaN,
    Name: "",
    Description: "",
    Url: "",
    StartDate: new Date(),
    EndDate: new Date(),
    TagName: "",
    TagTheme: "",
    StatusName: "",
    StatusTheme: "",
    ActivityTypeName: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const Id = GetTaskId(taskId);
    const formDataToSend = {
      ...formData,
      StartDate: formData.StartDate.toISOString()
        .slice(0, 19)
        .replace("T", " "),
      EndDate: formData.EndDate.toISOString().slice(0, 19).replace("T", " "),
      Id,
    };
    // console.log(formDataToSend);
    try {
      const response = await fetch(
        `http://localhost:5299/api/Task/EditActivity`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );
      // const data = await response.json();
      // window.location.reload();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagCheckboxChange = (tagindex: string) => {
    if (tagCheckedIndex === tagindex) {
      setTagCheckedIndex("");
    } else {
      setTagCheckedIndex(tagindex);
      setFormData({
        ...formData,
        TagName: tagindex,
        TagTheme: tagindex,
      });
    }
  };

  const handleStatusCheckboxChange = (statusindex: string) => {
    if (statusCheckedIndex === statusindex) {
      setStatusCheckedIndex("");
    } else {
      setStatusCheckedIndex(statusindex);
      setFormData({
        ...formData,
        StatusName: statusindex,
        StatusTheme: statusindex,
      });
    }
  };

  const handleActivityCheckboxChange = (activityindex: string) => {
    if (activityCheckedIndex === activityindex) {
      setActivityCheckedIndex("");
    } else {
      setActivityCheckedIndex(activityindex);
      setFormData({ ...formData, ActivityTypeName: activityindex });
    }
  };

  const handleStartDateChange = (date: Date) => {
    setFormData({
      ...formData,
      StartDate: date,
    });
  };

  const handleEndDateChange = (date: Date) => {
    setFormData({
      ...formData,
      EndDate: date,
    });
  };

  return (
    <Container className="bg-light p-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="Name" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Name:</Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="Description" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Description:</Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="Url" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Url:</Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="Url"
              value={formData.Url}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="StartDate" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Start Date:</Form.Label>
          <Col md={9}>
            <DatePicker
              selected={formData.StartDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="EndDate" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">End Date:</Form.Label>
          <Col md={9}>
            <DatePicker
              selected={formData.EndDate}
              onChange={handleEndDateChange}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="TagName" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Tag Name:</Form.Label>
          <Col md={9}>
            {["#Course", "#FreeTime", "#Urgent"].map((tagindex) => (
              <Form.Check
                inline
                key={tagindex}
                type="checkbox"
                name="TagName"
                label={tagindex}
                checked={tagCheckedIndex === tagindex}
                value={tagindex}
                onChange={() => handleTagCheckboxChange(tagindex)}
              />
            ))}
          </Col>
        </Form.Group>
        {/* <Form.Group controlId="StatusName" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">Status Name:</Form.Label>
          <Col md={9}>
            {["New", "In Progress", "Done"].map((statusindex) => (
              <Form.Check
                inline
                key={statusindex}
                type="checkbox"
                name="StatusName"
                label={statusindex}
                checked={statusCheckedIndex === statusindex}
                value={statusindex}
                onChange={() => handleStatusCheckboxChange(statusindex)}
              />
            ))}
          </Col>
        </Form.Group> */}
        <Form.Group controlId="ActivityTypeName" className="row mb-3">
          <Form.Label className="col-md-3 text-md-end">
            Activity Type Name:
          </Form.Label>
          <Col md={9}>
            {["School", "Work", "Hobby"].map((activityindex) => (
              <Form.Check
                inline
                key={activityindex}
                type="checkbox"
                name="ActivityTypeName"
                label={activityindex}
                checked={activityCheckedIndex === activityindex}
                value={activityindex}
                onChange={() => handleActivityCheckboxChange(activityindex)}
              />
            ))}
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save changes
        </Button>
      </Form>
    </Container>
  );
};
