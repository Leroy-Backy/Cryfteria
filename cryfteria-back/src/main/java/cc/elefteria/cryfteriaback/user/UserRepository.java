package cc.elefteria.cryfteriaback.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
  Optional<User> findByPublicAddress(String publicAddress);

  Page<User> findByFollows_publicAddress(String address, Pageable pageable);

  Page<User> findByFollowers_publicAddress(String address, Pageable pageable);
}
