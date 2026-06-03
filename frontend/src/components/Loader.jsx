import "./Loader.css";

function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-overlay">
      <div className="loader-center">
        <div className="loader-ring"></div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Loader;