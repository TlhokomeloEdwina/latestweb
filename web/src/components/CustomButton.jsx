const CustomButton = ({ title, handlePress, styles }) => {
  return (
    <button
      onClick={handlePress}
      type="submit"
      className={`uppercase font-serif border-2 border-cyan-300 text-white 
          hover:text-black border-black-400 px-2 py-1 rounded-lg font-bold h-fit ${styles}`}
    >
      {title}
    </button>
  );
};

export default CustomButton;
