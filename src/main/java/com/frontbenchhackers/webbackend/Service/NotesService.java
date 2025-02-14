package com.frontbenchhackers.webbackend.Service;

import com.frontbenchhackers.webbackend.Model.Notes;
import com.frontbenchhackers.webbackend.Model.Users;
import com.frontbenchhackers.webbackend.Repository.NotesRepo;
import com.frontbenchhackers.webbackend.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotesService {

    @Autowired
    private NotesRepo notesRepo;

    @Autowired
    private UserRepo userRepo;

    public Notes createNote(Notes note, String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        note.setUser(user);
        return notesRepo.save(note);
    }

    public Notes updateNote(Long noteId, Notes updatedNote, String username) {
        return notesRepo.findById(noteId).map(note -> {
            if (!note.getUser().getUsername().equals(username)) {
                throw new RuntimeException("Unauthorized to update this note");
            }
            note.setNoteName(updatedNote.getNoteName());
            note.setNoteFolder(updatedNote.getNoteFolder());
            note.setNoteKeywords(updatedNote.getNoteKeywords());
            note.setNoteMainContent(updatedNote.getNoteMainContent());
            return notesRepo.save(note);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public List<Notes> getAllNotes(String username)
    {
        Users user = userRepo.findByUsername(username);
        if(user==null)
        {
            throw new UsernameNotFoundException("User not found");
        }
        return notesRepo.findByUser(user);
    }

    public Optional<Notes> getNoteById(Long noteId, String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return notesRepo.findById(noteId)
                .filter(note -> note.getUser().getId() == user.getId()); // Compare using `==`
    }

}
