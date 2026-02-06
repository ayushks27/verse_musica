const createBtn = document.getElementById('createBtn');
const playlistModal = document.getElementById('playlistModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const songListDiv = document.querySelector('.song-list');

const songs = [
  { title: "Treat You Better", artist: "Shawn Mendes" },
  { title: "Counting Stars", artist: "One Republic" },
  { title: "One Call Away", artist: "Charlie Puth" },
  { title: "Just the Way You Are", artist: "Bruno Mars" }
];

// Function to generate song checkboxes dynamically
function generateSongList() {
  songListDiv.innerHTML = '';  // Clear existing

  songs.forEach((song, index) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = `${song.title} - ${song.artist}`;
    checkbox.id = `song_${index}`;

    label.htmlFor = checkbox.id;
    label.appendChild(checkbox);
    label.append(` ${song.title} - ${song.artist}`);

    songListDiv.appendChild(label);
  });
}

createBtn.addEventListener('click', () => {
  generateSongList();  // regenerate every time modal opens, in case songs list changed
  playlistModal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  playlistModal.classList.add('hidden');
});

const savedPlaylistsDiv = document.getElementById('savedPlaylists');

saveBtn.addEventListener('click', () => {
  const name = document.getElementById('playlistName').value.trim();
  const checkedSongs = Array.from(document.querySelectorAll('.song-list input:checked'))
    .map(input => input.value);

  if (!name) {
    alert('Please enter a playlist name.');
    return;
  }

  if (checkedSongs.length === 0) {
    alert('Please select at least one song.');
    return;
  }

  document.getElementById('introSection').classList.add('hidden');

  // Create playlist display
  const playlistDiv = document.createElement('div');
  playlistDiv.classList.add('playlist');

  const heading = document.createElement('h3');
  heading.textContent = name;

  const songList = document.createElement('ul');
  checkedSongs.forEach(song => {
    const li = document.createElement('li');
    li.textContent = song;
    songList.appendChild(li);
  });

  playlistDiv.appendChild(heading);
  playlistDiv.appendChild(songList);
  savedPlaylistsDiv.appendChild(playlistDiv); // Append to visible section

  // Hide modal and reset
  playlistModal.classList.add('hidden');
  document.getElementById('playlistName').value = '';
  document.querySelectorAll('.song-list input').forEach(input => input.checked = false);
});


