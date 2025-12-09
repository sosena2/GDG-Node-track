const http = require("http");

// create server
const server = http.createServer((req, res)=>{
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url ==='/'){
    res.end(JSON.stringify({message: 'Welcome to the Home page'}));
  }
  else if(req.method === 'GET' && req.url === '/info'){
    res.end(JSON.stringify({message: "This is the information page"}));
  }
  else if(req.method === 'POST' && req.url === '/submit'){
    let body = '';

    req.on('data', chunk=>{
      body += chunk.toString();
    });

    req.on('end', ()=>{
    
      const data = JSON.parse(body);
      res.end(JSON.stringify(data));
    });
    
    }
    else{
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'Routr not found'}));
    }
    
  }
)
// start server on port 3000
server.listen(3000, ()=>{
  console.log('server running on port 3000')
});