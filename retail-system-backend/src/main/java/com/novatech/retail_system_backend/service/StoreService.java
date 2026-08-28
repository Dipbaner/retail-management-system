package com.novatech.retail_system_backend.service;

import com.novatech.retail_system_backend.dto.StoreRequest;
import com.novatech.retail_system_backend.dto.StoreResponse;
import com.novatech.retail_system_backend.exception.ResourceNotFoundException;
import com.novatech.retail_system_backend.model.Store;
import com.novatech.retail_system_backend.repository.StoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreService {

    private StoreRepository storeRepository;

    public StoreService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    public StoreResponse createStore(StoreRequest request){
        Store store = new Store();

        store.setStoreName(request.getStoreName());
        store.setAddress(request.getAddress());
        store.setCity(request.getCity());
        store.setState(request.getState());
        store.setPhone(request.getPhone());
        store.setEmail(request.getEmail());

        Store savedStore = storeRepository.save(store);

        return mapToResponse(savedStore);
    }

    public List<StoreResponse> getAllStores(){
        return storeRepository.findAll()
                .stream()
                .map(this :: mapToResponse)
                .toList();
    }

    public StoreResponse getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow( () -> new ResourceNotFoundException(
                        "Store not found with id : "+id)
                );
        return mapToResponse(store);
    }

    public StoreResponse updateStore(Long id, StoreRequest request) {

        Store store = storeRepository.findById(id)
                .orElseThrow( () -> new ResourceNotFoundException(
                        "Store not found with id : "+id)
                );

        store.setStoreName(request.getStoreName());
        store.setAddress(request.getAddress());
        store.setCity(request.getCity());
        store.setState(request.getState());
        store.setPhone(request.getPhone());
        store.setEmail(request.getEmail());

        Store updatedStore = storeRepository.save(store);

        return mapToResponse(updatedStore);
    }

    public void deleteStore(Long id) {
        if(!storeRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Store not found with id : "+id
            );
        }
        storeRepository.deleteById(id);
    }

    private StoreResponse mapToResponse(Store store) {

        return new StoreResponse(
                store.getId(),
                store.getStoreName(),
                store.getAddress(),
                store.getCity(),
                store.getState(),
                store.getPhone(),
                store.getEmail()
        );
    }
}
