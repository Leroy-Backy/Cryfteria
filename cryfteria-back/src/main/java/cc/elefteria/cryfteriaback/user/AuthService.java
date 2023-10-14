package cc.elefteria.cryfteriaback.user;

import cc.elefteria.cryfteriaback.security.AuthRequest;
import cc.elefteria.cryfteriaback.security.AuthenticationResponse;
import cc.elefteria.cryfteriaback.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authManager;

  public String getUserNonce(String publicAddress) {
    Optional<User> existedUser = userRepository.findByPublicAddress(publicAddress);
    
    if(existedUser.isPresent()) {
      return existedUser.get().getNonce();
    } else {
      User user = User.builder()
          .publicAddress(publicAddress)
          .nonce(passwordEncoder.encode(""))
          .role(Role.ROLE_USER)
          .build();
      
      userRepository.save(user);
      
      return user.getNonce();
    }
  }

  public AuthenticationResponse authenticate(AuthRequest authRequest) {
    authManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            authRequest.getPublicAddress(),
            authRequest.getSignature()
        )
    );
    
    userRepository.findByPublicAddress(authRequest.getPublicAddress()).get().setNonce(passwordEncoder.encode(""));
    // at this point use
    return new AuthenticationResponse(jwtService.generateToken(authRequest.getPublicAddress()));
  }
}
