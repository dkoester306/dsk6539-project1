const http = require('http');
// const cors = require('cors');
const url = require('url');
const query = require('querystring');
// const cookieParser = require('cookie-parser');

const htmlHandler = require('./htmlResponses.js');
const responses = require('./responses.js');

// const clientId = '6211d589dd89434aba2398d090ccb59d'; // Your client id
// const clientSecret = '2deaa5a045144a6b87fa4a275b24a0ad'; // Your secret
// const redirectURI = 'http://localhost:3000/callback'; // Your redirect uri

const port = process.env.PORT || process.env.NODE_PORT || 3000;


const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getCustomPlaylist': responses.getMyPlaylists,
  },
  HEAD: {
  },
  POST: {
    '/addCustomPlaylist': responses.addCustomPlaylist,
    '/addSongToPlaylist': responses.addSongToPlaylist,
  },
};

const handleGet = (request, response, parsedUrl) => {
  // check if the path and method are valid
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  }

};


const handlePost = (request, response, parsedUrl) => {
  const res = response;

  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    const bodyParams = query.parse(bodyString);
    // check if path is method are valid
    if (urlStruct[request.method][parsedUrl.pathname]) {
      urlStruct[request.method][parsedUrl.pathname](request, response, bodyParams);
    }
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.log(`(Method: ${request.method}, URL: ${parsedUrl.pathname})`);

  switch (request.method) {
    case 'GET':
      handleGet(request, response, parsedUrl);
      break;
    case 'POST':
      handlePost(request, response, parsedUrl);
      break;
    default:
      break;
  }
};


http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
