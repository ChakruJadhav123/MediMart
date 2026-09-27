package com.medimart.repository;

import com.medimart.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    @Query("SELECT p FROM Payment p WHERE p.order.id = :id")
    Optional<Payment> findPaymentByOrderId(@Param("id") Integer id);

    @Query("SELECT p FROM Payment p WHERE p.order.customer.id = :id ORDER BY p.pDate DESC")
    List<Payment> findPaymentsByCustomerId(@Param("id") Integer id);

    @Query("SELECT p FROM Payment p ORDER BY p.pDate DESC")
    List<Payment> findAllPaymentsSorted();
}
