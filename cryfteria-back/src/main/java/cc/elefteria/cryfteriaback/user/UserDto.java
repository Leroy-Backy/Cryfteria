package cc.elefteria.cryfteriaback.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
  private Integer id;
  private String firstName;
  private String lastName;
  private String nickname;
  private String bio;
  private String publicAddress;
  private String photo;
  private int amountOfFollowers;
  private int amountOfFollows;
  
  public static UserDto fromUser(User user) {
    return UserDto.builder()
        .id(user.getId())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .nickname(user.getNickname())
        .bio(user.getBio())
        .publicAddress(user.getPublicAddress())
        .photo(user.getPhoto() != null ? user.getPhoto().getFileName() : null)
        .amountOfFollows(user.getAmountOfFollows())
        .amountOfFollowers(user.getAmountOfFollowers())
        .build();
  }
}
