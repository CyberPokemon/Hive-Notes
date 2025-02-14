package com.frontbenchhackers.webbackend.Controller;

import com.frontbenchhackers.webbackend.Model.Notes;
import com.frontbenchhackers.webbackend.Service.JWTService;
import com.frontbenchhackers.webbackend.Service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NotesService notesService;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/createnote")
    public ResponseEntity<Notes> createNote(@RequestBody Notes note, @RequestHeader("Authorization") String token) {
        System.out.println(note);
        String username = jwtService.extractUsername(token.substring(7)); // Remove "Bearer " prefix
        return ResponseEntity.ok(notesService.createNote(note, username));
    }

    @PostMapping("/updatenote/{noteId}")
    public ResponseEntity<Notes> updateNote(@PathVariable Long noteId, @RequestBody Notes updatedNote, @RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7));
        return ResponseEntity.ok(notesService.updateNote(noteId, updatedNote, username));
    }

    // Fetch all notes (without main content)
    @GetMapping("/all")
    public ResponseEntity<List<Notes>> getAllNotes(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", "")); // Extract username from JWT
        List<Notes> notes = notesService.getAllNotes(username);
        return ResponseEntity.ok(notes);
    }

    // Fetch a specific note's full content
    @GetMapping("/{id}")
    public ResponseEntity<String> getNoteContent(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Notes> note = notesService.getNoteById(id, username);

        return note.map(n -> ResponseEntity.ok(n.getNoteMainContent()))
                .orElseGet(() -> ResponseEntity.status(404).body("Note not found or not owned by user"));
    }

    @DeleteMapping("/delete/{noteId}")
    public ResponseEntity<String> deleteNote(@PathVariable Long noteId, @RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7)); // Remove "Bearer " prefix

        try {
            notesService.deleteNoteById(noteId, username);
            return ResponseEntity.ok("Note deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Note not found or not owned by the user");
        }
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllNotes(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7)); // Extract username from JWT

        try {
            notesService.deleteAllNotesByUser(username);  // Delete all notes for that user
            return ResponseEntity.ok("All notes deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error deleting notes: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Notes>> searchNotes(@RequestParam String searchTerm, @RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7)); // Remove "Bearer " prefix
        List<Notes> notes = notesService.searchNotes(searchTerm, username);

        if (notes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        return ResponseEntity.ok(notes);
    }
}
