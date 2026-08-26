package com.studentms.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String username;
    private String email;
    private RoleDto role;
    private boolean enabled;
}
