import { useState } from "react";

const useHover = () => {
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);
  return { isHover, handleMouseEnter, handleMouseLeave };
};

export default useHover;
