export const highlightText = (text, searchQuery) => {
  if (!searchQuery || !text) {
    return text;
  }

  const regex = new RegExp(`(${searchQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-black text-white px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};
