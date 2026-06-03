import "./Loader.css";

function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-page">
      <div className="loader-content">
        <div className="loader-ring">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h2>{text}</h2>
        <p>Please wait while Snip prepares your experience.</p>
      </div>
    </div>
  );
}

export default Loader;