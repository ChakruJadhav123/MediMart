package com.medimart.config;

import com.medimart.entity.Admin;
import com.medimart.entity.Customer;
import com.medimart.entity.Medicine;
import com.medimart.repository.AdminRepository;
import com.medimart.repository.CustomerRepository;
import com.medimart.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final AdminRepository adminRepository;
        private final CustomerRepository customerRepository;
        private final MedicineRepository medicineRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                // If schema/tables are not present yet in Oracle (ddl-auto still catching up,
                // wrong schema, etc),
                // do NOT fail the whole application startup.
                try {
                        if (adminRepository.count() == 0) {

                                Admin admin = Admin.builder()
                                                .aLoginId("admin")
                                                .aPassword(passwordEncoder.encode("admin@123"))
                                                .aFullname("MediMart Admin")
                                                .aEmail("admin@medimart.com")
                                                .aGender("Male")
                                                .build();
                                adminRepository.save(admin);
                        }

                        if (customerRepository.count() == 0) {
                                Customer customer = Customer.builder()
                                                .cLoginId("suraj")
                                                .cPassword(passwordEncoder.encode("aniket@123"))
                                                .cFullname("Suraj")
                                                .cEmail("aniket@medimart.com")
                                                .cGender("Male")
                                                .cAddress("123, Marunji Road")
                                                .build();
                                customerRepository.save(customer);
                        }

                        if (medicineRepository.count() == 0) {
                                List<String> localImages = Arrays.asList(
                                                "/images/DOLO 650.jpg",
                                                "/images/pexels-akos-szabo-145938-440731.jpg",
                                                "/images/pexels-alex-amorales-321095-909907.jpg",
                                                "/images/pexels-ben-cheung-140183-715134.jpg",
                                                "/images/pexels-david-bartus-43782-1166209.jpg",
                                                "/images/pexels-david-besh-884788.jpg",
                                                "/images/pexels-eberhardgross-1366835.jpg",
                                                "/images/pexels-minan1398-1406866.jpg",
                                                "/images/pexels-vincent-gerbouin-445991-1168764.jpg",
                                                "/images/roche-9485693.jpg",
                                                "/images/starry-night-1093721.jpg");
                                Random random = new Random();

                                seedCategory(medicineRepository, localImages, random, "Fever & Pain",
                                                Arrays.asList("Dolo 650", "Crocin 500", "Calpol 250", "P-250 Syrup",
                                                                "Ibugesic Plus",
                                                                "Combiflam", "Nimesulide 100", "Naproxen 250",
                                                                "Paracetamol 1g", "Saridon"));

                                seedCategory(medicineRepository, localImages, random, "Antibiotics",
                                                Arrays.asList("Azithral 500", "Amoxyclav 625", "Taxim-O 200",
                                                                "Zifi 200", "Oflox 200",
                                                                "Cipro 500", "Clavam 625", "Moxikind-CV",
                                                                "Augmentin Duo", "Roxid 150"));

                                seedCategory(medicineRepository, localImages, random, "Gastro Care",
                                                Arrays.asList("Pantocid 40", "Pan 40", "Omez 20", "Digene Gel",
                                                                "Eno Sachet", "Rantac 150",
                                                                "Zinetac 300", "Aciloc 150", "Gelusil MPS",
                                                                "Cremaffin Plus"));

                                seedCategory(medicineRepository, localImages, random, "Vitamins",
                                                Arrays.asList("Limcee 500", "Shelcal 500", "Becosules Capsule",
                                                                "Neurobion Forte",
                                                                "Zincovit Tablet", "Evion 400", "Uprise-D3 60k",
                                                                "Seven Seas Cod Liver", "Revital H",
                                                                "Centrum Adult"));

                                seedCategory(medicineRepository, localImages, random, "Diabetes",
                                                Arrays.asList("Metformin 500", "Glycomet 500", "Glizid-M",
                                                                "Galvus Met 50/500",
                                                                "Jalra-M 50/500", "Zita-Met", "Istamet 50/500",
                                                                "Glimisave M2", "Amaryl 2mg",
                                                                "Trajenta 5mg"));
                        }
                } catch (InvalidDataAccessResourceUsageException ex) {
                        // Most likely "table or view does not exist".
                        // Skip seeding for now; schema will be created on a later run.
                }
        }

        private void seedCategory(MedicineRepository repo, List<String> images, Random random, String category,
                        List<String> names) {
                for (String name : names) {
                        Medicine m = Medicine.builder()
                                        .mName(name)
                                        .mPrice(20 + random.nextInt(480))
                                        .mUnit(random.nextInt(30) + 5)
                                        .mCategory(category)
                                        .mImage(images.get(random.nextInt(images.size())))
                                        .build();
                        repo.save(m);
                }
        }
}
