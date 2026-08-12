/* ==========================================================================
   SPOTIFY WEB API INTEGRATION HELPER
   Fetch album pictures, track artwork, and metadata dynamically from Spotify
   ========================================================================== */

/**
 * Get an Access Token from Spotify API using Client Credentials Flow
 * @param {string} clientId - Your Spotify Client ID
 * @param {string} clientSecret - Your Spotify Client Secret
 * @returns {Promise<string>} Access Token
 */
export async function getSpotifyAccessToken(clientId, clientSecret) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    return null;
  }
}

/**
 * Search Spotify for a track and return its high-res album cover picture URL
 * @param {string} query - Song title and artist (e.g., "Tum Hi Ho Arijit Singh")
 * @param {string} accessToken - Spotify Access Token
 * @returns {Promise<{albumCover: string, artist: string, durationMs: number} | null>}
 */
export async function fetchSpotifyTrackInfo(query, accessToken) {
  if (!accessToken) return null;
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();
    const track = data.tracks?.items?.[0];
    if (!track) return null;

    return {
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      albumCover: track.album?.images?.[0]?.url || null,
      albumName: track.album?.name,
      durationMs: track.duration_ms
    };
  } catch (error) {
    console.error('Error searching Spotify track:', error);
    return null;
  }
}
