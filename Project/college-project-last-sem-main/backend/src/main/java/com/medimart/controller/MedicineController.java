package com.medimart.controller;

import com.medimart.dto.CreateMedicineRequest;
import com.medimart.dto.MedicineDTO;
import com.medimart.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable Integer id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping("/medicines/search")
    public ResponseEntity<List<MedicineDTO>> searchMedicines(@RequestParam String name) {
        return ResponseEntity.ok(medicineService.searchMedicines(name));
    }

    @PostMapping("/admin/medicines")
    public ResponseEntity<MedicineDTO> addMedicine(@RequestBody CreateMedicineRequest request) {
        return ResponseEntity.ok(medicineService.addMedicine(request));
    }

    @PutMapping("/admin/medicines/{id}")
    public ResponseEntity<MedicineDTO> updateMedicine(@PathVariable Integer id, @RequestBody CreateMedicineRequest request) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, request));
    }

    @PostMapping("/admin/medicines/upload")
    public ResponseEntity<MedicineDTO> addMedicineWithUpload(
            @RequestParam("mName") String mName,
            @RequestParam("mPrice") Integer mPrice,
            @RequestParam("mUnit") Integer mUnit,
            @RequestParam("mCategory") String mCategory,
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        return ResponseEntity.ok(medicineService.addMedicineWithImage(mName, mPrice, mUnit, mCategory, image));
    }

    @PostMapping("/admin/medicines/{id}/upload")
    public ResponseEntity<MedicineDTO> updateMedicineWithUpload(
            @PathVariable("id") Integer id,
            @RequestParam("mName") String mName,
            @RequestParam("mPrice") Integer mPrice,
            @RequestParam("mUnit") Integer mUnit,
            @RequestParam("mCategory") String mCategory,
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        return ResponseEntity.ok(medicineService.updateMedicineWithImage(id, mName, mPrice, mUnit, mCategory, image));
    }

    @DeleteMapping("/admin/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Integer id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok().build();
    }
}
