package com.studentms.controller;

import com.studentms.entity.AcademicHistory;
import com.studentms.repository.AcademicHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/academic-history")
@RequiredArgsConstructor
public class AcademicHistoryController {

    private final AcademicHistoryRepository academicHistoryRepository;

    @GetMapping
    public ResponseEntity<List<AcademicHistory>> getAllAcademicHistory() {
        return ResponseEntity.ok(academicHistoryRepository.findAll());
    }

    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<List<AcademicHistory>> getHistoryByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(academicHistoryRepository.findByRollNumber(rollNumber));
    }

    @PostMapping
    public ResponseEntity<AcademicHistory> createAcademicHistory(@RequestBody AcademicHistory history) {
        return ResponseEntity.ok(academicHistoryRepository.save(history));
    }
}
