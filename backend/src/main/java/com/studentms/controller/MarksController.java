package com.studentms.controller;

import com.studentms.entity.Marks;
import com.studentms.repository.MarksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarksController {

    private final MarksRepository marksRepository;

    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(marksRepository.findAll());
    }

    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<List<Marks>> getMarksByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(marksRepository.findByRollNumber(rollNumber));
    }

    @PostMapping
    public ResponseEntity<Marks> createMarks(@RequestBody Marks marks) {
        if (marks.getTotal() == null && marks.getInternal() != null) {
            int total = (marks.getInternal() != null ? marks.getInternal() : 0) +
                        (marks.getAssignment() != null ? marks.getAssignment() : 0) +
                        (marks.getMidterm() != null ? marks.getMidterm() : 0) +
                        (marks.getFinalExam() != null ? marks.getFinalExam() : 0);
            marks.setTotal(total);
            if (total >= 90) { marks.setGrade("A+"); marks.setGradePoint(4.0); }
            else if (total >= 80) { marks.setGrade("A"); marks.setGradePoint(3.8); }
            else if (total >= 70) { marks.setGrade("B+"); marks.setGradePoint(3.4); }
            else if (total >= 60) { marks.setGrade("B"); marks.setGradePoint(3.0); }
            else { marks.setGrade("C"); marks.setGradePoint(2.5); }
        }
        return ResponseEntity.ok(marksRepository.save(marks));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marks> updateMarks(@PathVariable UUID id, @RequestBody Marks marks) {
        marks.setId(id);
        return ResponseEntity.ok(marksRepository.save(marks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarks(@PathVariable UUID id) {
        marksRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
