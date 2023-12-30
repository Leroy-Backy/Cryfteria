import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useState} from "react";
import PostForm from "../components/PostForm";

export default function PostsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setShowModal(true)}>Create post</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostForm onSuccess={() => {
            setShowModal(false);
          }}/>
        </Modal.Body>
      </Modal>
    </div>
  );
}