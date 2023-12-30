package cc.elefteria.cryfteriaback.post;

import cc.elefteria.cryfteriaback.images.Image;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
  private Long id;
  private String title;
  private String description;
  private String hashKey;
  private Timestamp createdDate;
  private Set<String> images;
  private String userMin;
  private MultipartFile[] files;

  public static PostDto fromPost(Post post) {
    return PostDto.builder()
            .id(post.getId())
            .title(post.getTitle())
            .description(post.getDescription())
            .hashKey(post.getHashKey())
            .createdDate(post.getCreatedDate())
            .images(post.getImages().stream().map(Image::getFileName).collect(Collectors.toSet()))
//            .userMin(post.getOwner())
            .build();
  }
}
