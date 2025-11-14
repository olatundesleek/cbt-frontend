export const formatDate = (date: string) => {
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));

  return formatted;
};

export const formatDigits = (digit: number) => {
  return digit.toLocaleString();
};
