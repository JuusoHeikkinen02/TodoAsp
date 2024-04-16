import React, { useState } from "react";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Activity from "../models/ActivityModel";
import { GetTaskStatus } from "./TaskStatus";

const AddActivityForm: React.FC = () => {
  const [tagCheckedIndex, setTagCheckedIndex] = useState<string | null>(null);
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
    e.preventDefault();
    const formDataToSend = {
      ...formData,
      StatusName: GetTaskStatus(formData.StartDate, formData.EndDate),
      StatusTheme: GetTaskStatus(formData.StartDate, formData.EndDate),
      StartDate: formData.StartDate.toISOString()
        .slice(0, 19)
        .replace("T", " "),
      EndDate: formData.EndDate.toISOString().slice(0, 19).replace("T", " "),
    };
    try {
      const response = await fetch(
        "http://localhost:5299/api/Task/AddActivity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );
      const data = await response.json();
      window.location.reload();
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
          <Form.Label className="col-md-3 text-md-end">URL:</Form.Label>
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
          Add Activity
        </Button>
      </Form>
    </Container>
  );
};

export default AddActivityForm;
