
const Loader = () => {

  return (
    <div
      className={` z-30 flex items-center fixed h-screen w-screen top-0 left-0 bg-opacity-90 justify-center dark:bg-black/50 p-5 bg-gray-100`}
    >
      <div className="flex space-x-2 animate-pulse">
        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        <div className="w-3 h-3 bg-orange-700 rounded-full"></div>
        <div className="w-3 h-3 bg-purple-800 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
