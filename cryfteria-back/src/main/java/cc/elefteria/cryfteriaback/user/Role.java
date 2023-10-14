package cc.elefteria.cryfteriaback.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public enum Role {
  ROLE_USER,
  ROLE_ADMIN;
  
  public List<GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(this.name()));
  }
}
