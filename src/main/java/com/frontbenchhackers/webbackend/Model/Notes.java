package com.frontbenchhackers.webbackend.Model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "notes")
public class Notes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String noteName;
    private String noteFolder;
    private String noteKeywords;

    @Column(columnDefinition = "TEXT") // For storing large text
    private String noteMainContent;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    private Date createdAt = new Date();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNoteName() {
        return noteName;
    }

    public void setNoteName(String noteName) {
        this.noteName = noteName;
    }

    public String getNoteFolder() {
        return noteFolder;
    }

    public void setNoteFolder(String noteFolder) {
        this.noteFolder = noteFolder;
    }

    public String getNoteKeywords() {
        return noteKeywords;
    }

    public void setNoteKeywords(String noteKeywords) {
        this.noteKeywords = noteKeywords;
    }

    public String getNoteMainContent() {
        return noteMainContent;
    }

    public void setNoteMainContent(String noteMainContent) {
        this.noteMainContent = noteMainContent;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
