package com.frontbenchhackers.webbackend.Controller;

import com.frontbenchhackers.webbackend.Model.Users;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class UserAuthenticationController {

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody Users user) {
        System.out.println("imput details = "+user);
        return service.register(user);
    }
}
