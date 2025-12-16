import express from "express";

const app = express();
const PORT = 3000;


// Route: /home
app.get("/home", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1 style="color: green;">Welcome to the Home Page</h1>
      </body>
    </html>
  `);
});


// Route: /about
app.get("/about", (req, res) => {
  res.send("This is the about page of my Express application.");
});

// Route: /students/:studentId/?department=
app.get("/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  const { department } = req.query;

  const student = {
    id: studentId,
    department: department || "Not specified"
  };

  res.json(student);
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
