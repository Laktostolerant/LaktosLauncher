const fetch = import('node-fetch');

async function getLatestGameVersion(gameId) {
    const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
    const apiUrl = 'https://objectstorage.eu-stockholm-1.oraclecloud.com/p/6UnP1A4TZQ1SRISGgW9xqTN3OrMPyTFv14IdN0ac4SGtsfNmNFNbjyqtXRCLt4dR/n/axwjvntskf9a/b/Game-Bucket/o/';
  
    try {
      console.log(`Checking for new version of game: ${gameId}`);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
  
      const versions = data.objects
        .map(obj => obj.name)
        .filter(name => name.startsWith(`${gameId}/Versions/Build-StandaloneWindows64-`))
        .map(name => {
          const versionMatch = name.match(/Build-StandaloneWindows64-(\d+\.\d+\.\d+)\.zip$/);
          return versionMatch ? versionMatch[1] : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  
      const latestVersion = versions[0];
      const latestVersionUrl = `https://objectstorage.eu-stockholm-1.oraclecloud.com/p/6UnP1A4TZQ1SRISGgW9xqTN3OrMPyTFv14IdN0ac4SGtsfNmNFNbjyqtXRCLt4dR/n/axwjvntskf9a/b/Game-Bucket/o/${gameId}/Versions/Build-StandaloneWindows64-${latestVersion}.zip`;
  
      return { latestVersion, latestVersionUrl };
    } catch (error) {
      console.error(`Failed to fetch the latest game version for ${gameId}:`, error);
      throw error;
    }
  }
  
  module.exports = {
    getLatestGameVersion,
  };
  