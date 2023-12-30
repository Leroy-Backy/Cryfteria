package cc.elefteria.cryfteriaback.images;

import cc.elefteria.cryfteriaback.exception.CryfteriaEntityNotFoundException;
import cc.elefteria.cryfteriaback.user.User;
import cc.elefteria.cryfteriaback.user.UserRepository;
import cc.elefteria.cryfteriaback.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
  
  private final ImageService imageService;
  private final UserRepository userRepository;

  @PreAuthorize("permitAll()")
  @GetMapping(value = "/{imageName:.+}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
  public @ResponseBody byte[] getImageByName(@PathVariable(name = "imageName") String imageName) throws IOException {
    return imageService.getImageByName(imageName);
  }

  @PreAuthorize("permitAll()")
  @GetMapping(value = "/min/{address}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
  public @ResponseBody byte[] getUserMinByAddress(@PathVariable(name = "address") String address) throws IOException {
    User user = userRepository.findByPublicAddress(address).orElseThrow(() ->
        new CryfteriaEntityNotFoundException("User with address: " + address + " does not exist"));
    
    String imgName = user.getPhotoMin() != null ? user.getPhotoMin().getFileName() : "defaultAvatar.png";
    
    return imageService.getImageByName(imgName);
  }

  @PreAuthorize("isAuthenticated()")
  @PostMapping("/avatar")
  public ResponseEntity uploadUserAvatar(@RequestParam("files") MultipartFile[] files){
    imageService.uploadUserProfilePhoto(files);
    
    return ResponseEntity.ok().build();
  }
}
