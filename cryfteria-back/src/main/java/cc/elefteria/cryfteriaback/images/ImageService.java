package cc.elefteria.cryfteriaback.images;

import cc.elefteria.cryfteriaback.exception.CryfteriaEntityNotFoundException;
import cc.elefteria.cryfteriaback.user.User;
import cc.elefteria.cryfteriaback.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
  
  private final ImageRepository imageRepository;
  private final UserRepository userRepository;
  
  @Value("${cryfteria.localstorage.path.images}")
  private String imageStorePath;

  @Transactional
  public void uploadUserProfilePhoto(MultipartFile[] files) {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    String fileName = uploadImageToLocalFileSystem(files[0]);
    
    if(fileName == null){
      throw new RuntimeException("Failed to upload image");
    }

    Image image = new Image(fileName);

    if(user.getPhoto() != null){
      deleteImageByFileName(user.getPhoto().getFileName());

      imageRepository.delete(user.getPhoto());
    }

    user.setPhoto(image);
    
    if(files.length > 1) {
      String fileMinName = uploadImageToLocalFileSystem(files[1]);
      if(fileMinName == null){
        throw new RuntimeException("Failed to upload image");
      }
      Image imageMin = new Image(fileMinName);

      if(user.getPhotoMin() != null){
        deleteImageByFileName(user.getPhotoMin().getFileName());

        imageRepository.delete(user.getPhotoMin());
      }
      user.setPhotoMin(imageMin);
    }

    userRepository.save(user);
  }

  public String uploadImageToLocalFileSystem(MultipartFile file) {
    return uploadImageToLocalFileSystem(file, null);
  }
  
  public String uploadImageToLocalFileSystem(MultipartFile file, String name) {
    String extension = com.google.common.io.Files.getFileExtension(file.getOriginalFilename());

    if(!(extension.equals("jpg") || extension.equals("jpeg") || extension.equals("png")))
      throw new RuntimeException("Wrong file extension");

    String fileName = (name != null ? name : generateImageName()) + "." + extension;

    Path storageDirectory = Paths.get(imageStorePath);

    if(!Files.exists(storageDirectory)){
      try {
        Files.createDirectories(storageDirectory);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    Path destination = Paths.get(imageStorePath + fileName);

    try {
      Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
      e.printStackTrace();
    }

    return fileName;
  }

  public void deleteImageByFileName(String fileName) {
    Path destination = Paths.get(imageStorePath + fileName);

    try {
      java.nio.file.Files.deleteIfExists(destination);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  
  private String generateImageName() {
    return System.currentTimeMillis() + UUID.randomUUID().toString();
  }
  
  public byte[] getImageByName(String imageName) throws IOException {
    Path destination = Paths.get(imageStorePath + imageName);

    return IOUtils.toByteArray(destination.toUri());
  }
}
