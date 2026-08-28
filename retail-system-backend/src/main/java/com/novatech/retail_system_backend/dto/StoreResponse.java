package com.novatech.retail_system_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreResponse {

    private Long id;
    private String storeName;
    private String address;
    private String city;
    private String state;
    private String phone;
    private String email;
}
