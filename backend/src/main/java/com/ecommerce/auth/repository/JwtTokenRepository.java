package com.ecommerce.auth.repository;

import com.ecommerce.auth.entity.JwtToken;
import com.ecommerce.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Integer> {
    List<JwtToken> findByUser(User user);
}
