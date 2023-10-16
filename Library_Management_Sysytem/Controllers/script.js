
// Define the JavaScript function and attach it to the global object (window)
window.truncateTitle = function(title, wordLimit) {
  const words = title ? title.split(' ') : [];
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return title || 'N/A';
};
