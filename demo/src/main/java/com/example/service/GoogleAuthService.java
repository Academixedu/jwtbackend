package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleAuthService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthService.class);
    private static final String USER_INFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestTemplate restTemplate;

    public GoogleAuthService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> authenticateGoogleToken(String accessToken) {
        try {
            logger.info("Received access token: {}", accessToken);

            if (accessToken == null || accessToken.isEmpty()) {
                throw new IllegalArgumentException("Access token is null or empty.");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<Map> response = restTemplate.exchange(USER_INFO_ENDPOINT, HttpMethod.GET, entity, Map.class);
            Map<String, Object> userInfo = response.getBody();

            if (userInfo != null) {
                logUserInfo(userInfo);
                
                // Generate a session token (in this case, we're just using the user's ID)
                String sessionToken = (String) userInfo.get("sub");
                
                // Combine user info and session token
                Map<String, Object> result = new HashMap<>(userInfo);
                result.put("token", sessionToken);
                
                return result;
            } else {
                logger.error("Invalid access token.");
                throw new RuntimeException("Invalid access token.");
            }
        } catch (Exception e) {
            logger.error("Error verifying Google token", e);
            throw new RuntimeException("Error verifying Google token", e);
        }
    }

    private void logUserInfo(Map<String, Object> userInfo) {
        logger.info("User ID: {}", userInfo.get("sub"));
        logger.info("Email: {}", userInfo.get("email"));
        logger.info("Email Verified: {}", userInfo.get("email_verified"));
        logger.info("Name: {}", userInfo.get("name"));
        logger.info("Picture URL: {}", userInfo.get("picture"));
        logger.info("Locale: {}", userInfo.get("locale"));
        logger.info("Family Name: {}", userInfo.get("family_name"));
        logger.info("Given Name: {}", userInfo.get("given_name"));
    }
}