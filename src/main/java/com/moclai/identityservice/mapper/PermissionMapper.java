package com.moclai.identityservice.mapper;

import org.mapstruct.Mapper;

import com.moclai.identityservice.dto.request.PermissionRequest;
import com.moclai.identityservice.dto.response.PermissionResponse;
import com.moclai.identityservice.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
