import { Alert } from "react-bootstrap";
const Notification = ({ success, error }) => {
  if (!success && !error) {
    return null;
  }
  return (
    <div className={`notif ${success ? "success" : "error"}`}>
      {success ? (
        <Alert variant="success">{success}</Alert>
      ) : (
        <Alert variant="danger">{error}</Alert>
      )}
    </div>
  );
};
export default Notification;
