const EventSection = ({ children }) => {
  return (
    <div className="bg-transparent py-2 rounded-md h-full gap-6 flex flex-col items-center w-11/12">
      {children}
    </div>
  );
};

export default EventSection;