package com.studentms.service.impl;

import com.studentms.dto.StudentDto;
import com.studentms.entity.Student;
import com.studentms.exception.ResourceNotFoundException;
import com.studentms.mapper.StudentMapper;
import com.studentms.repository.StudentRepository;
import com.studentms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        Student student = studentMapper.toEntity(studentDto);
        student.setCreatedAt(LocalDate.now());
        student.setUpdatedAt(LocalDate.now());
        return studentMapper.toDto(studentRepository.save(student));
    }

    @Override
    public StudentDto updateStudent(UUID id, StudentDto studentDto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        existing.setRollNumber(studentDto.getRollNumber());
        existing.setFullName(studentDto.getFullName());
        existing.setDepartment(studentDto.getDepartment());
        existing.setEmail(studentDto.getEmail());
        existing.setPhone(studentDto.getPhone());
        existing.setDob(studentDto.getDob());
        existing.setGender(studentDto.getGender());
        existing.setAddress(studentDto.getAddress());
        existing.setSemester(studentDto.getSemester());
        existing.setCgpa(studentDto.getCgpa());
        existing.setPhotoUrl(studentDto.getPhotoUrl());
        existing.setUpdatedAt(LocalDate.now());

        return studentMapper.toDto(studentRepository.save(existing));
    }

    @Override
    public void deleteStudent(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    @Override
    public StudentDto getStudentById(UUID id) {
        return studentRepository.findById(id)
                .map(studentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public Page<StudentDto> searchStudents(String keyword, Pageable pageable) {
        return studentRepository.search(keyword, pageable)
                .map(studentMapper::toDto);
    }
}
