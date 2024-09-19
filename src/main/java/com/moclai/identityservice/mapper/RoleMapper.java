package com.moclai.identityservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.moclai.identityservice.dto.request.RoleRequest;
import com.moclai.identityservice.dto.response.RoleResponse;
import com.moclai.identityservice.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
