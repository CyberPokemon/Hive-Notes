package com.frontbenchhackers.webbackend.Controller;

import com.frontbenchhackers.webbackend.Model.Users;
import com.frontbenchhackers.webbackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class UserAuthenticationController {

    @Autowired
    private UserService service;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody Users user) {
        System.out.println("input details = "+user);
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Users user)
    {
        System.out.println(user);
        return service.verify(user);
    }
}
