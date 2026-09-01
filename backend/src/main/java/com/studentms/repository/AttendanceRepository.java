package com.studentms.repository;

import com.studentms.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByStudentId(UUID studentId);
    List<Attendance> findByCourseId(UUID courseId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.status = :status")
    long countByStatus(String status);
}
