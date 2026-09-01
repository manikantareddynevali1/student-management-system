package com.studentms.controller;

import com.studentms.entity.Student;
import com.studentms.repository.AttendanceRepository;
import com.studentms.repository.CourseRepository;
import com.studentms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        long totalAttendanceRecords = attendanceRepository.count();
        long presentCount = attendanceRepository.countByStatus("PRESENT");

        double avgCgpa = 0.0;
        List<Student> students = studentRepository.findAll();
        if (!students.isEmpty()) {
            double sum = students.stream()
                    .filter(s -> s.getCgpa() != null)
                    .mapToDouble(Student::getCgpa)
                    .sum();
            long count = students.stream().filter(s -> s.getCgpa() != null).count();
            if (count > 0) avgCgpa = sum / count;
        }

        double attendancePercentage = 100.0;
        if (totalAttendanceRecords > 0) {
            attendancePercentage = ((double) presentCount / totalAttendanceRecords) * 100.0;
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStudents", totalStudents);
        summary.put("totalCourses", totalCourses);
        summary.put("totalAttendanceRecords", totalAttendanceRecords);
        summary.put("presentCount", presentCount);
        summary.put("absentCount", totalAttendanceRecords - presentCount);
        summary.put("averageCgpa", Math.round(avgCgpa * 100.0) / 100.0);
        summary.put("attendanceRate", Math.round(attendancePercentage * 10.0) / 10.0);

        return ResponseEntity.ok(summary);
    }
}
