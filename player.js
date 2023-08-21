let ctrlIcon = document.getElementById("ctrlIcon");
let progressbar = document.getElementById("progress-bar");
let song = document.getElementById("song");
let currentTimeStamp = document.getElementById("current-time");
let durationStamp = document.getElementById("duration");

song.onloadeddata = function () {
    progressbar.max = song.duration;
    durationStamp.textContent = formatTime(song.duration);
    progressbar.value = song.currentTime;
    currentTimeStamp.textContent = formatTime(song.currentTime);
}

function playPause() {
    if (ctrlIcon.classList.contains("fa-pause")) {
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
    } else {
        ctrlIcon.classList.add("fa-pause");
        ctrlIcon.classList.remove("fa-play");
        song.play();
    }
}

if (song.played) {
    setInterval(() => {
        progressbar.value = song.currentTime;
        currentTimeStamp.textContent = formatTime(song.currentTime);
    }, 500);
}

progressbar.oninput = function () {
    song.play();
    song.currentTime = progressbar.value;
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
    song.play();
}

function formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

  // =======lyrics_Fetching==========

async function fetchLyrics() {
  const options = {
    method: "GET",
    url: "https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/",
    params: {
      id: "7394358",
      text_format: "plain",
    },
    headers: {
      "X-RapidAPI-Key": "8287970320msh7bd230a888c4801p14fb11jsn34d1957fba57",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const lyrics = response.data.lyrics.lyrics.body.plain;

    const stanzas = lyrics.split("\n\n"); // Split lyrics into stanzas

    let formattedLyrics = '';
    for (const stanza of stanzas) {
      const lines = stanza.split("\n"); // Split stanza into lines

      for (const line of lines) {
        formattedLyrics += line.trim() + "<br>"; // Add line breaks
      }

      formattedLyrics += "<br>"; // Add stanza breaks
    }

    songLyrics.innerHTML = formattedLyrics;
  } catch (error) {
    console.error(error);
  }
}

// Call the fetchLyrics function immediately to fetch and display the lyrics
fetchLyrics();

const lyricsTab = document.querySelector('.lyrics-tab');
const otherAlbumTab = document.querySelector('.other-album-tab');
const relatedArtistTab = document.querySelector('.related-artist-tab');

const lyricsContainer = document.querySelector('.lyrics-container');
const otherAlbumContainer = document.querySelector('.other-album-container');
const relatedArtistContainer = document.querySelector('.related-artist-container');


lyricsTab.addEventListener('click', () => {
  lyricsContainer.style.display = 'block';
  otherAlbumContainer.style.display = 'none';
  relatedArtistContainer.style.display = 'none';

  // Apply bold font to the clicked tab
  lyricsTab.classList.add('bold');
  otherAlbumTab.classList.remove('bold');
  relatedArtistTab.classList.remove('bold');
});

otherAlbumTab.addEventListener('click', () => {
  lyricsContainer.style.display = 'none';
  otherAlbumContainer.style.display = 'block';
  relatedArtistContainer.style.display = 'none';

  // Apply bold font to the clicked tab
  lyricsTab.classList.remove('bold');
  otherAlbumTab.classList.add('bold');
  relatedArtistTab.classList.remove('bold');
});

relatedArtistTab.addEventListener('click', () => {
  // Implement the functionality for the "Related Artist" tab if needed
  lyricsContainer.style.display = 'none';
  otherAlbumContainer.style.display = 'none';
  relatedArtistContainer.style.display = 'block';

  // Apply bold font to the clicked tab
  lyricsTab.classList.remove('bold');
  otherAlbumTab.classList.remove('bold');
  relatedArtistTab.classList.add('bold');
});


//related artist

async function fetchRelatedArtists() {
  const url = 'https://spotify23.p.rapidapi.com/artist_related/?id=06HL4z0CvFAxyc27GXpf02';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8287970320msh7bd230a888c4801p14fb11jsn34d1957fba57',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    const relatedArtistsContainer = document.querySelector('.related-artists-carousel');

    if (responseData && responseData.artists) {
      responseData.artists.forEach(artist => {
        const artistContainer = document.createElement('div');
        artistContainer.classList.add('artist');

        const artistLink = document.createElement('a');
        artistLink.href = artist.external_urls.spotify;

        const artistImage = document.createElement('img');
        artistImage.src = artist.images[0].url;
        artistImage.alt = artist.name;

        const artistName = document.createElement('p');
        artistName.classList.add('artist-name');
        artistName.textContent = artist.name;

        artistLink.appendChild(artistImage);

        artistContainer.appendChild(artistLink);
        artistContainer.appendChild(artistName);

        relatedArtistsContainer.appendChild(artistContainer);
      });

      $('.related-artists-carousel').owlCarousel({
        center: true,
        items: 3,
        loop: true,
        responsive: {
          768: {
            items: 3
          },
          480: {
            items: 1
          }
        }
      });

    } else {
      console.error('Invalid response format');
    }

  } catch (error) {
    console.error(error);
  }
}

async function fetchArtistAlbums() {
  const url = 'https://spotify23.p.rapidapi.com/artist_albums/?id=06HL4z0CvFAxyc27GXpf02&offset=0&limit=100';

const options = {
method: 'GET',
headers: {
  'X-RapidAPI-Key': '8287970320msh7bd230a888c4801p14fb11jsn34d1957fba57',
  'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const responseData = await response.json();

const albumList = document.getElementById('album-list');

if (responseData && responseData.data && responseData.data.artist && responseData.data.artist.discography && responseData.data.artist.discography.albums && responseData.data.artist.discography.albums.items) {
  responseData.data.artist.discography.albums.items.forEach(albumItem => {
    const album = albumItem.releases.items[0];

    const albumContainer = document.createElement('div');
    albumContainer.classList.add('album');

    const albumImage = document.createElement('img');
    albumImage.src = album.coverArt.sources[0].url;

    const albumInfo = document.createElement('div');
    albumInfo.classList.add('album-info');

    const albumName = document.createElement('p');
    albumName.classList.add('album-name');
    albumName.textContent = album.name;

    const releaseDate = document.createElement('p');
    releaseDate.classList.add('release-date');
    releaseDate.textContent =  `${album.date.year}`;

    albumInfo.appendChild(albumName);
    albumInfo.appendChild(releaseDate);

    albumContainer.appendChild(albumImage);
    albumContainer.appendChild(albumInfo);

    albumList.appendChild(albumContainer);
  });

  $('.owl-carousel').owlCarousel({
    center: true,
    items: 3,
    loop: true,
    responsive: {
      768: {
        items: 3
      },
      480: {
        items: 1
      }
    }
  });
} else {
  console.error('Invalid response format');
}

} catch (error) {
console.error(error);
}
}

fetchRelatedArtists();
fetchArtistAlbums();
