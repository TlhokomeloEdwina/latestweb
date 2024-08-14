const CustomButton = ({ title, handlePress, styles }) => {
  return (
    <button
      onClick={handlePress}
      type="submit"
      className={`font-serif border-2 px-2 py-1 rounded-lg font-bold  ${styles}`}
    >
      {title}
    </button>
  );
};

export default CustomButton;
