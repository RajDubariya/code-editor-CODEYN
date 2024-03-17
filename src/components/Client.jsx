/* eslint-disable react/prop-types */
const Client = ({ username }) => {
  return (
    <div className="w-fit flex flex-col justify-center items-center p-1 capitalize">
      <div className="text-lg relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-600">
        <span className="font-medium text-gray-600 dark:text-gray-300 ">
          {username?.slice(0, 1)}
        </span>
      </div>
      <span>{username}</span>
    </div>
  );
};

export default Client;
