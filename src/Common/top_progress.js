import React from "react";
import { useState, useEffect } from "react";

const TopProgress = () => {
  const [percentageScrolled, setPercentageScrolled] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const totalScrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const percentageScrolled = (scrollTop / totalScrollHeight) * 100;
      setPercentageScrolled(Math.round(percentageScrolled));
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <span
      className="progress-bar"
      style={{ width: `${percentageScrolled}%` }}
    ></span>
  );
};

export default TopProgress;
