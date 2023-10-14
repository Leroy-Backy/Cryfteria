package cc.elefteria.cryfteriaback.security;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;

public class CryptoAuthenticationProvider extends DaoAuthenticationProvider {
  @Override
  protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
    if (authentication.getCredentials() == null) {
      this.logger.debug("Failed to authenticate since no credentials provided");
      throw new BadCredentialsException(this.messages
          .getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
    }
    String presentedPassword = authentication.getCredentials().toString();
    if (presentedPassword.length() < 132 || !super.getPasswordEncoder().matches(getAddressFromSignature(presentedPassword, userDetails.getPassword()), userDetails.getUsername())) {
      this.logger.debug("Failed to authenticate since password does not match stored value");
      throw new BadCredentialsException(this.messages
          .getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
    }
  }
  
  private String getAddressFromSignature(String signature, String nonce) {
    String r = signature.substring(0, 66);
    String s = "0x" + signature.substring(66, 130);
    String v = "0x" + signature.substring(130, 132);
    BigInteger address = null;

    try {
      address = Sign.signedPrefixedMessageToKey(nonce.getBytes(StandardCharsets.UTF_8),
          new Sign.SignatureData(
              Numeric.hexStringToByteArray(v)[0],
              Numeric.hexStringToByteArray(r),
              Numeric.hexStringToByteArray(s)));

     return "0x" + Keys.getAddress(address);

    } catch (SignatureException e) {
      throw new BadCredentialsException("Wrong signature!");
    }
  }
}
