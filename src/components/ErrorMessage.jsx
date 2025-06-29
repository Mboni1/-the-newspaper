const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error: </strong>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;