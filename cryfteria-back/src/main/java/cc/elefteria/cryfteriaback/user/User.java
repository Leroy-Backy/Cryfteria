package cc.elefteria.cryfteriaback.user;

import cc.elefteria.cryfteriaback.images.Image;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
@Entity(name = "_user")
public class User implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  
  private String firstName;
  private String lastName;
  @Column(unique = true)
  private String nickname;
  private String bio;
  @Column(unique = true)
  private String publicAddress;
  private String nonce;
  @Enumerated(EnumType.STRING)
  private Role role;
  @CreationTimestamp
  private Date createdDate;
  
  @OneToOne(cascade = CascadeType.ALL)
  private Image photo;

  @OneToOne(cascade = CascadeType.ALL)
  private Image photoMin;

  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH}, fetch = FetchType.LAZY)
  @JoinTable(name = "following",
      joinColumns = @JoinColumn(name = "follower_user_id"),
      inverseJoinColumns = @JoinColumn(name = "followed_user_id"))
  private Set<User> follows = new HashSet<>();

  @ManyToMany(mappedBy = "follows", cascade = {CascadeType.PERSIST, CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH}, fetch = FetchType.LAZY)
  private Set<User> followers = new HashSet<>();

  private int amountOfFollowers;
  private int amountOfFollows;

  public void addFollow(User user){
    if(follows == null){
      follows = new HashSet<>();
    }
    follows.add(user);
    amountOfFollows++;
    user.addFollower(this);
  }

  private void addFollower(User user){
    if(followers == null){
      followers = new HashSet<>();
    }
    followers.add(user);
    amountOfFollowers++;
  }

  public void removeFollow(User user){
    if(follows.contains(user)){
      follows.remove(user);
      amountOfFollows--;
      user.removeFollower(this);
    }
  }

  private void removeFollower(User user){
    if(followers.contains(user)){
      followers.remove(user);
      amountOfFollowers--;
    }
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return role.getAuthorities();
  }

  @Override
  public String getPassword() {
    return nonce;
  }

  @Override
  public String getUsername() {
    return publicAddress;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
