// My Alert component is a functional component that takes three props:
// text (the message to display),
// style (the display style of the alert),
// setAlertMessage (a function to clear the alert message).
// The component renders an alert box with the provided text and a close button to dismiss the alert.

function Alert({ text, style, setAlertMessage }) {
  // console.log("style is ",style);
  const handleAlert = (e) => {
    e.preventDefault();
    setAlertMessage("");
  };

  return (
    <>
      <div
        className="alert w-50 align-self-center alert-success alert-dismissible fade show"
        style={{ display: style }}
        role="alert"
      >
        {text}
        <button type="button" className="close" onClick={handleAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </>
  );
}

export default Alert;
