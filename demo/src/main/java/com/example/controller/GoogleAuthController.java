package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.service.GoogleAuthService;
import com.example.dto.TokenDto;
import com.example.dto.AuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class GoogleAuthController {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthController.class);

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody TokenDto tokenDto) {
        logger.info("Received token DTO: {}", tokenDto);

        String accessToken = tokenDto.getToken();
        logger.info("Extracted access token: {}", accessToken);

        if (accessToken == null || accessToken.isEmpty()) {
            logger.error("Access token received from frontend is null or empty.");
            return ResponseEntity.badRequest().body("Access token is null or empty.");
        }

        try {
            Map<String, Object> userInfoAndToken = googleAuthService.authenticateGoogleToken(accessToken);
            logger.info("Generated session token: {}", userInfoAndToken.get("token"));
            return ResponseEntity.ok(userInfoAndToken);
        } catch (Exception e) {
            logger.error("Error during authentication", e);
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }
}