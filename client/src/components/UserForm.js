import {useForm} from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import Alert from "react-bootstrap/Alert";
import api from "../utils/Api";

export default function UserForm({onSuccess, renderedUser}) {

  const [error, setError] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const defaultValues = {
    firstName: renderedUser.firstName || "",
    lastName: renderedUser.lastName || "",
    nickname: renderedUser.nickname || "",
    bio: renderedUser.bio || ""
  }

  const {
    register,
    formState: {errors},
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {...defaultValues}
  });

  const onSubmit = (userFromForm) => {
    setButtonDisabled(true);
    setError(null);

    api.put('/user', userFromForm).then(res => {
      reset({...defaultValues});
      if (onSuccess) {
        onSuccess();
      }
    }).catch(err => {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Unknow error!");
      }
    }).finally(() => {
      setButtonDisabled(false);
    })
  }

  return (
    <div>
      {error &&
        <Alert variant="danger">
          {error}
        </Alert>
      }
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicFirstName">
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First name"
            {...register("firstName", {
              required: "First name is required",
              minLength: {value: 3, message: "Min length is 3"}
            })}
          />
          {errors.firstName && (
            <Form.Text className="text-danger">
              {errors.firstName.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last name"
            {...register("lastName", {
              required: "Last name is required",
              minLength: {value: 3, message: "Min length is 3"}
            })}
          />
          {errors.lastName && (
            <Form.Text className="text-danger">
              {errors.lastName.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicNickname">
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nickname"
            {...register("nickname", {
              required: "Nickname is required",
              minLength: {value: 3, message: "Min length is 3"}
            })}
          />
          {errors.nickname && (
            <Form.Text className="text-danger">
              {errors.nickname.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicBio">
          <Form.Label>bio</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="bio"
            {...register("bio")}
          />
        </Form.Group>

        <Button variant="secondary" type="submit" disabled={buttonDisabled}>
          Edit
        </Button>
      </Form>
    </div>
  );
}