package com.medimart.repository;

import com.medimart.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("SELECT c FROM Customer c WHERE c.cLoginId = :loginId")
    Optional<Customer> findCustomerByLoginId(@Param("loginId") String loginId);

    @Query("SELECT c FROM Customer c WHERE c.cEmail = :email")
    Optional<Customer> findCustomerByEmail(@Param("email") String email);

    @Query("SELECT COUNT(c) > 0 FROM Customer c WHERE c.cLoginId = :loginId")
    boolean existsCustomerByLoginId(@Param("loginId") String loginId);

    @Query("SELECT COUNT(c) > 0 FROM Customer c WHERE c.cEmail = :email")
    boolean existsCustomerByEmail(@Param("email") String email);
}
