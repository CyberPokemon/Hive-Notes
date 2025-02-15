package com.frontbenchhackers.webbackend.Controller;

import com.frontbenchhackers.webbackend.Model.Notes;
import com.frontbenchhackers.webbackend.Model.Users;
import com.frontbenchhackers.webbackend.Service.JWTService;
import com.frontbenchhackers.webbackend.Service.NotesService;
import com.frontbenchhackers.webbackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class UserAuthenticationController {

//    @Autowired
//    private NotesService notesService;
//
//    @Autowired
//    private JWTService jwtService;

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


//    @GetMapping("/all")
//    public ResponseEntity<List<Map<String, Object>>> getAllNotes(@RequestHeader("Authorization") String token) {
//        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
//        List<Map<String, Object>> notesResponse = notesService.getAllNotesFormatted(username);
//        return ResponseEntity.ok(notesResponse);
//    }
//
//    @PostMapping("/createnote")
//    public ResponseEntity<Notes> createNote(@RequestBody Notes note, @RequestHeader("Authorization") String token) {
//        System.out.println(note);
//        String username = jwtService.extractUsername(token.substring(7)); // Remove "Bearer " prefix
//        return ResponseEntity.ok(notesService.createNote(note, username));
//    }
}
