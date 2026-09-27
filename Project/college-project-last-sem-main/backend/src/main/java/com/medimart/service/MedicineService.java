package com.medimart.service;

import com.medimart.dto.CreateMedicineRequest;
import com.medimart.dto.MedicineDTO;
import com.medimart.entity.Medicine;
import com.medimart.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MedicineDTO getMedicineById(Integer id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return toDTO(medicine);
    }

    public List<MedicineDTO> searchMedicines(String name) {
        return medicineRepository.searchMedicinesByName(name).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<MedicineDTO> getMedicinesByCategory(String category) {
        return medicineRepository.findMedicinesByCategory(category).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public MedicineDTO addMedicine(CreateMedicineRequest request) {
        Medicine medicine = Medicine.builder()
                .mName(request.getMName())
                .mImage(request.getMImage())
                .mPrice(request.getMPrice())
                .mUnit(request.getMUnit())
                .mCategory(request.getMCategory())
                .build();
        medicine = medicineRepository.save(medicine);
        return toDTO(medicine);
    }

    public MedicineDTO addMedicineWithImage(
            String mName,
            Integer mPrice,
            Integer mUnit,
            String mCategory,
            MultipartFile image
    ) throws IOException {

        String filename = storeImage(image);
        String imagePath = "/api/images/" + filename;

        Medicine medicine = Medicine.builder()
                .mName(mName)
                .mImage(imagePath)
                .mPrice(mPrice)
                .mUnit(mUnit)
                .mCategory(mCategory)
                .build();

        return toDTO(medicineRepository.save(medicine));
    }

    public MedicineDTO updateMedicine(Integer id, CreateMedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        if (request.getMName() != null)
            medicine.setMName(request.getMName());
        if (request.getMImage() != null)
            medicine.setMImage(request.getMImage());
        if (request.getMPrice() != null)
            medicine.setMPrice(request.getMPrice());
        if (request.getMUnit() != null)
            medicine.setMUnit(request.getMUnit());
        if (request.getMCategory() != null)
            medicine.setMCategory(request.getMCategory());

        medicine = medicineRepository.save(medicine);
        return toDTO(medicine);
    }

    public MedicineDTO updateMedicineWithImage(
            Integer id,
            String mName,
            Integer mPrice,
            Integer mUnit,
            String mCategory,
            MultipartFile image
    ) throws IOException {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setMName(mName);
        medicine.setMPrice(mPrice);
        medicine.setMUnit(mUnit);
        medicine.setMCategory(mCategory);

        String filename = storeImage(image);
        medicine.setMImage("/api/images/" + filename);

        return toDTO(medicineRepository.save(medicine));
    }

    private String storeImage(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String original = image.getOriginalFilename() == null ? "medicine" : image.getOriginalFilename();
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) {
            ext = original.substring(dot);
        }

        String filename = UUID.randomUUID() + ext;

        // Store into the frontend public folder so React can serve it as /images/<filename>
        Path currentPath = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        Path projectRoot = currentPath.getFileName().toString().equals("backend") 
            ? currentPath.getParent() 
            : currentPath;
            
        Path uploadDir = projectRoot.resolve("frontend/public/images").toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);

        Path target = uploadDir.resolve(filename);
        Files.copy(image.getInputStream(), target);

        return filename;
    }

    public void deleteMedicine(Integer id) {
        medicineRepository.deleteById(id);
    }

    private MedicineDTO toDTO(Medicine m) {
        return MedicineDTO.builder()
                .mId(m.getId())
                .mName(m.getMName())
                .mImage(m.getMImage())
                .mPrice(m.getMPrice())
                .mUnit(m.getMUnit())
                .mCategory(m.getMCategory())
                .build();
    }
}
