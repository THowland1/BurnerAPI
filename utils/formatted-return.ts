const formattedReturn = (statusCode: number, body: object) => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

export default formattedReturn;
