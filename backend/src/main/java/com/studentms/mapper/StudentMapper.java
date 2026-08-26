package com.studentms.mapper;

import com.studentms.dto.StudentDto;
import com.studentms.entity.Student;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    StudentDto toDto(Student student);
    Student toEntity(StudentDto studentDto);
}
