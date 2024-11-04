export function capitalize(str) {
    if (!str) return ''; // Check if the string is empty or undefined
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  