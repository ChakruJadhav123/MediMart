package com.medimart.repository;

import com.medimart.entity.OrderedMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderedMedicineRepository extends JpaRepository<OrderedMedicine, Integer> {
    @Query("SELECT om FROM OrderedMedicine om WHERE om.order.id = :orderId")
    List<OrderedMedicine> findByOrderId(@Param("orderId") Integer orderId);
}
