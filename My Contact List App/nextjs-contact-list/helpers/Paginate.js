// Had no idea how to do this so I used AI tool chatGPT to assist in building this component

export const Paginate = (data, pageNumber, pageSize) => {
  if (!Array.isArray(data)) {
    // Handle the error, log it, or return an empty array
    console.error(
      "Invalid data provided to Paginate function, expected an array."
    );
    return [];
  }
  const startIndex = (pageNumber - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
};
