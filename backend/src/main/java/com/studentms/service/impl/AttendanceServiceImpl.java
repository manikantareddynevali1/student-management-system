package com.studentms.service.impl;

import com.studentms.dto.AttendanceDto;
import com.studentms.entity.Attendance;
import com.studentms.entity.Course;
import com.studentms.entity.Student;
import com.studentms.exception.ResourceNotFoundException;
import com.studentms.repository.AttendanceRepository;
import com.studentms.repository.CourseRepository;
import com.studentms.repository.StudentRepository;
import com.studentms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public AttendanceDto createAttendance(AttendanceDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));

        Course course = null;
        if (dto.getCourseId() != null) {
            course = courseRepository.findById(dto.getCourseId()).orElse(null);
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .course(course)
                .date(dto.getDate())
                .status(dto.getStatus())
                .remarks(dto.getRemarks())
                .build();

        return mapToDto(attendanceRepository.save(attendance));
    }

    @Override
    @Transactional
    public AttendanceDto updateAttendance(UUID id, AttendanceDto dto) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));

        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));
            attendance.setStudent(student);
        }

        if (dto.getCourseId() != null) {
            Course course = courseRepository.findById(dto.getCourseId()).orElse(null);
            attendance.setCourse(course);
        }

        if (dto.getDate() != null) attendance.setDate(dto.getDate());
        if (dto.getStatus() != null) attendance.setStatus(dto.getStatus());
        if (dto.getRemarks() != null) attendance.setRemarks(dto.getRemarks());

        return mapToDto(attendanceRepository.save(attendance));
    }

    @Override
    @Transactional
    public void deleteAttendance(UUID id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record not found with id: " + id);
        }
        attendanceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByStudent(UUID studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AttendanceDto mapToDto(Attendance attendance) {
        AttendanceDto dto = new AttendanceDto();
        dto.setId(attendance.getId());
        if (attendance.getStudent() != null) {
            dto.setStudentId(attendance.getStudent().getId());
            dto.setStudentName(attendance.getStudent().getFullName());
            dto.setStudentRollNumber(attendance.getStudent().getRollNumber());
        }
        if (attendance.getCourse() != null) {
            dto.setCourseId(attendance.getCourse().getId());
            dto.setCourseName(attendance.getCourse().getCourseName());
            dto.setCourseCode(attendance.getCourse().getCourseCode());
        }
        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus());
        dto.setRemarks(attendance.getRemarks());
        return dto;
    }
}
