import {useAuth} from "../context/AuthProvider";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import avatar from "../images/2.png"
import {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import UserForm from "./UserForm";
import AvatarUpload from "./AvatarUpload";
import {PencilSquare, PersonSquare} from "react-bootstrap-icons";
import api from "../utils/Api";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function UserCard({renderedUser, onUserEdit}) {
  const [showModal, setShowModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const {user} = useAuth();
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, [renderedUser]);
  
  const follow = () => {
    api.post(`/user/${renderedUser.publicAddress}/follow`).then(res => {
      onUserEdit();
    }).catch(err => {
      
    });
  }
  
  const checkSubscription = () => {
    api.get(`/user/${renderedUser.publicAddress}/is-subscribed`).then(res => {
      setSubscribed(res.data.value);
    }).catch(err => {
      
    });
  }
  
  return (
    <>
      <Card className={`mt-4 m-auto`} style={{width: "30rem"}}>
        <div className="position-relative">
          {(renderedUser.publicAddress === user.publicAddress) &&
            <>
              <Button className="position-absolute m-2" variant="secondary" style={{right: 0, height: 40, paddingBottom: 10, top: 45}}
                      type="button" onClick={() => setShowModal(prev => !prev)}>
                <PencilSquare size={20}/>
              </Button>
              <Button className="position-absolute m-2" variant="secondary" style={{right: 0, height: 40, paddingBottom: 10, top: 90}}
                      type="button" onClick={() => setShowAvatarModal(prev => !prev)}>
                <PersonSquare size={20}/>
              </Button>
            </>
          }
          <Button className="position-absolute m-2" variant="secondary" style={{right: 0, height: 40}} disabled>
            <div className="nickname-label">
              {renderedUser.nickname}
            </div>
          </Button>
          <Card.Img variant="top" src={renderedUser.photo ? `${baseUrl}/api/images/${renderedUser.photo}` : avatar}/>
        </div>
        <Card.Body>
          <Card.Text>{renderedUser.publicAddress}</Card.Text>
          <Card.Title>
            {renderedUser.firstName} {renderedUser.lastName}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{renderedUser.bio}</Card.Subtitle>

          <Card.Link className="text-muted" style={{cursor: "pointer"}}>follows ({renderedUser.amountOfFollows})</Card.Link>
          <Card.Link className="text-muted" style={{cursor: "pointer"}}>followers ({renderedUser.amountOfFollowers})</Card.Link>
        </Card.Body>
        <Card.Footer>
          {(renderedUser.publicAddress !== user.publicAddress) &&
            <div>
              <Button onClick={follow} variant="secondary">{subscribed ? "unfollow" : "follow"}</Button>
            </div>
          }
        </Card.Footer>
      </Card>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm renderedUser={renderedUser} onSuccess={() => {
            setShowModal(false);
            if(onUserEdit) {
              onUserEdit();
            }
          }}/>
        </Modal.Body>
      </Modal>

      <Modal className="avatar-modal" show={showAvatarModal} onHide={() => setShowAvatarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload profile image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AvatarUpload onSuccess={() => {
            setShowAvatarModal(false);
            if(onUserEdit) {
              onUserEdit();
            }
          }}/>
        </Modal.Body>
      </Modal>
    </>
  );
}