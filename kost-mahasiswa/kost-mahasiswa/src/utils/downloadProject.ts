/**
 * Utility helper to download the project zip reliably across all browsers,
 * including inside sandboxed iframes.
 */
export async function downloadProjectZip(): Promise<void> {
  const zipUrl = '/kost-mahasiswa-project.zip';

  try {
    const response = await fetch(zipUrl);
    if (!response.ok) {
      throw new Error(`Gagal mengunduh: status ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = 'kost-mahasiswa-project.zip';
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(anchor);
    }, 1000);
  } catch (error) {
    console.warn('Fallback direct download:', error);
    // Direct link fallback
    const directAnchor = document.createElement('a');
    directAnchor.href = zipUrl;
    directAnchor.download = 'kost-mahasiswa-project.zip';
    directAnchor.target = '_blank';
    document.body.appendChild(directAnchor);
    directAnchor.click();
    document.body.removeChild(directAnchor);
  }
}
