import {useState} from "react";
import Alert from "react-bootstrap/Alert";
import {useForm} from "react-hook-form";
import Form from "react-bootstrap/Form";
import {useDropzone} from "react-dropzone";
import Api from "../utils/Api";
import Button from "react-bootstrap/Button";
import {useTransaction} from "../context/TransactionProvider";

export default function PostForm({onSuccess}) {
  const [error, setError] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [files, setFiles] = useState();
  const {createPost} = useTransaction();
  
  const defaultValues = {
    title: "",
    description: ""
  }

  const {
    register,
    formState: {errors},
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {...defaultValues}
  });

  const onDrop = (files) => {
    setFiles(files);
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  const onSubmit = (form) => {
    setButtonDisabled(true);
    setError(null);
    
    console.log("FORM>>", form, files);
    
    Api.postForm(`/posts`, {
      title: form.title,
      description: form.description,
      files: files
    }).then(res => {
      reset({...defaultValues});
      createPost(res.data.hashKey).then(res => {
        console.log("COMPLETED>>>", res)
      })
      
      if(onSuccess) {
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
    });
  }
  
  return (
    <div>
      {error &&
          <Alert variant="danger">
            {error}
          </Alert>
      }
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="postTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
              type="text"
              placeholder="Title"
              {...register("title")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="postDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
              type="text"
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
                minLength: {value: 3, message: "Min length is 3"}
              })}
          />
          {errors.description && (
              <Form.Text className="text-danger">
                {errors.description.message}
              </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>

          <div>
            {files && files.map((f, idx) => (
              <Form.Text key={idx}>{f.name}{idx < files.length - 1 ? ', ' : ''}</Form.Text>)
            )}
          </div>
          
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop some files here, or click to select files</p>
            }
          </div>
        </Form.Group>

        <Button variant="secondary" type="submit" disabled={buttonDisabled}>
          Create
        </Button>
      </Form>
    </div>
  )
}