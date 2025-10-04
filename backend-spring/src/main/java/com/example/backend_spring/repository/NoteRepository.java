package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Note;
import com.example.backend_spring.entity.Note.Visibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    Page<Note> findByOwnerId(Long ownerId, Pageable pageable);
    
    @Query("SELECT n FROM Note n WHERE n.owner.id = :ownerId " +
           "AND LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Note> searchByOwnerAndTitle(
        @Param("ownerId") Long ownerId,
        @Param("query") String query,
        Pageable pageable
    );
    
    @Query("SELECT DISTINCT n FROM Note n " +
           "LEFT JOIN n.tags t " +
           "WHERE n.owner.id = :ownerId " +
           "AND (COALESCE(:query, '') = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (COALESCE(:tag, '') = '' OR t.label = :tag) " +
           "AND (:visibility IS NULL OR n.visibility = :visibility)")
    Page<Note> searchNotes(
        @Param("ownerId") Long ownerId,
        @Param("query") String query,
        @Param("tag") String tag,
        @Param("visibility") Visibility visibility,
        Pageable pageable
    );
    
    @Query("SELECT n FROM Note n " +
           "LEFT JOIN n.shares s " +
           "WHERE (n.owner.id = :userId OR s.sharedWithUser.id = :userId) " +
           "AND n.id = :noteId")
    Optional<Note> findByIdAndAccessibleByUser(
        @Param("noteId") Long noteId,
        @Param("userId") Long userId
    );
}