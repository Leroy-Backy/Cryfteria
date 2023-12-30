import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import Api from "../utils/Api";
import {Col, InputGroup, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useTransaction} from "../context/TransactionProvider";
import {HeartFill} from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import EthLogo from "./EthLogo";
import {useAuth} from "../context/AuthProvider";
import {Link} from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function PostComponent({hashKey, donated, owner, id, price}) {
  const [post, setPost] = useState();
  const [donateValue, setDonateValue] = useState("0.001");
  const {donate, setPostToSell, buyPost} = useTransaction();
  const {user} = useAuth();
  const [ownerObject, setOwnerObject] = useState();
  const [sellValue, setSellValue] = useState("0.1");

  useEffect(() => {
    Api.get(`/posts/${hashKey}`).then(res => {
      setPost(res.data);
    }).catch(err => {
      
    });
    
    Api.get(`/user/${owner}`).then(res => {
      setOwnerObject(res.data);
    }).catch(err => {
      
    });
  }, []);

  return (
    post &&
    <Card className={`mt-4 m-auto`} style={{width: "30rem"}}>
      <Card.Body>
        <Row className="mb-3">
          <Col xs={2}>
            <div>
              <Card.Img className="user-image" src={`${baseUrl}/api/images/min/${owner}`}/>
            </div>
          </Col>
          <Col md={10}>
            <Row>
              {ownerObject &&
                <Card.Title><Card.Link className="card-title" as={Link} to={`/user/${owner}`}>{ownerObject.nickname}</Card.Link></Card.Title>
              }
            </Row>
            <Row>
              <Card.Subtitle className="mb-2 text-muted">
                {new Date(post.createdDate).toLocaleString("pl")}
              </Card.Subtitle>
            </Row>
          </Col>
        </Row>
        <Row>
          <Card.Subtitle className="mb-2 text-muted">{post.description}</Card.Subtitle>
        </Row>

      </Card.Body>

      <div className="position-relative">
        {post.images && post.images.map((img, idx) => (
          <Card.Img key={idx} variant="bottom" src={`${baseUrl}/api/images/${img}`}/>
        ))}
      </div>
      <Card.Footer>
        <Row>
          <Col>
            <InputGroup>
              <Form.Control
                type="number"
                step="0.001"
                value={donateValue}
                onChange={(e) => setDonateValue(e.target.value)}
              />
              <InputGroup.Text>
                <EthLogo color="#6c757d"/>
              </InputGroup.Text>
              <Button style={{width: 52}} variant="outline-secondary" onClick={() => donate(id, donateValue)}>
                <HeartFill/>
              </Button>
            </InputGroup>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button variant="secondary" disabled>
              {donated} <EthLogo/>
            </Button>
          </Col>
        </Row>
        
        {owner === user.publicAddress && 
          <Row className="mt-2">
            <Col>
              <InputGroup>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={sellValue}
                  onChange={(e) => setSellValue(e.target.value)}
                />
                <InputGroup.Text>
                  <EthLogo color="#6c757d"/>
                </InputGroup.Text>

                <Button variant="outline-secondary" onClick={() => setPostToSell(id, sellValue)}>Sell</Button>
              </InputGroup>
            </Col>
            <Col className="d-flex justify-content-end">
              {price > 0 &&
                <Button variant="secondary" disabled>
                  price {price} <EthLogo/>
                </Button>
              }
            </Col>
          </Row>
        }

        {owner !== user.publicAddress && price > 0 &&
          <Row className="mt-2">
            <Col>
              <Button variant="outline-secondary" onClick={() => buyPost(id, price.toString())}>Buy</Button>
            </Col>
            <Col className="d-flex justify-content-end">
              {price > 0 &&
                <Button variant="secondary" disabled>
                  price {price} <EthLogo/>
                </Button>
              }
            </Col>
            {/*<Button variant="secondary" onClick={() => buyPost(id, price)}>Buy ({price}<EthLogo/>)</Button>*/}
          </Row>
        }
      </Card.Footer>
    </Card>
  );
}