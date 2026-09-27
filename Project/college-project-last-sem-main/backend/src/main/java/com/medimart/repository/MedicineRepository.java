package com.medimart.repository;

import com.medimart.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.mCategory) = LOWER(:category)")
    List<Medicine> findMedicinesByCategory(@Param("category") String category);

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.mName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Medicine> searchMedicinesByName(@Param("name") String name);
}
