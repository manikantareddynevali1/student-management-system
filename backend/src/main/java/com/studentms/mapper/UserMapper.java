package com.studentms.mapper;

import com.studentms.dto.RoleDto;
import com.studentms.dto.UserDto;
import com.studentms.entity.Role;
import com.studentms.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "role.id", target = "role.id")
    @Mapping(source = "role.name", target = "role.name")
    UserDto toDto(User user);

    default RoleDto map(Role role) {
        if (role == null) {
            return null;
        }
        RoleDto roleDto = new RoleDto();
        roleDto.setId(role.getId());
        roleDto.setName(role.getName());
        return roleDto;
    }
}
