interface Task {
  Id: number;
  Name: string;
  Description: string;
  StartDate: Date;
  EndDate: Date;
  TagName: string;
  TagTheme: string;
  StatusName: string;
  StatusTheme: string;
  ActivityTypeName: string;
}

export default Task;
