package cc.elefteria.cryfteriaback.images;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
  public Optional<Image> findByFileName(String fileName);
}
