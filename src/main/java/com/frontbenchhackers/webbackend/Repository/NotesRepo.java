package com.frontbenchhackers.webbackend.Repository;

import com.frontbenchhackers.webbackend.Model.Notes;
import com.frontbenchhackers.webbackend.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotesRepo extends JpaRepository<Notes, Long> {
    List<Notes> findByUser(Users user);

    void deleteByUserId(long id);

    @Query("SELECT n FROM Notes n WHERE " +
            "(LOWER(n.noteName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(n.noteFolder) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(n.noteKeywords) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND n.user.id = :userId")
    List<Notes> searchNotesByUser(@Param("searchTerm") String searchTerm, @Param("userId") Long userId);
}
