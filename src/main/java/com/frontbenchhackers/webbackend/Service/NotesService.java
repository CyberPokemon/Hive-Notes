package com.frontbenchhackers.webbackend.Service;

import com.frontbenchhackers.webbackend.Model.Notes;
import com.frontbenchhackers.webbackend.Model.Users;
import com.frontbenchhackers.webbackend.Repository.NotesRepo;
import com.frontbenchhackers.webbackend.Repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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

    public void deleteNoteById(Long noteId, String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        Notes note = notesRepo.findById(noteId)
                .filter(n -> n.getUser().getId()==(user.getId())) // Ensure the user owns the note
                .orElseThrow(() -> new RuntimeException("Note not found or not owned by the user"));

        notesRepo.delete(note); // Delete the note
    }

    @Transactional
    public void deleteAllNotesByUser(String username) {
        // Fetch the user by username to get the userId
        Users user = userRepo.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // Delete all notes associated with this user
        notesRepo.deleteByUserId(user.getId());  // Use userId instead of username

    }

//    public List<Notes> searchNotes(String searchTerm, String username) {
//        Users user = userRepo.findByUsername(username);
//        if (user == null) {
//            throw new RuntimeException("User not found");
//        }
//        return notesRepo.searchNotesByUser(searchTerm, user.getId()); // Pass userId instead of username
//    }

//    public List<Map<String, Object>> getAllNotesFormatted(String username) {
//        Users user = userRepo.findByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException("User not found");
//        }
//
//        List<Notes> notesList = notesRepo.findByUser(user);
//
//        // Group notes by folder
//        Map<String, List<Map<String, Object>>> groupedNotes = notesList.stream()
//                .collect(Collectors.groupingBy(
//                        Notes::getNoteFolder,
//                        Collectors.mapping(note -> Map.of(
//                                "title", note.getNoteName(),
//                                "keywords", note.getNoteKeywords(),
//                                "content", note.getNoteMainContent()
//                        ), Collectors.toList())
//                ));
//
//        // Convert map to list format required
//        return groupedNotes.entrySet().stream()
//                .map(entry -> Map.of(
//                        "name", entry.getKey(),
//                        "notes", entry.getValue()
//                ))
//                .collect(Collectors.toList());
//    }

//    public List<Map<String, Object>> getAllNotesFormatted(String username) {
//        Users user = userRepo.findByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException("User not found");
//        }
//
//        List<Notes> notesList = notesRepo.findByUser(user);
//        if (notesList == null) {
//            notesList = Collections.emptyList();
//        }
//        try {
//            // Group notes by folder name
//            Map<String, List<Map<String, Object>>> groupedNotes = notesList.stream()
//                    .collect(Collectors.groupingBy(
//                            note -> note.getNoteFolder() != null ? note.getNoteFolder() : "Uncategorized",
//                            Collectors.mapping(note -> Map.of(
//                                    "title", note.getNoteName(),
//                                    "keywords", note.getNoteKeywords() != null ? note.getNoteKeywords() : "",
//                                    "content", note.getNoteMainContent() != null ? "<p>No Content</p>" : note.getNoteMainContent()
//                            ), Collectors.toList())
//                    ));
//
//            // Convert to final JSON-like structure
//            return groupedNotes.entrySet().stream()
//                    .map(entry -> Map.of(
//                            "name", entry.getKey(),
//                            "notes", entry.getValue()
//                    ))
//                    .collect(Collectors.toList());
//        }
//        catch (Exception e)
//        {
//            System.out.println("error ocurerd here");
//        }
//        return null;
//    }


    public List<Map<String, Object>> getAllNotesFormatted(String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        List<Notes> notesList = notesRepo.findByUser(user);
        if (notesList == null) {
            notesList = Collections.emptyList();
        }
        try {
            // Group notes by folder name
            Map<String, List<Map<String, Object>>> groupedNotes = notesList.stream()
                    .collect(Collectors.groupingBy(
                            note -> Optional.ofNullable(note.getNoteFolder()).orElse("Uncategorized"),
                            Collectors.mapping(note -> {
                                // Safely map each note
                                return Map.of(
                                        "title", Optional.ofNullable(note.getNoteName()).orElse("Untitled Note"),
                                        "keywords", Optional.ofNullable(note.getNoteKeywords()).orElse(""),
                                        "content", Optional.ofNullable(note.getNoteMainContent()).orElse("<p>No Content</p>"),
                                        "contentid", Optional.ofNullable(note.getId()).orElse(-1L)
                                );
                            }, Collectors.toList())
                    ));

            // Convert to final JSON-like structure
            return groupedNotes.entrySet().stream()
                    .map(entry -> Map.of(
                            "name", entry.getKey(),
                            "notes", entry.getValue()
                    ))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.out.println("Error occurred in getAllNotesFormatted: " + e.getMessage());
//            e.printStackTrace(); // Print full stack trace for better debugging
            return Collections.emptyList();  // Return an empty list in case of error
        }
    }


    public List<Map<String, Object>> searchNotes(String searchTerm, String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Fetch notes by search term and user ID
        List<Notes> notes = notesRepo.searchNotesByUser(searchTerm, user.getId());

        // Group notes by folder name
        Map<String, List<Map<String, Object>>> groupedNotes = new HashMap<>();

        for (Notes note : notes) {
            // Convert each note to the required format
            Map<String, Object> noteData = new HashMap<>();
            noteData.put("title", note.getNoteName());
            noteData.put("content", note.getNoteMainContent());
            noteData.put("keywords", note.getNoteKeywords());
            noteData.put("contentid", note.getId()); // Assuming 'id' is the content ID

            // Add to the corresponding folder group
            groupedNotes.computeIfAbsent(note.getNoteFolder(), k -> new ArrayList<>()).add(noteData);
        }

        // Convert to required format
        List<Map<String, Object>> formattedResponse = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : groupedNotes.entrySet()) {
            Map<String, Object> folderData = new HashMap<>();
            folderData.put("name", entry.getKey());  // Folder name
            folderData.put("notes", entry.getValue()); // List of notes in the folder
            formattedResponse.add(folderData);
        }

        return formattedResponse;
    }

}
