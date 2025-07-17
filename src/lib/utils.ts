export const validateUrl = (str: string) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const truncateURI = (uri) => {
  return truncateText(decodeURI(uri), 200);
};

export const truncateText = (text, maxLength, ellipsis = "...") => {
  if (typeof text !== "string") {
    throw new TypeError("Input 'text' must be a string.");
  }
  if (typeof maxLength !== "number" || maxLength < 0) {
    throw new TypeError("'maxLength' must be a non-negative number.");
  }

  if (text.length <= maxLength) {
    return text; // No truncation needed
  }

  // Calculate the length for the visible text part
  const availableLength = maxLength - ellipsis.length;

  // If maxLength is too small to even show the ellipsis, just return ellipsis
  if (availableLength < 0) {
    return ellipsis;
  }

  return text.slice(0, availableLength) + ellipsis;
};
