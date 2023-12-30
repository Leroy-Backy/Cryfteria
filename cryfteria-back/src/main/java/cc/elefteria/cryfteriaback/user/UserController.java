package cc.elefteria.cryfteriaback.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
  
  private final UserService userService;
  
  @GetMapping("/current")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserDto> getCurrentUser() {
    return ResponseEntity.ok(userService.getCurrentUser());
  }

  @PutMapping
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity editProfile(@RequestBody UserDto userDto) {
    userService.updateUser(userDto);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{userAddress}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserDto> getUserByAddress(@NonNull @PathVariable String userAddress) {
    return ResponseEntity.ok(userService.getUserByAddress(userAddress));
  }
  
  @PostMapping("/{userAddress}/follow")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity followUser(@NonNull @PathVariable String userAddress) {
    userService.toggleUserFollow(userAddress);
    return ResponseEntity.ok().build();
  }
  
  @GetMapping("/{userAddress}/follows")
  @PreAuthorize("isAuthenticated()")
  public Page<UserDto> getFollowsByUserAddress(
      @NonNull @PathVariable String userAddress,
      @RequestParam(required = false, name = "size", defaultValue = "30") Integer size,
      @RequestParam(required = false, name = "page", defaultValue = "0") Integer page
  ) {
    Pageable pageable = PageRequest.of(page, size);
    return userService.getFollowsByAddress(userAddress, pageable);
  }

  @GetMapping("/{userAddress}/follows/addresses")
  @PreAuthorize("isAuthenticated()")
  public List<String> getFollowsByUserAddressOnlyAddresses(
      @NonNull @PathVariable String userAddress
  ) {
    Pageable pageable = PageRequest.of(0, 9999999);
    return userService.getFollowsByAddress(userAddress, pageable).map(UserDto::getPublicAddress).toList();
  }

  @GetMapping("/{userAddress}/followers")
  @PreAuthorize("isAuthenticated()")
  public Page<UserDto> getFollowersByUserAddress(
      @NonNull @PathVariable String userAddress,
      @RequestParam(required = false, name = "size", defaultValue = "30") Integer size,
      @RequestParam(required = false, name = "page", defaultValue = "0") Integer page
  ) {
    Pageable pageable = PageRequest.of(page, size);
    return userService.getFollowersByAddress(userAddress, pageable);
  }

  @GetMapping("/{userAddress}/is-subscribed")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<BooleanDto> isSubscribed(@NonNull @PathVariable String userAddress) {
    return ResponseEntity.ok(
        new BooleanDto(userService.isSubscribed(userAddress))
    );
  }
}
