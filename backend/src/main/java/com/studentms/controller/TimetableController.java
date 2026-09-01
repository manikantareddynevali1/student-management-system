package com.studentms.controller;

import com.studentms.entity.Timetable;
import com.studentms.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableRepository timetableRepository;

    @GetMapping
    public ResponseEntity<List<Timetable>> getAllTimetable() {
        return ResponseEntity.ok(timetableRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Timetable> createTimetable(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(timetableRepository.save(timetable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimetable(@PathVariable UUID id) {
        timetableRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
