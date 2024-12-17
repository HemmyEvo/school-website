import { Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";



const DarkMode = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;
  
  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      console.log(element)
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      console.log(element)
    }
  }, [theme]);
  return (
    <>
    
        <div  onClick={() =>
            setTheme((data) => (data === "dark" ? "light" : "dark"))
          }
          className={`${theme === "dark" ? "hidden" : "flex"}`}
         >
            Dark mode
          </div>
      
          <div onClick={() =>
            setTheme((data) => (data === "dark" ? "light" : "dark"))}
            className={`${theme === "light" ? "hidden" : "flex"}`}
         >
             Light mode
          </div>
    
    </>
  );
};

export default DarkMode;
