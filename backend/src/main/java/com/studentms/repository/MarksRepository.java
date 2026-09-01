package com.studentms.repository;

import com.studentms.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MarksRepository extends JpaRepository<Marks, UUID> {
    List<Marks> findByStudentId(UUID studentId);
    List<Marks> findByRollNumber(String rollNumber);
}
