package cc.elefteria.cryfteriaback.user;

import cc.elefteria.cryfteriaback.exception.CryfteriaEntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static cc.elefteria.cryfteriaback.utils.SetterUtils.setIfNotNull;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
  
  private final UserRepository userRepository;
  
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByPublicAddress(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
  
  public UserDto getCurrentUser() {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return UserDto.fromUser(user);
  }
  
  public void updateUser(UserDto userDto) {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    setIfNotNull(userDto.getNickname(), user::setNickname);
    setIfNotNull(userDto.getFirstName(), user::setFirstName);
    setIfNotNull(userDto.getLastName(), user::setLastName);
    setIfNotNull(userDto.getBio(), user::setBio);
    
    userRepository.save(user);
  }
  
  public UserDto getUserByAddress(String userAddress) {
    Optional<User> userOptional = userRepository.findByPublicAddress(userAddress);
    return UserDto.fromUser(userOptional
        .orElseThrow(() -> new CryfteriaEntityNotFoundException("User with address: " + userAddress + " does not exist"))
    );
  }
  
  @Transactional
  public void toggleUserFollow(String address) {
    User currentUser = userRepository.findByPublicAddress(SecurityContextHolder.getContext().getAuthentication().getName())
        .orElseThrow(() -> new CryfteriaEntityNotFoundException("User does not exist"));
    
    User followedUser = userRepository.findByPublicAddress(address)
        .orElseThrow(() -> new CryfteriaEntityNotFoundException("User with address: " + address + " does not exist"));

    if(currentUser.getFollows().contains(followedUser)){
      currentUser.removeFollow(followedUser);
    } else {
      currentUser.addFollow(followedUser);
    }

    userRepository.save(currentUser);
    userRepository.save(followedUser);
  }

  public Page<UserDto> getFollowsByAddress(String address, Pageable pageable) {
    Page<User> usersPage = userRepository.findByFollowers_publicAddress(address, pageable);
    return usersPage.map(UserDto::fromUser);
  }
  
  public Page<UserDto> getFollowersByAddress(String address, Pageable pageable) {
    Page<User> usersPage = userRepository.findByFollows_publicAddress(address, pageable);
    return usersPage.map(UserDto::fromUser);
  }
  
  public boolean isSubscribed(String userAddress) {
    User currentUser = userRepository.findByPublicAddress(SecurityContextHolder.getContext().getAuthentication().getName())
        .orElseThrow(() -> new CryfteriaEntityNotFoundException("User does not exist"));

    User otherUser = userRepository.findByPublicAddress(userAddress)
        .orElseThrow(() -> new CryfteriaEntityNotFoundException("User with address: " + userAddress + " does not exist"));
    
    return otherUser.getFollowers().contains(currentUser);
  }
}
