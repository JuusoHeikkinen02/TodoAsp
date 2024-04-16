import { useState, useEffect } from "react";
import Task from "../models/TaskModel";
import Activity from "../models/ActivityModel";
interface FetchTasksAndActivitiesProps {
  children: (data: { tasks: any[]; activities: any[] }) => React.ReactNode;
}

const GetAllTasks: React.FC<FetchTasksAndActivitiesProps> = ({
  children,
}): React.ReactElement => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5299/api/Task/GetTasksWithDetails"
        );
        const tasks = await response.json();
        // console.log(tasks)
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "http://localhost:5299/api/Task/GetActivityWithDetails"
        );
        const activities = await response.json();
        setActivities(activities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchTasks();
    fetchActivities();
  }, []);

  return <>{children({ tasks, activities })}</>;
};

export { GetAllTasks };
