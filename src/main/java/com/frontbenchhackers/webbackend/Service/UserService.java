package com.frontbenchhackers.webbackend.Service;

import com.frontbenchhackers.webbackend.Model.Users;
import com.frontbenchhackers.webbackend.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService {


    @Autowired
    private UserRepo repo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public ResponseEntity<String> register(Users user) {
        if (repo.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return ResponseEntity.ok("User registered successfully");
    }



    public String verify(Users user) {
        System.out.println(user);

        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
        if (authentication.isAuthenticated()) {
//            System.out.println("User Authenticated: " + user.getUsername());
            return jwtService.generateToken(user.getUsername());
        } else {
//            System.out.println("Authentication Failed for: " + user.getUsername());
        }
        return "FAIL";
    }
}
