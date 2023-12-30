package cc.elefteria.cryfteriaback.post;

import cc.elefteria.cryfteriaback.images.Image;
import cc.elefteria.cryfteriaback.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String description;
  
  private String hashKey;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<Image> images = new HashSet<>();

  @CreationTimestamp
  private Timestamp createdDate;

  @ManyToOne
  private User owner;
  
  public void addImage(Image image) {
    if(images == null) {
      images = new HashSet<>();
    }
    images.add(image);
  }
}
