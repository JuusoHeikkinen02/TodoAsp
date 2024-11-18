using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private IConfiguration _configuration;

        public TaskController(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        [HttpGet]
        [Route("GetTasks")]

        //Funktio jolla saadaan tietokannasta tehtävän tiedot
        public JsonResult GetTasks()
        {
            string query = "select * from dbo.Task";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand MyCommand = new SqlCommand(query, myCon))
                {
                    myReader = MyCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }
        [HttpGet]
        [Route("GetTasksWithDetails")]
        //Funktio jolla saadaan Tehtävä ja siihen liittyvät tag, status ja aktiviteetti nimet
        public JsonResult GetTasksWithDetails()
        {
            string query = @"
                    SELECT 
                        Task.*, 
                        Tag.Name AS TagName,
                        Status.Name AS StatusName,
                        ActivityType.Name AS ActivityTypeName
                    FROM 
                        dbo.Task 
                    INNER JOIN 
                        dbo.Tag ON Task.TagId = Tag.Id
                    INNER JOIN 
                        dbo.Status ON Task.StatusId = Status.Id
                    INNER JOIN 
                        dbo.ActivityType ON Task.ActivityTypeId = ActivityType.Id";

            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand MyCommand = new SqlCommand(query, myCon))
                {
                    myReader = MyCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetActivityWithDetails")]
        //Funktio jolla saadaan Tehtävä ja siihen liittyvät tag, status ja aktiviteetti nimet
        public JsonResult GetActivityWithDetails()
        {
            string query = @"
                    SELECT 
                        Activity.*, 
                        Tag.Name AS TagName,
                        Status.Name AS StatusName,
                        ActivityType.Name AS ActivityTypeName
                    FROM 
                        dbo.Activity 
                    INNER JOIN 
                        dbo.Tag ON Activity.TagId = Tag.Id
                    INNER JOIN 
                        dbo.Status ON Activity.StatusId = Status.Id
                    INNER JOIN 
                        dbo.ActivityType ON Activity.ActivityTypeId = ActivityType.Id";

            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand MyCommand = new SqlCommand(query, myCon))
                {
                    myReader = MyCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpPost]
        [Route("AddTask")]

        public IActionResult AddTask([FromBody] JObject data)
        {
            Task task = data.ToObject<Task>();
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                int TagId = InsertTag(task.TagName, task.TagTheme);

                int statusId = InsertStatus(task.StatusName, task.StatusTheme);

                int ActivityTypeId = InsertActivityType(task.ActivityTypeName);

                string insertQuery = "INSERT INTO Task (Name, Description, StartDate, EndDate, TagId, StatusId, ActivityTypeId) " +
                                "VALUES (@Name, @Description, @StartDate, @EndDate, @TagId, @StatusId, @ActivityTypeId)";


                using (SqlCommand MyCommand = new SqlCommand(insertQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Name", task.Name);
                    MyCommand.Parameters.AddWithValue("@Description",  task.Description ?? DBNull.Value.ToString());
                    MyCommand.Parameters.AddWithValue("@StartDate", task.StartDate);
                    MyCommand.Parameters.AddWithValue("@EndDate", task.EndDate);
                    MyCommand.Parameters.AddWithValue("@TagId", TagId);
                    MyCommand.Parameters.AddWithValue("@StatusId", statusId);
                    MyCommand.Parameters.AddWithValue("@ActivityTypeId", ActivityTypeId);
                    myReader = MyCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Lisäys onnistui");


        }

        //Funktiolla voidaan lisätä uusi aktiviteetti 
        
        [HttpPost]
        [Route("AddActivity")]
        
        public IActionResult AddActivity([FromBody] JObject data)
        {
            Console.WriteLine(data);
            //string Name, string? Description, string? Url, DateTime StartDate, DateTime EndDate, string TagName, string TagTheme, string StatusName, string StatusTheme, string ActivityName
            Activity activity = data.ToObject<Activity>();
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                //Luodaan samalla muiden pöytien data
                int TagId = InsertTag(activity.TagName, activity.TagTheme);

                int statusId = InsertStatus(activity.StatusName, activity.StatusTheme);

                int ActivityTypeId = InsertActivityType(activity.ActivityTypeName);

                string insertQuery = "INSERT INTO Activity (Name, Description, Url, StartDate, EndDate, TagId, StatusId, ActivityTypeId) " +
                                "VALUES (@Name, @Description, @Url, @StartDate, @EndDate, @TagId, @StatusId, @ActivityTypeId)";


                using (SqlCommand MyCommand = new SqlCommand(insertQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Name", activity.Name);
                    MyCommand.Parameters.AddWithValue("@Description", activity.Description ?? DBNull.Value.ToString());
                    MyCommand.Parameters.AddWithValue("@Url", activity.Url ?? DBNull.Value.ToString());
                    MyCommand.Parameters.AddWithValue("@StartDate", activity.StartDate);
                    MyCommand.Parameters.AddWithValue("@EndDate", activity.EndDate);
                    MyCommand.Parameters.AddWithValue("@TagId", TagId);
                    MyCommand.Parameters.AddWithValue("@StatusId", statusId);
                    MyCommand.Parameters.AddWithValue("@ActivityTypeId", ActivityTypeId);
                    myReader = MyCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Lisäys onnistui");


        }
        //Tällä saadaan lisättyä aktiviteettityyppi kun tehdään uutta aktiviteettiä
        private int InsertActivityType(string ActivityName)
        {
            string insertStatusQuery = "INSERT INTO ActivityType (Name) OUTPUT INSERTED.Id VALUES (@ActivityName) ";

            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(insertStatusQuery, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ActivityName", ActivityName);
                    
                    int ActivityTypeId = (int)myCommand.ExecuteScalar();
                    myCon.Close();
                    return ActivityTypeId;
                }
            }

        }

        //täällä saadaan status luotua samalla kun tehdään uusi Task tai Activity
        private int InsertStatus(string StatusName, string StatusTheme)
        {
            string insertStatusQuery = "INSERT INTO Status (Name, Theme) OUTPUT INSERTED.Id VALUES (@StatusName, @StatusTheme) ";
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(insertStatusQuery, myCon))
                {
                    myCommand.Parameters.AddWithValue("@StatusName", StatusName);
                    myCommand.Parameters.AddWithValue("@StatusTheme", StatusTheme);
                    int statusId = (int)myCommand.ExecuteScalar();
                    myCon.Close();
                    return statusId;
                }
            }

        }

        //täällä saadaan Tägi luotua samalla kun tehdään uusi Task tai Activity
        private int InsertTag(string TagName, string TagTheme)
        {

            string insertTagQuery = "INSERT INTO Tag (Name, Theme) OUTPUT INSERTED.Id VALUES (@TagName, @TagTheme) ";

            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(insertTagQuery, myCon))
                {
                    myCommand.Parameters.AddWithValue("@TagName", TagName);
                    myCommand.Parameters.AddWithValue("@TagTheme", TagTheme);
                    
                    int TagId = (int)myCommand.ExecuteScalar();
                    myCon.Close();
                    return TagId;
                }
            }

        }

        //Funktio jolla voidaan poistaa tehtävä ja sen pitäisi samalla poistaa status ja tagi 
        [HttpDelete]
        [Route("DeleteTask")]

        public JsonResult DeleteTask(int Id)
        {
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();

                //Hankitaan tehtävän avulla näille arvot jotta ne voidaan myös poistaa
                int TagId;
                int StatusId;
                int ActivityTypeId;

                string getIdsQuery = "SELECT TagId, StatusId, ActivityTypeId FROM Task WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(getIdsQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", Id);

                    using (SqlDataReader reader = MyCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            TagId = reader.GetInt32(0);
                            StatusId = reader.GetInt32(1);
                            ActivityTypeId = reader.GetInt32(2);
                        }
                        else
                        {
                            // Task not found
                            return new JsonResult("Tehtävää ei löytynyt");
                        }
                    }
                }
                // Tehtävän poisto
                string deleteTaskQuery = "DELETE FROM Task WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(deleteTaskQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", Id);
                    MyCommand.ExecuteNonQuery();

                }
                //Lopuksi poistetaan tag, status ja akTyyppi joka oli yhdessä tehtävän kanssa
                DeleteTag(TagId);
                DeleteStatus(StatusId);
                DeleteActivityType(ActivityTypeId);

                myCon.Close();

            }
            return new JsonResult(" Tehtävä poistettu onnistuneesti");
        }

        //Funktio jolla voidaan poistaa tehtävä ja sen pitäisi samalla poistaa status, tagi ja aktiviteettiTyyppi 
        [HttpDelete]
        [Route("DeleteActivity")]

        public JsonResult DeleteActivity(int Id)
        {
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();

                //Hankitaan tehtävän avulla näille arvot jotta ne voidaan myös poistaa
                int TagId;
                int StatusId;
                int ActivityTypeId;

                string getIdsQuery = "SELECT TagId, StatusId, ActivityTypeId FROM Activity WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(getIdsQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", Id);

                    using (SqlDataReader reader = MyCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            TagId = reader.GetInt32(0);
                            StatusId = reader.GetInt32(1);
                            ActivityTypeId = reader.GetInt32(2);
                        }
                        else
                        {
                            // Aktiviteettiä ei löydy
                            return new JsonResult("Aktiviteettiä ei löytynyt");
                        }
                    }
                }

                // Tehtävän poisto
                string deleteTaskQuery = "DELETE FROM Activity WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(deleteTaskQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", Id);
                    MyCommand.ExecuteNonQuery();

                }
                //lopuksi poistetaan tag,status ja akTyyppi joka oli yhdessä aktiviteetin kanssa
                DeleteTag(TagId);
                DeleteStatus(StatusId);
                DeleteActivityType(ActivityTypeId);




            }
            return new JsonResult("aktiviteetti poistettu onnistuneesti");
        }

        //Komento jolla poistetaan tägi samalla kun tehtävä poistuu
        private void DeleteTag(int Id)
        {
            string deleteTagQuery = "DELETE FROM dbo.Tag WHERE Id = @Id";
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand deleteCommand = new SqlCommand(deleteTagQuery, myCon))
                {

                    deleteCommand.Parameters.AddWithValue("@Id", Id);
                    deleteCommand.ExecuteNonQuery();
                    myCon.Close();

                }
            }

        }
        //Funktio jolla saadaan poistettua status kun tehtävä tai aktiviteetti poistetaan
        private void DeleteStatus(int Id)
        {
            string deleteStatusQuery = "DELETE FROM dbo.Status WHERE Id = @Id";
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand deleteCommand = new SqlCommand(deleteStatusQuery, myCon))
                {

                    deleteCommand.Parameters.AddWithValue("@Id", Id);
                    deleteCommand.ExecuteNonQuery();
                    myCon.Close();

                }
            }

        }

        //Komento jolla poistetaan AktiviteettiTyyppi samalla kun Aktiviteetti poistuu
        private void DeleteActivityType(int Id)
        {
            string deleteActivityTypeQuery = "DELETE FROM dbo.ActivityType WHERE Id = @Id";
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand deleteCommand = new SqlCommand(deleteActivityTypeQuery, myCon))
                {

                    deleteCommand.Parameters.AddWithValue("@Id", Id);
                    deleteCommand.ExecuteNonQuery();
                    myCon.Close();

                }
            }

        }

        //Tehtävän tiedon muokkaus
        [HttpPut]
        [Route("EditTask")]
        public JsonResult EditTask([FromBody] JObject data)
        {
            Console.WriteLine(data);
            //int Id, string Name, string? Description, DateTime StartDate, DateTime EndDate, string TagName, string TagTheme, string StatusName, string StatusTheme, string ActivityTypeName
            EditTask task = data.ToObject<EditTask>();
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                //Hankitaan tehtävän avulla näille arvot jotta ne voidaan myös muokata
                int TagId;
                int StatusId;
                int ActivityTypeId;

                string getIdsQuery = "SELECT TagId, StatusId, ActivityTypeId FROM Task WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(getIdsQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", task.Id);

                    using (SqlDataReader reader = MyCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            TagId = reader.GetInt32(0);
                            StatusId = reader.GetInt32(1);
                            ActivityTypeId = reader.GetInt32(2);
                        }
                        else
                        {
                            // Task not found
                            return new JsonResult("Tehtävää ei löytynyt");
                        }
                    }
                }


                // Muokataan myös tagi ja status, jotka ovat yhteydessä tehtävään
                EditTag(TagId, task.TagName, task.TagTheme);

                EditStatus(StatusId, task.StatusName, task.StatusTheme);

                EditActivityType(ActivityTypeId, task.ActivityTypeName);




                //Sitten kun tehtävä löytyy voimme muokata sitä
                string updateQuery = "UPDATE Task SET Name = @Name, Description = @Description, StartDate = @StartDate, EndDate = @EndDate, TagId = @TagId, StatusId = @StatusId, ActivityTypeId = @ActivityTypeId WHERE Id = @Id";

                using (SqlCommand MyCommand = new SqlCommand(updateQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", task.Id);
                    MyCommand.Parameters.AddWithValue("@Name", task.Name);
                    MyCommand.Parameters.AddWithValue("@Description", task.Description ?? DBNull.Value.ToString());
                    MyCommand.Parameters.AddWithValue("@StartDate", task.StartDate);
                    MyCommand.Parameters.AddWithValue("@EndDate", task.EndDate);
                    MyCommand.Parameters.AddWithValue("@TagId", TagId);
                    MyCommand.Parameters.AddWithValue("@StatusId", StatusId);
                    MyCommand.Parameters.AddWithValue("@ActivityTypeId", ActivityTypeId);

                    int rowsAffected = MyCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Task updated successfully");

                    }
                    else
                    {
                        return new JsonResult("Task not found or no changes made");
                    }


                }


            }
        }

        //Tehtävän tiedon muokkaus
        [HttpPut]
        [Route("EditActivity")]
        public JsonResult EditActivity([FromBody] JObject data)
        {
            EditActivity activity = data.ToObject<EditActivity>();
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                //Hankitaan tehtävän avulla näille arvot jotta ne voidaan myös muokata
                int TagId;
                int StatusId;
                int ActivityTypeId;

                string getIdsQuery = "SELECT TagId, StatusId, ActivityTypeId FROM Activity WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(getIdsQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", activity.Id);

                    using (SqlDataReader reader = MyCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            TagId = reader.GetInt32(0);
                            StatusId = reader.GetInt32(1);
                            ActivityTypeId = reader.GetInt32(2);
                        }
                        else
                        {
                            return new JsonResult("Aktiviteettiä ei löytynyt");
                        }
                    }
                }


                // Muokataan myös tagi, status ja akTyyppi, jotka ovat yhteydessä tehtävään
                EditTag(TagId, activity.TagName, activity.TagTheme);

                EditStatus(StatusId, activity.StatusName, activity.StatusTheme);

                EditActivityType(ActivityTypeId, activity.ActivityTypeName);



                //Sitten kun tehtävä löytyy voimme muokata sitä
                string updateQuery = "UPDATE Activity SET Name = @Name, Description = @Description,Url = @Url, StartDate = @StartDate, EndDate = @EndDate, TagId = @TagId, StatusId = @StatusId, ActivityTypeId = @ActivityTypeId WHERE Id = @Id";

                using (SqlCommand MyCommand = new SqlCommand(updateQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", activity.Id);
                    MyCommand.Parameters.AddWithValue("@Name", activity.Name);
                    MyCommand.Parameters.AddWithValue("@Description", activity.Description ?? DBNull.Value.ToString());
                    MyCommand.Parameters.AddWithValue("@Url", activity.Url ?? DBNull.Value.ToString());
                    MyCommand.Parameters.AddWithValue("@StartDate", activity.StartDate);
                    MyCommand.Parameters.AddWithValue("@EndDate", activity.EndDate);
                    MyCommand.Parameters.AddWithValue("@TagId", TagId);
                    MyCommand.Parameters.AddWithValue("@StatusId", StatusId);
                    MyCommand.Parameters.AddWithValue("@ActivityTypeId", ActivityTypeId);

                    int rowsAffected = MyCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Aktiviteetin päivitys onnistui");

                    }
                    else
                    {
                        return new JsonResult("Aktiviteettia ei löytynyt tai muutoksia ei tehty");
                    }


                }


            }
        }


        private void EditTag(int Id, string TagName, string TagTheme)
        {

            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                string updateQuery = "UPDATE Tag SET Name = @NewTagName, Theme = @NewTagTheme WHERE Id = @Id";
                using (SqlCommand myCommand = new SqlCommand(updateQuery, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", Id);
                    myCommand.Parameters.AddWithValue("@NewTagName", TagName);
                    myCommand.Parameters.AddWithValue("@NewTagTheme", TagTheme);

                    myCommand.ExecuteNonQuery();



                }
            }


        }

        private void EditStatus(int Id, string StatusName, string StatusTheme)
        {

            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                string updateQuery = "UPDATE Status SET Name = @NewStatusName, Theme = @NewStatusTheme WHERE Id = @Id";
                using (SqlCommand myCommand = new SqlCommand(updateQuery, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", Id);
                    myCommand.Parameters.AddWithValue("@NewStatusName", StatusName);
                    myCommand.Parameters.AddWithValue("@NewStatusTheme", StatusTheme);
                    myCommand.ExecuteNonQuery();



                }
            }

        }

        private void EditActivityType(int Id, string ActivityTypeName)
        {

            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                string updateQuery = "UPDATE ActivityType SET Name = @TypeName WHERE Id = @Id";
                using (SqlCommand myCommand = new SqlCommand(updateQuery, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", Id);
                    myCommand.Parameters.AddWithValue("@TypeName", ActivityTypeName);


                    myCommand.ExecuteNonQuery();



                }
            }


        }

    
        //Tehtävän tiedon muokkaus
        [HttpPut]
        [Route("MarkTaskDone")]
        public JsonResult MarkTaskDone([FromBody] JObject data)
        {
            Console.WriteLine(data);
            //int Id, string Name, string? Description, DateTime StartDate, DateTime EndDate, string TagName, string TagTheme, string StatusName, string StatusTheme, string ActivityTypeName
            MarkDone task = data.ToObject<MarkDone>();
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                //Hankitaan tehtävän avulla näille arvot jotta ne voidaan myös muokata
               
                int StatusId;
              
                DateTime DoneDate;

                string getIdsQuery = "SELECT  StatusId FROM Task WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(getIdsQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", task.Id);

                    using (SqlDataReader reader = MyCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                         
                            StatusId = reader.GetInt32(0);
                            
                        }
                        else
                        {
                            // Task not found
                            return new JsonResult("Tehtävää ei löytynyt");
                        }
                    }
                }


              

                EditStatus(StatusId,"Done","Done");
               

       

                //Sitten kun tehtävä löytyy voimme muokata sitä
                string updateQuery = "UPDATE Task SET StatusId = @StatusId, DoneDate=@DoneDate WHERE Id = @Id";

                using (SqlCommand MyCommand = new SqlCommand(updateQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", task.Id);
                    MyCommand.Parameters.AddWithValue("@StatusId", StatusId);
                    MyCommand.Parameters.AddWithValue("@DoneDate", task.DoneDate);

                    int rowsAffected = MyCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Task updated successfully");

                    }
                    else
                    {
                        return new JsonResult("Task not found or no changes made");
                    }


                }


            }
        }

        [HttpPut]
        [Route("MarkActivityDone")]
        public JsonResult MarkActivityDone([FromBody] JObject data)
        {
            Console.WriteLine(data);
            //int Id, string Name, string? Description, DateTime StartDate, DateTime EndDate, string TagName, string TagTheme, string StatusName, string StatusTheme, string ActivityTypeName
            MarkDone task = data.ToObject<MarkDone>();
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("taskDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                //Hankitaan tehtävän avulla näille arvot jotta ne voidaan myös muokata

                int StatusId;

                DateTime DoneDate;

                string getIdsQuery = "SELECT  StatusId FROM Activity WHERE Id = @Id";
                using (SqlCommand MyCommand = new SqlCommand(getIdsQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", task.Id);

                    using (SqlDataReader reader = MyCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {

                            StatusId = reader.GetInt32(0);

                        }
                        else
                        {
                            // Task not found
                            return new JsonResult("Tehtävää ei löytynyt");
                        }
                    }
                }




                EditStatus(StatusId, "Done", "Done");




                //Sitten kun tehtävä löytyy voimme muokata sitä
                string updateQuery = "UPDATE Activity SET StatusId = @StatusId, DoneDate=@DoneDate WHERE Id = @Id";

                using (SqlCommand MyCommand = new SqlCommand(updateQuery, myCon))
                {
                    MyCommand.Parameters.AddWithValue("@Id", task.Id);
                    MyCommand.Parameters.AddWithValue("@StatusId", StatusId);
                    MyCommand.Parameters.AddWithValue("@DoneDate", task.DoneDate);

                    int rowsAffected = MyCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Task updated successfully");

                    }
                    else
                    {
                        return new JsonResult("Task not found or no changes made");
                    }


                }


            }
        }






    }
}
