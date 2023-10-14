package cc.elefteria.cryfteriaback.security;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

public class CryptoPasswordEncoder implements PasswordEncoder {
  @Override
  public String encode(CharSequence rawPassword) {
    return SecurityConsts.NONCE_PREFIX + UUID.randomUUID();
  }

  @Override
  public boolean matches(CharSequence checkedPublicAddress, String publicAddress) {
    return checkedPublicAddress.toString().equalsIgnoreCase(publicAddress);
  }
}
