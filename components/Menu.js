import Hamburger from "hamburger-react";
import { useState, useRef } from "react";
import styles from "./Menu.module.css";

export default function Menu({ children, className }) {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div className="fixed top-1 right-1">
        <Hamburger
          size={30}
          toggled={toggle}
          onToggle={() => setToggle(!toggle)}
        />
      </div>

      {/* <div className="fixed top-3.5 right-0 min-w-[34%] text-center hidden md:block">
        Game Master Menu
      </div> */}

      <div
        className={`${toggle ? styles.slideIn : styles.slideOut} ${styles.menu}
        `}
      >
        <div className="p-6 float-left hidden md:inline-block">
          Cool Image Here or something
        </div>
        <div className="max-w-md md:float-right h-full mr-6 overflow-y-scroll">
          {children.map((child, index) => (
            <div
              className="p-2"
              key={`gm-menu-item-${index}`}
              onClick={() => {
                // if the menu has a label, it is assumed to be a menu item (janky i know)
                if (child.props.label) {
                  setToggle(!toggle);
                }
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
