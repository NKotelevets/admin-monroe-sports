interface ArrowDownI {
  disabled?: boolean;
  color?: string;
}

const ArrowLeft = ({ disabled, color }: ArrowDownI) => {
  const colorValue = color || (disabled ? "#00000080" : "#000000");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke={colorValue}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowLeft;
