import {useDropzone} from "react-dropzone";
import api from "../utils/Api";
import ReactCrop, {centerCrop, makeAspectCrop} from 'react-image-crop'
import {useRef, useState} from "react";

import 'react-image-crop/dist/ReactCrop.css'
import Button from "react-bootstrap/Button";

export default function AvatarUpload({onSuccess}) {
  const [img, setImg] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [croppedImg, setCroppedImg] = useState();
  const [cropProps, setCropProps] = useState({minWidth: 225, minHeight: 300, aspect: 3/4})

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }
  
  const onImageLoaded = (image) => {
    const { width, height } = image.currentTarget;
    setCrop(centerAspectCrop(width, height, cropProps.aspect));
  };

  const onCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCropBig = async () => {
    const croppedImage = await getCroppedImg();
    
    setCroppedImg(croppedImage);
    setCropProps(prev => ({...prev, aspect: 1, minHeight: 100, maxHeight: 200, minWidth: 100, maxWidth: 200}));
    
    setCrop({
      unit: 'px',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    })
  };
  
  const upload = async () => {
    const minCroppedImage = await getCroppedImg();
    const uploadImageData = new FormData();
    uploadImageData.append("files", croppedImg, "avatar.jpg");
    uploadImageData.append("files", minCroppedImage, "avatarMin.jpg");


    api.post("/images/avatar", uploadImageData).then(res => {
      if (onSuccess) {
        onSuccess();
      }
    });
  }

  const getCroppedImg = () => {
    if (!completedCrop || !imageRef.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        resolve(blob);
      }, 'image/jpg');
    });
  };
  
  const onDrop = (files) => {
    if (files && files.length > 0) {
      // setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImg(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(files[0])
    }
  }
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  return (
    <div style={{padding: "0px 16px 0px 16px"}}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>

      {img &&
        <div>
          <ReactCrop onChange={c => setCrop(c)} crop={crop} {...cropProps} onComplete={onCropComplete}>
            <img ref={imageRef} src={img} onLoad={onImageLoaded} style={{transform: `scale(${scale})`}}/>
          </ReactCrop>
          <div>
            {croppedImg ?
              <Button variant="secondary" onClick={upload}>Upload</Button>
              :
              <Button variant="secondary" onClick={handleCropBig}>Crop image</Button>
            }
            <Button onClick={() => setScale(prev =>( prev + 0.1))} style={{marginLeft: 30}} variant="secondary">+</Button>
            <Button onClick={() => setScale(prev =>( prev - 0.1))} variant="secondary">-</Button>
          </div>
        </div>
      }
    </div>
  );
}