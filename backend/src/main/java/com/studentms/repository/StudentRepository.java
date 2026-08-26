package com.studentms.repository;

import com.studentms.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {

    @Query("SELECT s FROM Student s WHERE " +
            "(CAST(:keyword AS string) IS NULL OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "OR LOWER(s.email) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))" )
    Page<Student> search(@Param("keyword") String keyword, Pageable pageable);
}
