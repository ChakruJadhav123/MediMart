package com.medimart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Resolve the absolute path to the frontend public images directory
        Path currentPath = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        Path projectRoot = currentPath.getFileName().toString().equals("backend") 
            ? currentPath.getParent() 
            : currentPath;
            
        Path imagesPath = projectRoot.resolve("frontend/public/images").toAbsolutePath().normalize();
        String imagesLocation = "file:" + imagesPath.toString().replace("\\", "/") + "/";

        // Map /images/** and /api/images/** to the folder
        registry.addResourceHandler("/images/**", "/api/images/**")
                .addResourceLocations(imagesLocation)
                .setCachePeriod(0);
    }
}
