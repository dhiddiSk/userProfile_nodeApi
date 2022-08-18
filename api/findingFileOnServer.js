const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { unescape } = require('querystring');

const mimeTypes = {
    'css': 'text/css',
    'html': 'text/html',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg'
};

const port = 5000;
const hostName = '127.0.0.1';

http.createServer((req, res) => {
    let myUri = url.parse(req.url).pathname;
    let filename = path.join(process.cwd(), unescape(myUri));
    try{
        loadFile = fs.lstatSync(filename);
    }
    catch (error){
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('page not found');
        res.end();
    }   
    
    if(loadFile.isFile()){
        var mimeType = mimeTypes[(path.extname(filename)).split('.').reverse()[0]];
        res.writeHead(200, {'Content-Type' : mimeType})
        let fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    }else if(loadFile.isDirectory() ){
        res.writeHead(302, {'Location': 'index.html'});
        res.end();
    }else{
        res.writeHead(500,{'Content-Type': 'text/plain'});
        res.write('Internal server error');
        res.end();
    }
}).listen(port,hostName, () => {
    console.log(`server is running at http://${hostName}:${port}`);
})
