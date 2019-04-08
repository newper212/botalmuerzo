var sql = require("mssql");
var someVar = [];
var dbConfig = {
    server: "almuerzofalabella.database.windows.net", // Use your SQL server name
    database: "almuerzofalabella", // Database to connect to
    user: "_pyrojasp", // Use your username
    password: "pass@word1", // Use your password
    port: 1433,
    // Since we're on Windows Azure, we need to set the following options
    options: {
          encrypt: true
      }
   };
  
   // This function connects to a SQL server, executes a SELECT statement,
   // and displays the results in the console.
   async function getCustomers(dia) {
    // Create connection instance
    var conn = new sql.ConnectionPool(dbConfig);
    
    conn.connect()
    // Successfull connection
    .then(function () {
   
      // Create request instance, passing in connection instance
      var req = new sql.Request(conn);
      req.input('fecha', sql.VarChar, dia)
      // Call mssql's query method passing in params
     req.query("SELECT * FROM almuerzo where Convert(varchar(10),CONVERT(date,fecha,106),103)=@fecha")
     // req.query(`select * from almuerzo`)
      .then(function (recordset) {
       // console.log(recordset['recordset'][0]['Id']);
      // someVar=recordset;
       setValue(recordset);
        conn.close();
      })
      // Handle sql statement execution errors
      .catch(function (err) {
        console.log(err);
        conn.close();
      })
   
    })
    // Handle connection errors
    .catch(function (err) {
      console.log(err);
      conn.close();
    });
   }
   
   
  

 
async function llamardia (dia) {
    try {
        
        let pool = await sql.connect(dbConfig)
       //pool.connect()
        let result1 = await pool.request()
            .input('fecha', sql.VarChar, dia)
            .query('SELECT * FROM almuerzo where Convert(varchar(10),CONVERT(date,fecha,106),103)=@fecha')
            sql.close();
        return result1;
        //console.dir(result1)
       
    } catch (err) {
        console.log('error: '+err);
    }
}


/*
(async() => {
    console.log('1')
   var esperar= await llamardia('01/04/2019')  
    console.log(esperar)
  })()*/

module.exports.llamardia=llamardia;