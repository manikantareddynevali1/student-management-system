package com.studentms.config;

import com.studentms.entity.*;
import com.studentms.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Ensure Roles exist
        List<String> roles = List.of("ADMIN", "FACULTY", "STUDENT");
        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
            }
        }

        Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
        Role facultyRole = roleRepository.findByName("FACULTY").orElse(null);
        Role studentRole = roleRepository.findByName("STUDENT").orElse(null);

        // Seed initial Admin if empty
        if (adminRole != null && userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@university.edu")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        // Seed initial Faculty if empty
        if (facultyRole != null && userRepository.findByUsername("faculty").isEmpty()) {
            userRepository.save(User.builder()
                    .username("faculty")
                    .email("faculty@university.edu")
                    .password(passwordEncoder.encode("faculty123"))
                    .role(facultyRole)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        // Seed initial Student User if empty
        if (studentRole != null && userRepository.findByUsername("student").isEmpty()) {
            userRepository.save(User.builder()
                    .username("student")
                    .email("student@university.edu")
                    .password(passwordEncoder.encode("student123"))
                    .role(studentRole)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        // Seed initial Student entity if empty
        if (studentRepository.count() == 0) {
            studentRepository.save(Student.builder()
                    .rollNumber("STU2026")
                    .fullName("Student User")
                    .department("Computer Science")
                    .email("student@university.edu")
                    .phone("555-0100")
                    .dob(LocalDate.of(2002, 5, 15))
                    .gender("MALE")
                    .address("123 Campus Way")
                    .semester(4)
                    .cgpa(3.85)
                    .createdAt(LocalDate.now())
                    .updatedAt(LocalDate.now())
                    .build());
        }

        // Seed initial Course entity if empty
        if (courseRepository.count() == 0) {
            courseRepository.save(Course.builder()
                    .courseCode("CS101")
                    .courseName("Data Structures & Algorithms")
                    .department("Computer Science")
                    .credits(4)
                    .instructor("Faculty User")
                    .description("Fundamental data structures and complexity analysis.")
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build());
        }

        // Seed initial Faculty entity if empty
        if (facultyRepository.count() == 0) {
            facultyRepository.save(Faculty.builder()
                    .facultyId("FAC001")
                    .name("Faculty User")
                    .email("faculty@university.edu")
                    .phone("555-0201")
                    .department("Computer Science")
                    .designation("Professor & HOD")
                    .coursesAssigned("CS101 - Data Structures")
                    .status("ACTIVE")
                    .build());
        }
    }
}
