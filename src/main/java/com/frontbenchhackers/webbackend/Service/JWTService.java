package com.frontbenchhackers.webbackend.Service;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {

    private String secretkey;

    public JWTService()
    {
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("hmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretkey= Base64.getEncoder().encodeToString(sk.getEncoded());
        }
        catch (NoSuchAlgorithmException e)
        {
            throw new RuntimeException(e);
        }
    }

    public String generateToken(String username) {

//        System.out.println("SEcret key = "+secretkey);

        Map<String,Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+(100*60*30000)))
                .and()
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes= Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
//    public String extractUsername(String token) {
//        return Jwts.parser() // Use `parser()` instead of `parserBuilder()`
//                .verifyWith(getKey()) // Use `verifyWith()` instead of `setSigningKey()`
//                .build()
//                .parseSignedClaims(token) // Use `parseSignedClaims()` instead of `parseClaimsJws()`
//                .getPayload()
//                .getSubject();
//    }

    public String extractUsername(String token) {
        try {
//            System.out.println("Extracting username from token: " + token);
            String username = Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
//            System.out.println("Extracted username: " + username);
            return username;
        } catch (Exception e) {
//            System.out.println("JWT Token parsing error: " + e.getMessage());
            return null;
        }
    }

}
