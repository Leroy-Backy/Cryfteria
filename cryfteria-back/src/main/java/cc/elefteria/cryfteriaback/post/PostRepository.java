package cc.elefteria.cryfteriaback.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
  Optional<Post> findByHashKey(String hashKey);
}
