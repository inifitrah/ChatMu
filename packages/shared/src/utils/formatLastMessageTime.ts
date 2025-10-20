export const formatLastMessageTime = (time?: Date) => {
  if (!time) {
    return "";
  }
  const now = new Date();
  const messageDate = new Date(time);

  const diffTime = new Date(now.getTime() - messageDate.getTime());
  const diffDay = Math.floor(diffTime.getTime() / (1000 * 3600 * 24));

  if (diffDay === 0) {
    return messageDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDay === 1) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
