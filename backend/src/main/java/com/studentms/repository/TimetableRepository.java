package com.studentms.repository;

import com.studentms.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, UUID> {
    List<Timetable> findByFaculty(String faculty);
    List<Timetable> findByDay(String day);
}
