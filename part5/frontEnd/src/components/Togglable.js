import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  //defines functions in a component wheich can be invoked from outside of the component
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });
  //props.children reference child components of component
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});
Togglable.proptypes = {
  buttonLabel: PropTypes.string.isRequired,
};
Togglable.displayName = "Togglable";

export default Togglable;
