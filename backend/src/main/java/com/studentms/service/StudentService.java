package com.studentms.service;

import com.studentms.dto.StudentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface StudentService {
    StudentDto createStudent(StudentDto studentDto);
    StudentDto updateStudent(UUID id, StudentDto studentDto);
    void deleteStudent(UUID id);
    StudentDto getStudentById(UUID id);
    Page<StudentDto> searchStudents(String keyword, Pageable pageable);
}
