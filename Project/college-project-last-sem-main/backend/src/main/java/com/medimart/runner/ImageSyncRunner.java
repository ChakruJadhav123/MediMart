package com.medimart.runner;

import com.medimart.entity.Medicine;
import com.medimart.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Scans the frontend image directory and ensures each Medicine has a valid
 * mImage path (e.g. "/images/Paracetamol 1g.jpg"). If a medicine already has a
 * non‑null mImage that points to an existing file, it is left untouched.
 */
@Component
@RequiredArgsConstructor
public class ImageSyncRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ImageSyncRunner.class);
    private final MedicineRepository medicineRepository;

    @Override
    public void run(String... args) throws Exception {
        // Resolve absolute path to the images folder
        Path currentPath = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        Path projectRoot = currentPath.getFileName().toString().equals("backend") 
            ? currentPath.getParent() 
            : currentPath;
            
        Path imagesPath = projectRoot.resolve("frontend/public/images").toAbsolutePath().normalize();

        if (!Files.isDirectory(imagesPath)) {
            log.warn("Image directory not found: {}", imagesPath);
            return;
        }

        // Load all image filenames (including spaces) into a list
        List<String> imageFiles = Files.list(imagesPath)
                .filter(Files::isRegularFile)
                .map(p -> p.getFileName().toString())
                .collect(Collectors.toList());

        // Process every medicine record
        List<Medicine> medicines = medicineRepository.findAll();
        for (Medicine med : medicines) {
            // If the stored path already points to a real file – keep it
            if (med.getMImage() != null && Files.exists(imagesPath.resolve(Paths.get(med.getMImage()).getFileName()))) {
                continue;
            }

            // Try to find a file that contains the medicine name (case‑insensitive)
            String target = imageFiles.stream()
                    .filter(fn -> fn.toLowerCase().contains(med.getMName().toLowerCase()))
                    .findFirst()
                    .orElse(null);

            if (target != null) {
                String newPath = "/images/" + target;
                med.setMImage(newPath);
                medicineRepository.save(med);
                log.info("Updated image for {} → {}", med.getMName(), newPath);
            } else {
                log.warn("No image file found for medicine '{}'", med.getMName());
            }
        }
    }
}
