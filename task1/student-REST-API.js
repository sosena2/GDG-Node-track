const http = require('http');

let students = [];
let nextId = 1;

const server = http.createServer((req, res)=>{
  res.setHeader('Content-Type', 'application/json');

  // GET students

  if (req.method === 'GET' && req.url === '/students'){
    res.end(JSON.stringify(students));
  }

// POST students

  else if(req.method === 'POST' && req.url === '/students'){
    let body = '';
    req.on('data', chunk =>{
      body += chunk.toString();
    });

    req.on('end', ()=>{
      const data = JSON.parse(body);

      const newStudent = {
        id: nextId++,
        name: data.name
      };

      students.push(newStudent);
      res.end(JSON.stringify(newStudent));
    });
  }

  // PUT students

  else if(req.method === 'PUT' && req.url.startsWith('/students/')){
  
    const id = parseInt(url.split('/')[2]);
    const student = students.find(s=> s.id === id);

    if(!student){
      res.statusCode = 404;
      return res.end(JSON.stringify({error: 'Student not found'}));
    }

    // update the student info and return
    student.name = data.name;
    res.end(JSON.stringify(student));
  }

  // DELETE

  else if(req.method === 'DELETE' && req.url.startsWith('/students/')){
    const id = parseInt(url.split('/')[2]);

    const index = students.findIndex(s => s.id === id);

    if (!index){
      res.statusCode = 404;
      return res.end(JSON.stringify({error: 'Student not found'}));
    }
    students.splice(index, 1);

    res.end(JSON.stringify({message: `student ${id} deleted successfully`}));
  }
  else{
    res.statusCode = 404;
    res.end(JSON.stringify({error: 'Route not found'}));
  }
})

// start server

server.listen(4000, ()=>{
  console.log('Student API running on port 4000');
})