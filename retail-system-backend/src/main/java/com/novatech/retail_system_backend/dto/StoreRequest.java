package com.novatech.retail_system_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class StoreRequest {

    @NotBlank(message = "Store name is required")
    private String storeName;
    private String address;
    private String city;
    private String state;
    private String phone;

    @Email(message = "Invalid email format")
    private String email;
}
