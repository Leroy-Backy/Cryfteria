import Spinner from "react-bootstrap/Spinner";

export default function LoadingSpinner({text = "Loading..."}) {
  return (
    <div>
      <div className="spinner">
        <Spinner animation="border" variant="dark"/>
        <div>{text}</div>
      </div>
    </div>
  );
}