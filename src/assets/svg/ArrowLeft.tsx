interface ArrowDownI {
  disabled?: boolean;
}

const ArrowLeft = ({ disabled }: ArrowDownI) => {
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
        stroke={disabled ? "#00000080" : "#000000"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowLeft;
