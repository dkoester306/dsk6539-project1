// const savedSongs = {};
// const savedAlbums = {};
// const savedPlaylists = {};
const customPlaylists = {
  playlists: [],
};

const respondJSON = (request, response, content, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const successContent = (messageString) => {
  const jsonContent = {
    message: messageString,
  };
  return jsonContent;
};

const errorContent = (messageString, idString) => {
  const jsonContent = {
    message: messageString,
    id: idString,
  };
  return jsonContent;
};

const getMyPlaylists = (request, response) => {
  const responseContent = {
    customPlaylists,
  };
  return respondJSON(request, response, responseContent, 200);
};

const addCustomPlaylist = (request, response, body) => {
  if (!body.title) {
    const respondContent = errorContent('Name is required.', 'missingParams');
    return respondJSON(request, response, respondContent, 400);
  }

  let responseCode = 201;
  // check all entries to find if the name already exists
  let isNewEntry = true;
  for (let i = 0; i < customPlaylists.playlists.length; i++) {
    if (customPlaylists.playlists[i].title === body.title) {
      responseCode = 204;
      isNewEntry = false;
      break;
    }
  }

  if (isNewEntry) {
    const newEntry = {
      title: body.title,
      song: [],
    };
    customPlaylists.playlists.push(newEntry);
  }

  if (responseCode === 201) {
    const respondContent = successContent('Created Playlist successfully!');
    return respondJSON(request, response, respondContent, responseCode);
  }

  return respondJSONMeta(request, response, responseCode);
};

const addSongToPlaylist = (request, response, body) => {
  // find which index matches the playlist params
  let playlistIndex = 0;
  let trackBody = null;
  try{
    trackBody = JSON.parse(body.track);
  }
  catch(err){
      console.log(err);
      return;
  }

  for (let i = 0; i < customPlaylists.playlists.length; i++) {
    if (customPlaylists.playlists[i].title === body.playlist) {
      playlistIndex = i;
      break;
    }
  }

  const trackName = trackBody.name;
  let trackArtists = '';

  for (let i = 0; i < trackBody.artists.length; i++) {
    if (i !== 0) {
      trackArtists += ', ';
    }
    trackArtists += `${trackBody.artists[i].name}`;
  }
  // get names from data
  const trackAlbum = trackBody.album.name;
  const trackLink = trackBody.external_urls.spotify;

  // console.log(`Name: ${trackName} Artists: ${trackArtists} Album: ${trackAlbum}`);

  const newEntry = {
    name: trackName,
    artists: trackArtists,
    album: trackAlbum,
    link: trackLink,
  };
  let responseCode = 201;

  // check if song title already exists
  for (let i = 0; i < customPlaylists.playlists[playlistIndex].song.length; i++) {
    if (customPlaylists.playlists[playlistIndex].song[i].name === trackName) {
      console.log('here');
      responseCode = 204;
      break;
    }
  }

  if (responseCode === 201) {
    // add new entry to the
    customPlaylists.playlists[playlistIndex].song.push(newEntry);
    const respondContent = successContent(`Added song to playlist ${body.playlist}`);
    return respondJSON(request, response, respondContent, responseCode);
  }

  return respondJSONMeta(request, response, responseCode);
};


module.exports = {
  getMyPlaylists,
  addCustomPlaylist,
  addSongToPlaylist,
};
