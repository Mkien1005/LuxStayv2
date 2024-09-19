package com.moclai.identityservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.moclai.identityservice.dto.request.UserCreationRequest;
import com.moclai.identityservice.dto.request.UserUpdateRequest;
import com.moclai.identityservice.dto.response.UserResponse;
import com.moclai.identityservice.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
