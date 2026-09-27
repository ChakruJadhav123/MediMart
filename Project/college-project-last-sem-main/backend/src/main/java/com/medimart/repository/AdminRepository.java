package com.medimart.repository;

import com.medimart.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    @Query("SELECT a FROM Admin a WHERE a.aLoginId = :loginId")
    Optional<Admin> findAdminByLoginId(@Param("loginId") String loginId);

    @Query("SELECT a FROM Admin a WHERE a.aEmail = :email")
    Optional<Admin> findAdminByEmail(@Param("email") String email);

    @Query("SELECT COUNT(a) > 0 FROM Admin a WHERE a.aLoginId = :loginId")
    boolean existsAdminByLoginId(@Param("loginId") String loginId);
}
