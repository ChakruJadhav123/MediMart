package com.medimart.repository;

import com.medimart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.oDate DESC")
    List<Order> findOrdersByCustomerId(@Param("customerId") Integer customerId);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.oDate DESC")
    List<Order> findOrdersByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT o FROM Order o ORDER BY o.oDate DESC")
    List<Order> findAllOrdersSorted();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.oStatus = :status")
    long countOrdersByStatus(@Param("status") String status);
}
