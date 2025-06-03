// Sample song dataset, with dummy links & images
  

  const homepageView = document.getElementById('homepage-view');
  const songDetailView = document.getElementById('song-detail-view');
  const songsList = document.getElementById('songsList');
  const searchInput = document.getElementById('searchInput');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const shareModal = document.getElementById('shareModal');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const facebookShareBtn = document.getElementById('facebookShareBtn');
  const twitterShareBtn = document.getElementById('twitterShareBtn');
  const whatsappShareBtn = document.getElementById('whatsappShareBtn');

  // Song detail elements
  const detailThumb = document.getElementById('detailThumb');
  const songTitle = document.getElementById('songTitle');
  const songArtist = document.getElementById('songArtist');
  const songAlbum = document.getElementById('songAlbum');
  const downloadBtn = document.getElementById('downloadBtn');
  const listenBtn = document.getElementById('listenBtn');
  const shareBtn = document.getElementById('shareBtn');

  // Function to handle URL routing
  function handleRouting() {
    const url = new URL(window.location.href);
    const songId = url.searchParams.get('song');
    
    if (songId) {
      // If song ID is in URL, show that song's detail page
      const songIdNum = parseInt(songId);
      if (!isNaN(songIdNum)) {
        showSongDetail(songIdNum);
      }
    } else {
      // Otherwise, show homepage
      showHomePage();
    }
  }

  // Render song cards on homepage based on filtered songs
  function renderSongsList(filteredSongs) {
    songsList.innerHTML = '';

    if (filteredSongs.length === 0) {
      songsList.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;">No songs found matching your search.</p>';
      return;
    }

    filteredSongs.forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View details for ${song.title} by ${song.artist}`);
      card.innerHTML = `
        <img src="${song.thumbnail}" alt="Thumbnail for ${song.title}" class="song-thumb" />
        <h3 class="song-title">${song.title}</h3>
        <p class="song-artist">${song.artist}</p>
      `;
      card.onclick = () => navigateToSong(song.id);
      card.onkeypress = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigateToSong(song.id);
        }
      };
      songsList.appendChild(card);
    });
  }

  // Navigate to specific song page (updates URL)
  function navigateToSong(songId) {
    const url = new URL(window.location.href);
    url.searchParams.set('song', songId);
    window.history.pushState({songId}, '', url);
    showSongDetail(songId);
  }

  // Show song detail page
  function showSongDetail(songId) {
    const song = songs.find(s => s.id === songId);
    if (!song) {
      showHomePage();
      return;
    }

    document.title = `${song.title} by ${song.artist} - Music Download Hub`;
    
    homepageView.style.display = 'none';
    songDetailView.style.display = 'block';

    detailThumb.src = song.thumbnail;
    detailThumb.alt = `Thumbnail for ${song.title}`;
    songTitle.textContent = song.title;
    songArtist.textContent = `Artist: ${song.artist}`;
    songAlbum.textContent = `Album: ${song.album}`;

    downloadBtn.href = song.songFile;
    downloadBtn.setAttribute('download', `${song.title}.mp3`);
    listenBtn.href = song.listenLink;
    
    // Store current song ID for sharing
    shareBtn.dataset.songId = song.id;

    // Focus on download button
    downloadBtn.focus();
  }

  // Show homepage
  function showHomePage() {
    document.title = "Music Download Hub";
    songDetailView.style.display = 'none';
    homepageView.style.display = 'block';
    
    // Clear song parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('song');
    window.history.pushState({}, '', url);
    
    searchInput.focus();
  }

  // Filter songs by search input
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      renderSongsList(songs);
      return;
    }
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query)
    );
    renderSongsList(filtered);
  }

  // Handle back button
  backToHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showHomePage();
  });

  // Share functionality
  function openShareModal(songId) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    // Generate shareable URL for this song
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('song', songId);
    
    // Set the URL in the input field
    shareUrlInput.value = url.toString();
    
    // Configure share buttons
    const shareText = `Check out "${song.title}" by ${song.artist} on Music Download Hub!`;
    
    facebookShareBtn.onclick = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.toString())}`, 
        'facebook-share', 'width=580,height=296');
    };
    
    twitterShareBtn.onclick = () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url.toString())}`, 
        'twitter-share', 'width=550,height=235');
    };
    
    whatsappShareBtn.onclick = () => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url.toString())}`, 
        'whatsapp-share', 'width=600,height=500');
    };
    
    // Show the modal
    shareModal.style.display = 'flex';
    
    // Auto-select the URL for easy copying
    setTimeout(() => {
      shareUrlInput.select();
    }, 100);
  }

  shareBtn.addEventListener('click', function() {
    const songId = parseInt(this.dataset.songId);
    openShareModal(songId);
  });

  closeModalBtn.addEventListener('click', function() {
    shareModal.style.display = 'none';
  });

  // Close modal when clicking outside
  shareModal.addEventListener('click', function(event) {
    if (event.target === this) {
      shareModal.style.display = 'none';
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    handleRouting();
  });

  // Listen for search input changes
  searchInput.addEventListener('input', handleSearch);

  // Add copy functionality
  shareUrlInput.addEventListener('click', function() {
    this.select();
  });
  
  // Force download when clicking download button
  downloadBtn.addEventListener('click', function(e) {
    // The download attribute should handle this automatically,
    // but this reinforces the behavior
    const link = this.href;
    const fileName = this.getAttribute('download');
    
    // This will initiate the download immediately
    // No additional code needed as modern browsers handle
    // the download attribute properly
  });

  // Initial setup
  handleRouting();
  if (!window.location.search) {
    renderSongsList(songs);
  }